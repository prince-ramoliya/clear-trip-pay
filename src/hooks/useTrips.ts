import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DbTrip, DbTripMember, DbExpense, DbExpenseParticipant } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export interface TripData {
  trip: DbTrip;
  members: DbTripMember[];
  expenses: (DbExpense & { participants: DbExpenseParticipant[] })[];
}

export function useTrips(userId: string | undefined) {
  const [trips, setTrips] = useState<DbTrip[]>([]);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [currentTripData, setCurrentTripData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch all trips for user
  const fetchTrips = useCallback(async () => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTrips(data || []);
      
      // Set first trip as current if none selected
      if (!currentTripId && data && data.length > 0) {
        setCurrentTripId(data[0].id);
      }
    } catch (error: any) {
      toast({
        title: "Error loading trips",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userId, currentTripId, toast]);

  // Fetch current trip details
  const fetchTripDetails = useCallback(async () => {
    if (!currentTripId) {
      setCurrentTripData(null);
      return;
    }

    try {
      // Fetch trip
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('id', currentTripId)
        .maybeSingle();

      if (tripError) throw tripError;
      if (!trip) {
        setCurrentTripData(null);
        return;
      }

      // Fetch members
      const { data: members, error: membersError } = await supabase
        .from('trip_members')
        .select('*')
        .eq('trip_id', currentTripId)
        .order('created_at', { ascending: true });

      if (membersError) throw membersError;

      // Fetch expenses with participants
      const { data: expenses, error: expensesError } = await supabase
        .from('expenses')
        .select('*')
        .eq('trip_id', currentTripId)
        .order('expense_date', { ascending: false });

      if (expensesError) throw expensesError;

      // Fetch all participants for these expenses
      const expenseIds = (expenses || []).map(e => e.id);
      let participants: DbExpenseParticipant[] = [];
      
      if (expenseIds.length > 0) {
        const { data: participantsData, error: participantsError } = await supabase
          .from('expense_participants')
          .select('*')
          .in('expense_id', expenseIds);

        if (participantsError) throw participantsError;
        participants = participantsData || [];
      }

      // Map participants to expenses
      const expensesWithParticipants = (expenses || []).map(expense => ({
        ...expense,
        participants: participants.filter(p => p.expense_id === expense.id),
      }));

      setCurrentTripData({
        trip,
        members: members || [],
        expenses: expensesWithParticipants,
      });
    } catch (error: any) {
      toast({
        title: "Error loading trip details",
        description: error.message,
        variant: "destructive",
      });
    }
  }, [currentTripId, toast]);

  // Create trip
  const createTrip = useCallback(async (
    tripData: { name: string; destination: string; startDate: string; endDate: string },
    memberNames: string[]
  ) => {
    if (!userId) return null;

    try {
      // Create trip
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert({
          name: tripData.name,
          destination: tripData.destination,
          start_date: tripData.startDate,
          end_date: tripData.endDate,
          created_by: userId,
        })
        .select()
        .single();

      if (tripError) throw tripError;

      // Add current user as a member
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .maybeSingle();

      const currentUserName = userProfile?.display_name || 'Me';
      
      // Create members (including current user)
      const allMembers = [
        { trip_id: trip.id, user_id: userId, display_name: currentUserName, is_registered: true },
        ...memberNames
          .filter(name => name.trim() && name.trim().toLowerCase() !== currentUserName.toLowerCase())
          .map(name => ({
            trip_id: trip.id,
            user_id: null,
            display_name: name.trim(),
            is_registered: false,
          })),
      ];

      if (allMembers.length > 0) {
        const { error: membersError } = await supabase
          .from('trip_members')
          .insert(allMembers);

        if (membersError) throw membersError;
      }

      await fetchTrips();
      setCurrentTripId(trip.id);
      
      toast({
        title: "Trip created!",
        description: `${trip.name} has been created successfully.`,
      });

      return trip;
    } catch (error: any) {
      toast({
        title: "Error creating trip",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  }, [userId, fetchTrips, toast]);

  // Add expense
  const addExpense = useCallback(async (expense: {
    title: string;
    amount: number;
    paidBy: string;
    participants: string[];
    category: string;
    date: string;
  }) => {
    if (!currentTripId || !userId) return null;

    try {
      // Create expense
      const { data: newExpense, error: expenseError } = await supabase
        .from('expenses')
        .insert({
          trip_id: currentTripId,
          title: expense.title,
          amount: expense.amount,
          paid_by: expense.paidBy,
          category: expense.category,
          expense_date: expense.date,
          created_by: userId,
        })
        .select()
        .single();

      if (expenseError) throw expenseError;

      // Add participants
      const participantRecords = expense.participants.map(memberId => ({
        expense_id: newExpense.id,
        member_id: memberId,
      }));

      const { error: participantsError } = await supabase
        .from('expense_participants')
        .insert(participantRecords);

      if (participantsError) throw participantsError;

      await fetchTripDetails();
      
      toast({
        title: "Expense added",
        description: `${expense.title} has been added.`,
      });

      return newExpense;
    } catch (error: any) {
      toast({
        title: "Error adding expense",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  }, [currentTripId, userId, fetchTripDetails, toast]);

  // Update expense
  const updateExpense = useCallback(async (
    expenseId: string,
    expense: {
      title: string;
      amount: number;
      paidBy: string;
      participants: string[];
      category: string;
      date: string;
    }
  ) => {
    if (!userId) return false;

    try {
      // Update expense
      const { error: expenseError } = await supabase
        .from('expenses')
        .update({
          title: expense.title,
          amount: expense.amount,
          paid_by: expense.paidBy,
          category: expense.category,
          expense_date: expense.date,
        })
        .eq('id', expenseId);

      if (expenseError) throw expenseError;

      // Delete existing participants
      const { error: deleteError } = await supabase
        .from('expense_participants')
        .delete()
        .eq('expense_id', expenseId);

      if (deleteError) throw deleteError;

      // Add new participants
      const participantRecords = expense.participants.map(memberId => ({
        expense_id: expenseId,
        member_id: memberId,
      }));

      const { error: participantsError } = await supabase
        .from('expense_participants')
        .insert(participantRecords);

      if (participantsError) throw participantsError;

      await fetchTripDetails();
      
      toast({
        title: "Expense updated",
        description: `${expense.title} has been updated.`,
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error updating expense",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [userId, fetchTripDetails, toast]);

  // Delete expense
  const removeExpense = useCallback(async (expenseId: string) => {
    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;

      await fetchTripDetails();
      
      toast({
        title: "Expense deleted",
        description: "The expense has been removed.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error deleting expense",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchTripDetails, toast]);

  // Join trip via invite code
  const joinTripByCode = useCallback(async (inviteCode: string) => {
    if (!userId) return null;

    try {
      // Find trip by invite code
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .select('*')
        .eq('invite_code', inviteCode.toLowerCase())
        .maybeSingle();

      if (tripError) throw tripError;
      if (!trip) {
        toast({
          title: "Invalid invite code",
          description: "No trip found with this invite code.",
          variant: "destructive",
        });
        return null;
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from('trip_members')
        .select('id')
        .eq('trip_id', trip.id)
        .eq('user_id', userId)
        .maybeSingle();

      if (existingMember) {
        setCurrentTripId(trip.id);
        toast({
          title: "Already a member",
          description: "You're already a member of this trip!",
        });
        return trip;
      }

      // Get user's display name
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .maybeSingle();

      // Add user as member
      const { error: memberError } = await supabase
        .from('trip_members')
        .insert({
          trip_id: trip.id,
          user_id: userId,
          display_name: profile?.display_name || 'New Member',
          is_registered: true,
        });

      if (memberError) throw memberError;

      await fetchTrips();
      setCurrentTripId(trip.id);

      toast({
        title: "Joined trip!",
        description: `You've joined ${trip.name}.`,
      });

      return trip;
    } catch (error: any) {
      toast({
        title: "Error joining trip",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  }, [userId, fetchTrips, toast]);

  // Add member to trip
  const addMember = useCallback(async (displayName: string) => {
    if (!currentTripId) return null;

    try {
      const { data: member, error } = await supabase
        .from('trip_members')
        .insert({
          trip_id: currentTripId,
          display_name: displayName,
          is_registered: false,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchTripDetails();
      
      toast({
        title: "Member added",
        description: `${displayName} has been added to the trip.`,
      });

      return member;
    } catch (error: any) {
      toast({
        title: "Error adding member",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  }, [currentTripId, fetchTripDetails, toast]);

  // Set up realtime subscriptions
  useEffect(() => {
    if (!userId) return;

    const tripsChannel = supabase
      .channel('trips-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, () => {
        fetchTrips();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(tripsChannel);
    };
  }, [userId, fetchTrips]);

  useEffect(() => {
    if (!currentTripId) return;

    const tripChannel = supabase
      .channel(`trip-${currentTripId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expenses', filter: `trip_id=eq.${currentTripId}` }, () => {
        fetchTripDetails();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trip_members', filter: `trip_id=eq.${currentTripId}` }, () => {
        fetchTripDetails();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'expense_participants' }, () => {
        fetchTripDetails();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(tripChannel);
    };
  }, [currentTripId, fetchTripDetails]);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchTrips();
    }
  }, [userId, fetchTrips]);

  useEffect(() => {
    if (currentTripId) {
      fetchTripDetails();
    }
  }, [currentTripId, fetchTripDetails]);

  return {
    trips,
    currentTripId,
    currentTripData,
    loading,
    setCurrentTripId,
    createTrip,
    addExpense,
    updateExpense,
    removeExpense,
    joinTripByCode,
    addMember,
    refreshTrips: fetchTrips,
    refreshTripDetails: fetchTripDetails,
  };
}

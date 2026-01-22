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
      const normalizedCode = inviteCode.trim().toLowerCase();
      if (!normalizedCode) return null;

      const { data, error } = await supabase.functions.invoke("join-trip-by-code", {
        body: { inviteCode: normalizedCode },
      });

      if (error) throw error;

      const tripId: string | undefined = (data as any)?.tripId;
      if (!tripId) {
        throw new Error("Join failed: no tripId returned");
      }

      // Now that the user is a member, we can safely fetch the trip via RLS
      const { data: trip, error: tripError } = await supabase
        .from("trips")
        .select("*")
        .eq("id", tripId)
        .maybeSingle();

      if (tripError) throw tripError;
      if (!trip) {
        throw new Error("Joined trip, but failed to load trip data");
      }

      await fetchTrips();
      setCurrentTripId(trip.id);

      toast({
        title: "Joined trip!",
        description: `You've joined ${trip.name}.`,
      });

      return trip;
    } catch (error: any) {
      const msg = (error?.message ?? "").toString();
      const isInvalid =
        msg.includes("INVALID_CODE") ||
        msg.toLowerCase().includes("not found") ||
        msg.toLowerCase().includes("404");

      toast({
        title: isInvalid ? "Invalid invite code" : "Error joining trip",
        description: isInvalid
          ? "No trip found with this invite code. Please check the code and try again."
          : msg,
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

  // Remove member from trip
  const removeMember = useCallback(async (memberId: string) => {
    if (!currentTripId) return false;

    try {
      // Check if member has any expenses
      const { data: memberExpenses } = await supabase
        .from('expenses')
        .select('id')
        .eq('trip_id', currentTripId)
        .eq('paid_by', memberId)
        .limit(1);

      if (memberExpenses && memberExpenses.length > 0) {
        toast({
          title: "Cannot remove member",
          description: "This member has paid for expenses. Reassign or delete those expenses first.",
          variant: "destructive",
        });
        return false;
      }

      // Check if member is a participant in any expenses
      const { data: participations } = await supabase
        .from('expense_participants')
        .select('id, expense_id')
        .eq('member_id', memberId);

      if (participations && participations.length > 0) {
        // Remove from all expense participations
        const { error: removeParticipationError } = await supabase
          .from('expense_participants')
          .delete()
          .eq('member_id', memberId);

        if (removeParticipationError) throw removeParticipationError;
      }

      // Delete member
      const { error } = await supabase
        .from('trip_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      await fetchTripDetails();
      
      toast({
        title: "Member removed",
        description: "The member has been removed from the trip.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error removing member",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [currentTripId, fetchTripDetails, toast]);

  // Update member name
  const updateMemberName = useCallback(async (memberId: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('trip_members')
        .update({ display_name: newName })
        .eq('id', memberId);

      if (error) throw error;

      await fetchTripDetails();
      
      toast({
        title: "Member updated",
        description: "Member name has been updated.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error updating member",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchTripDetails, toast]);

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

  // Update trip (admin only)
  const updateTrip = useCallback(async (
    tripId: string,
    data: { name: string; destination: string; startDate: string; endDate: string }
  ) => {
    try {
      const { error } = await supabase
        .from('trips')
        .update({
          name: data.name,
          destination: data.destination,
          start_date: data.startDate,
          end_date: data.endDate,
        })
        .eq('id', tripId);

      if (error) throw error;

      await fetchTrips();
      await fetchTripDetails();
      
      toast({
        title: "Trip updated",
        description: "Trip details have been updated.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error updating trip",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchTrips, fetchTripDetails, toast]);

  // Delete trip (admin only)
  const deleteTrip = useCallback(async (tripId: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) throw error;

      setCurrentTripId(null);
      await fetchTrips();
      
      toast({
        title: "Trip deleted",
        description: "The trip has been deleted.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error deleting trip",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchTrips, toast]);

  // Leave trip (for non-admin members)
  const leaveTrip = useCallback(async () => {
    if (!currentTripId || !userId) return false;

    try {
      // Find the current user's membership
      const { data: membership, error: findError } = await supabase
        .from('trip_members')
        .select('id')
        .eq('trip_id', currentTripId)
        .eq('user_id', userId)
        .maybeSingle();

      if (findError) throw findError;
      if (!membership) {
        toast({
          title: "Error",
          description: "You are not a member of this trip.",
          variant: "destructive",
        });
        return false;
      }

      // Check if user has paid for any expenses
      const { data: userExpenses } = await supabase
        .from('expenses')
        .select('id')
        .eq('trip_id', currentTripId)
        .eq('paid_by', membership.id)
        .limit(1);

      if (userExpenses && userExpenses.length > 0) {
        toast({
          title: "Cannot leave trip",
          description: "You have paid for expenses. Reassign or delete those expenses first.",
          variant: "destructive",
        });
        return false;
      }

      // Remove from expense participations
      const { error: removeParticipationError } = await supabase
        .from('expense_participants')
        .delete()
        .eq('member_id', membership.id);

      if (removeParticipationError) throw removeParticipationError;

      // Delete membership
      const { error } = await supabase
        .from('trip_members')
        .delete()
        .eq('id', membership.id);

      if (error) throw error;

      setCurrentTripId(null);
      await fetchTrips();
      
      toast({
        title: "Left trip",
        description: "You have left the trip successfully.",
      });

      return true;
    } catch (error: any) {
      toast({
        title: "Error leaving trip",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [currentTripId, userId, fetchTrips, toast]);

  return {
    trips,
    currentTripId,
    currentTripData,
    loading,
    setCurrentTripId,
    createTrip,
    updateTrip,
    deleteTrip,
    addExpense,
    updateExpense,
    removeExpense,
    joinTripByCode,
    addMember,
    removeMember,
    updateMemberName,
    leaveTrip,
    refreshTrips: fetchTrips,
    refreshTripDetails: fetchTripDetails,
  };
}

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DbTrip, DbTripMember, DbExpense, DbExpenseParticipant } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export interface TripData {
  trip: DbTrip;
  members: DbTripMember[];
  expenses: (DbExpense & { participants: DbExpenseParticipant[] })[];
}

// Cache for trip data - persists across re-renders
const tripDataCache = new Map<string, TripData>();

export function useTrips(userId: string | undefined) {
  const [trips, setTrips] = useState<DbTrip[]>([]);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [currentTripData, setCurrentTripData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Track if initial load is complete
  const initialLoadComplete = useRef(false);
  const fetchingRef = useRef(false);

  // Fetch all trips for user - optimized with minimal loading state
  const fetchTrips = useCallback(async (showLoading = true) => {
    if (!userId) return;
    
    try {
      if (showLoading && !initialLoadComplete.current) {
        setLoading(true);
      }
      
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
      
      initialLoadComplete.current = true;
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

  // Fetch current trip details - OPTIMIZED with parallel queries and caching
  const fetchTripDetails = useCallback(async (forceRefresh = false) => {
    if (!currentTripId) {
      setCurrentTripData(null);
      return;
    }

    // Prevent concurrent fetches
    if (fetchingRef.current && !forceRefresh) return;
    fetchingRef.current = true;

    // Show cached data immediately if available
    const cachedData = tripDataCache.get(currentTripId);
    if (cachedData && !forceRefresh) {
      setCurrentTripData(cachedData);
    }

    try {
      // Fetch trip, members, and expenses in PARALLEL
      const [tripResult, membersResult, expensesResult] = await Promise.all([
        supabase
          .from('trips')
          .select('*')
          .eq('id', currentTripId)
          .maybeSingle(),
        supabase
          .from('trip_members')
          .select('*')
          .eq('trip_id', currentTripId)
          .order('created_at', { ascending: true }),
        supabase
          .from('expenses')
          .select('*')
          .eq('trip_id', currentTripId)
          .order('expense_date', { ascending: false })
      ]);

      if (tripResult.error) throw tripResult.error;
      if (membersResult.error) throw membersResult.error;
      if (expensesResult.error) throw expensesResult.error;

      const trip = tripResult.data;
      const members = membersResult.data || [];
      const expenses = expensesResult.data || [];

      if (!trip) {
        setCurrentTripData(null);
        tripDataCache.delete(currentTripId);
        return;
      }

      // Fetch participants only if there are expenses
      let participants: DbExpenseParticipant[] = [];
      if (expenses.length > 0) {
        const expenseIds = expenses.map(e => e.id);
        const { data: participantsData, error: participantsError } = await supabase
          .from('expense_participants')
          .select('*')
          .in('expense_id', expenseIds);

        if (participantsError) throw participantsError;
        participants = participantsData || [];
      }

      // Map participants to expenses
      const expensesWithParticipants = expenses.map(expense => ({
        ...expense,
        participants: participants.filter(p => p.expense_id === expense.id),
      }));

      const tripData: TripData = {
        trip,
        members,
        expenses: expensesWithParticipants,
      };

      // Update cache and state
      tripDataCache.set(currentTripId, tripData);
      setCurrentTripData(tripData);
    } catch (error: any) {
      toast({
        title: "Error loading trip details",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      fetchingRef.current = false;
    }
  }, [currentTripId, toast]);

  // Pre-fetch trip data when hovering/selecting
  const prefetchTrip = useCallback(async (tripId: string) => {
    if (tripDataCache.has(tripId)) return; // Already cached
    
    try {
      const [tripResult, membersResult, expensesResult] = await Promise.all([
        supabase.from('trips').select('*').eq('id', tripId).maybeSingle(),
        supabase.from('trip_members').select('*').eq('trip_id', tripId).order('created_at', { ascending: true }),
        supabase.from('expenses').select('*').eq('trip_id', tripId).order('expense_date', { ascending: false })
      ]);

      if (tripResult.error || membersResult.error || expensesResult.error) return;
      if (!tripResult.data) return;

      const expenses = expensesResult.data || [];
      let participants: DbExpenseParticipant[] = [];
      
      if (expenses.length > 0) {
        const { data } = await supabase
          .from('expense_participants')
          .select('*')
          .in('expense_id', expenses.map(e => e.id));
        participants = data || [];
      }

      tripDataCache.set(tripId, {
        trip: tripResult.data,
        members: membersResult.data || [],
        expenses: expenses.map(e => ({
          ...e,
          participants: participants.filter(p => p.expense_id === e.id),
        })),
      });
    } catch {
      // Silent fail for prefetch
    }
  }, []);

  // Create trip with optimistic update
  const createTrip = useCallback(async (
    tripData: { name: string; destination: string; startDate: string; endDate: string; inviteCode?: string; memberMode?: 'automatic' | 'manual' },
    memberNames: string[]
  ) => {
    if (!userId) return null;

    try {
      const memberMode = tripData.memberMode || (tripData.inviteCode ? 'automatic' : 'manual');
      
      const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert({
          name: tripData.name,
          destination: tripData.destination,
          start_date: tripData.startDate,
          end_date: tripData.endDate,
          created_by: userId,
          member_mode: memberMode,
          ...(tripData.inviteCode ? { invite_code: tripData.inviteCode } : {}),
        })
        .select()
        .single();

      if (tripError) throw tripError;

      const { data: userProfile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', userId)
        .maybeSingle();

      const currentUserName = userProfile?.display_name || 'Me';
      
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

      // Optimistic update - add to trips immediately
      setTrips(prev => [trip, ...prev]);
      setCurrentTripId(trip.id);
      
      // Fetch in background
      fetchTrips(false);
      
      toast({
        title: "Trip created!",
        description: `${trip.name} has been created successfully.`,
        variant: "success",
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

  // Add expense with optimistic update
  const addExpense = useCallback(async (expense: {
    title: string;
    amount: number;
    paidBy: string;
    participants: string[];
    category: string;
    date: string;
  }) => {
    if (!currentTripId || !userId || !currentTripData) return null;

    // Create optimistic expense
    const optimisticId = `temp-${Date.now()}`;
    const optimisticExpense = {
      id: optimisticId,
      trip_id: currentTripId,
      title: expense.title,
      amount: expense.amount,
      paid_by: expense.paidBy,
      category: expense.category,
      expense_date: expense.date,
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      participants: expense.participants.map(memberId => ({
        id: `temp-p-${memberId}`,
        expense_id: optimisticId,
        member_id: memberId,
        created_at: new Date().toISOString(),
      })),
    };

    // Optimistic update
    setCurrentTripData(prev => prev ? {
      ...prev,
      expenses: [optimisticExpense, ...prev.expenses],
    } : prev);

    try {
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

      const participantRecords = expense.participants.map(memberId => ({
        expense_id: newExpense.id,
        member_id: memberId,
      }));

      const { error: participantsError } = await supabase
        .from('expense_participants')
        .insert(participantRecords);

      if (participantsError) throw participantsError;

      // Refresh to get real data
      fetchTripDetails(true);
      
      toast({
        title: "Expense added",
        description: `${expense.title} has been added.`,
        variant: "success",
      });

      return newExpense;
    } catch (error: any) {
      // Rollback optimistic update
      fetchTripDetails(true);
      
      toast({
        title: "Error adding expense",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  }, [currentTripId, userId, currentTripData, fetchTripDetails, toast]);

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

      const { error: deleteError } = await supabase
        .from('expense_participants')
        .delete()
        .eq('expense_id', expenseId);

      if (deleteError) throw deleteError;

      const participantRecords = expense.participants.map(memberId => ({
        expense_id: expenseId,
        member_id: memberId,
      }));

      const { error: participantsError } = await supabase
        .from('expense_participants')
        .insert(participantRecords);

      if (participantsError) throw participantsError;

      fetchTripDetails(true);
      
      toast({
        title: "Expense updated",
        description: `${expense.title} has been updated.`,
        variant: "success",
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

  // Delete expense with optimistic update
  const removeExpense = useCallback(async (expenseId: string) => {
    // Optimistic update
    setCurrentTripData(prev => prev ? {
      ...prev,
      expenses: prev.expenses.filter(e => e.id !== expenseId),
    } : prev);

    try {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', expenseId);

      if (error) throw error;
      
      toast({
        title: "Expense deleted",
        description: "The expense has been removed.",
        variant: "success",
      });

      return true;
    } catch (error: any) {
      // Rollback
      fetchTripDetails(true);
      
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

      const { data: trip, error: tripError } = await supabase
        .from("trips")
        .select("*")
        .eq("id", tripId)
        .maybeSingle();

      if (tripError) throw tripError;
      if (!trip) {
        throw new Error("Joined trip, but failed to load trip data");
      }

      // Optimistic update
      setTrips(prev => [trip, ...prev.filter(t => t.id !== trip.id)]);
      setCurrentTripId(trip.id);
      
      // Background refresh
      fetchTrips(false);

      toast({
        title: "Joined trip!",
        description: `You've joined ${trip.name}.`,
        variant: "success",
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

  // Add member with optimistic update
  const addMember = useCallback(async (displayName: string) => {
    if (!currentTripId || !currentTripData) return null;

    const optimisticMember = {
      id: `temp-${Date.now()}`,
      trip_id: currentTripId,
      user_id: null,
      display_name: displayName,
      is_registered: false,
      created_at: new Date().toISOString(),
    };

    // Optimistic update
    setCurrentTripData(prev => prev ? {
      ...prev,
      members: [...prev.members, optimisticMember],
    } : prev);

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

      fetchTripDetails(true);
      
      toast({
        title: "Member added",
        description: `${displayName} has been added to the trip.`,
        variant: "success",
      });

      return member;
    } catch (error: any) {
      fetchTripDetails(true);
      
      toast({
        title: "Error adding member",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  }, [currentTripId, currentTripData, fetchTripDetails, toast]);

  // Remove member with optimistic update
  const removeMember = useCallback(async (memberId: string) => {
    if (!currentTripId || !currentTripData) return false;

    try {
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

      // Optimistic update
      setCurrentTripData(prev => prev ? {
        ...prev,
        members: prev.members.filter(m => m.id !== memberId),
      } : prev);

      const { data: participations } = await supabase
        .from('expense_participants')
        .select('id, expense_id')
        .eq('member_id', memberId);

      if (participations && participations.length > 0) {
        const { error: removeParticipationError } = await supabase
          .from('expense_participants')
          .delete()
          .eq('member_id', memberId);

        if (removeParticipationError) throw removeParticipationError;
      }

      const { error } = await supabase
        .from('trip_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      
      toast({
        title: "Member removed",
        description: "The member has been removed from the trip.",
        variant: "success",
      });

      return true;
    } catch (error: any) {
      fetchTripDetails(true);
      
      toast({
        title: "Error removing member",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [currentTripId, currentTripData, fetchTripDetails, toast]);

  // Update member name
  const updateMemberName = useCallback(async (memberId: string, newName: string) => {
    // Optimistic update
    setCurrentTripData(prev => prev ? {
      ...prev,
      members: prev.members.map(m => m.id === memberId ? { ...m, display_name: newName } : m),
    } : prev);

    try {
      const { error } = await supabase
        .from('trip_members')
        .update({ display_name: newName })
        .eq('id', memberId);

      if (error) throw error;
      
      toast({
        title: "Member updated",
        description: "Member name has been updated.",
        variant: "success",
      });

      return true;
    } catch (error: any) {
      fetchTripDetails(true);
      
      toast({
        title: "Error updating member",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchTripDetails, toast]);

  // Set up realtime subscriptions - optimized single channel
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('global-trips')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trips' }, () => {
        fetchTrips(false);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchTrips]);

  // Trip-specific realtime - single channel for all trip data
  useEffect(() => {
    if (!currentTripId) return;

    const channel = supabase
      .channel(`trip-data-${currentTripId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'expenses', 
        filter: `trip_id=eq.${currentTripId}` 
      }, () => {
        fetchTripDetails(true);
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'trip_members', 
        filter: `trip_id=eq.${currentTripId}` 
      }, () => {
        fetchTripDetails(true);
      })
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'expense_participants' 
      }, () => {
        fetchTripDetails(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentTripId, fetchTripDetails]);

  // Initial fetch
  useEffect(() => {
    if (userId) {
      fetchTrips();
    }
  }, [userId, fetchTrips]);

  // Fetch trip details when currentTripId changes - with cache
  useEffect(() => {
    if (currentTripId) {
      // Immediately show cached data if available
      const cached = tripDataCache.get(currentTripId);
      if (cached) {
        setCurrentTripData(cached);
      }
      // Then fetch fresh data
      fetchTripDetails();
    } else {
      setCurrentTripData(null);
    }
  }, [currentTripId, fetchTripDetails]);

  // Update trip
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

      // Optimistic updates
      setTrips(prev => prev.map(t => t.id === tripId ? {
        ...t,
        name: data.name,
        destination: data.destination,
        start_date: data.startDate,
        end_date: data.endDate,
      } : t));
      
      setCurrentTripData(prev => prev && prev.trip.id === tripId ? {
        ...prev,
        trip: {
          ...prev.trip,
          name: data.name,
          destination: data.destination,
          start_date: data.startDate,
          end_date: data.endDate,
        }
      } : prev);
      
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
  }, [toast]);

  // Delete trip
  const deleteTrip = useCallback(async (tripId: string) => {
    try {
      // Optimistic update
      setTrips(prev => prev.filter(t => t.id !== tripId));
      tripDataCache.delete(tripId);
      
      if (currentTripId === tripId) {
        setCurrentTripId(null);
        setCurrentTripData(null);
      }

      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) throw error;
      
      toast({
        title: "Trip deleted",
        description: "The trip has been deleted.",
      });

      return true;
    } catch (error: any) {
      fetchTrips();
      
      toast({
        title: "Error deleting trip",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [currentTripId, fetchTrips, toast]);

  // Leave trip
  const leaveTrip = useCallback(async () => {
    if (!currentTripId || !userId) return false;

    try {
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

      // Optimistic update
      const tripIdToLeave = currentTripId;
      setTrips(prev => prev.filter(t => t.id !== tripIdToLeave));
      tripDataCache.delete(tripIdToLeave);
      setCurrentTripId(null);
      setCurrentTripData(null);

      const { error: removeParticipationError } = await supabase
        .from('expense_participants')
        .delete()
        .eq('member_id', membership.id);

      if (removeParticipationError) throw removeParticipationError;

      const { error } = await supabase
        .from('trip_members')
        .delete()
        .eq('id', membership.id);

      if (error) throw error;
      
      toast({
        title: "Left trip",
        description: "You have left the trip successfully.",
        variant: "success",
      });

      return true;
    } catch (error: any) {
      fetchTrips();
      
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
    prefetchTrip,
    refreshTrips: fetchTrips,
    refreshTripDetails: fetchTripDetails,
  };
}

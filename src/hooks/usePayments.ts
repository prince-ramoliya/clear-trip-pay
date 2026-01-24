import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { DbPayment } from '@/types/payment';
import { useToast } from '@/hooks/use-toast';

export function usePayments(tripId: string | undefined, userId: string | undefined) {
  const [payments, setPayments] = useState<DbPayment[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchPayments = useCallback(async () => {
    if (!tripId) {
      setPayments([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('trip_id', tripId)
        .order('paid_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (error: any) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  const addPayment = useCallback(async (
    fromMemberId: string,
    toMemberId: string,
    amount: number,
    notes?: string
  ) => {
    if (!tripId || !userId) return null;

    try {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          trip_id: tripId,
          from_member_id: fromMemberId,
          to_member_id: toMemberId,
          amount,
          notes: notes || null,
          created_by: userId,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Payment recorded",
        description: "The settlement has been marked as paid.",
        variant: "success",
      });

      await fetchPayments();
      return data;
    } catch (error: any) {
      toast({
        title: "Error recording payment",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  }, [tripId, userId, fetchPayments, toast]);

  const deletePayment = useCallback(async (paymentId: string) => {
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentId);

      if (error) throw error;

      toast({
        title: "Payment removed",
        description: "The payment record has been removed.",
        variant: "success",
      });

      await fetchPayments();
      return true;
    } catch (error: any) {
      toast({
        title: "Error removing payment",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [fetchPayments, toast]);

  // Set up realtime subscription for payments
  useEffect(() => {
    if (!tripId) return;

    const channel = supabase
      .channel(`payments-${tripId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'payments', filter: `trip_id=eq.${tripId}` },
        () => {
          fetchPayments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripId, fetchPayments]);

  // Initial fetch
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  return {
    payments,
    loading,
    addPayment,
    deletePayment,
    refreshPayments: fetchPayments,
  };
}

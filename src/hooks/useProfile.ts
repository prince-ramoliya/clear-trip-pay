import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
}

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = useCallback(async () => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setProfile(null);
        setLoading(false);
        return;
      }
      
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateDisplayName = useCallback(async (newName: string) => {
    if (!userId || !newName.trim()) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: newName.trim(), updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, display_name: newName.trim() } : null);
      
      toast({
        title: "Name updated",
        description: "Your display name has been changed successfully.",
        variant: "success",
      });

      return true;
    } catch (error: any) {
      console.error('Error updating name:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update name",
        variant: "destructive",
      });
      return false;
    }
  }, [userId, toast]);

  return {
    profile,
    loading,
    updateDisplayName,
    refreshProfile: fetchProfile,
  };
}

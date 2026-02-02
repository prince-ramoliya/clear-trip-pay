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
      
      // Check if we need to sync the name from OAuth metadata
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const oauthName = user.user_metadata?.full_name || user.user_metadata?.name;
        const currentName = data?.display_name;
        const emailPrefix = user.email?.split('@')[0]?.toLowerCase();
        
        // If profile has auto-generated email prefix name but OAuth has real name, update it
        if (oauthName && currentName && emailPrefix && 
            currentName.toLowerCase() === emailPrefix && 
            oauthName.toLowerCase() !== emailPrefix) {
          // Update the profile with the OAuth name
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ display_name: oauthName, updated_at: new Date().toISOString() })
            .eq('id', userId);
          
          if (!updateError) {
            setProfile({ ...data, display_name: oauthName });
            setLoading(false);
            return;
          }
        }
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

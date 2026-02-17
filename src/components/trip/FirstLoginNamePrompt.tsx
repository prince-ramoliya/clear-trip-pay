import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Sparkles } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

interface FirstLoginNamePromptProps {
  userId?: string;
}

export function FirstLoginNamePrompt({ userId }: FirstLoginNamePromptProps) {
  const { profile, updateDisplayName } = useProfile(userId);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  // Check localStorage to see if we've already shown the prompt for this user
  const storageKey = `first_login_prompt_shown_${userId}`;

  useEffect(() => {
    if (userId && profile) {
      const alreadyShown = localStorage.getItem(storageKey);
      if (!alreadyShown) {
        // Show prompt for all new users (first login)
        setOpen(true);
        setName(profile.display_name || '');
      }
    }
  }, [userId, profile, storageKey]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await updateDisplayName(name.trim());
    setSaving(false);
    localStorage.setItem(storageKey, 'true');
    setOpen(false);
  };

  const handleSkip = () => {
    localStorage.setItem(storageKey, 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(value) => {
      if (!value) handleSkip();
    }}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-20px)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            Welcome to Cleartrippay!
          </DialogTitle>
          <DialogDescription className="text-base">
            Let's set up your display name so your friends can recognize you.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 pt-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-semibold">
              {name.charAt(0).toUpperCase() || <User className="h-5 w-5" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Preview</p>
              <p className="text-base font-semibold text-foreground truncate">
                {name || 'Your Name'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-base font-semibold">
              Your Name
            </Label>
            <Input
              id="displayName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="h-10 text-base"
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              This name will be visible to other members in your trips.
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-10 text-base" 
              onClick={handleSkip}
            >
              Skip for now
            </Button>
            <Button 
              type="button" 
              className="flex-1 h-10 text-base font-semibold" 
              onClick={handleSave}
              disabled={saving || !name.trim()}
            >
              {saving ? 'Saving...' : 'Save Name'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

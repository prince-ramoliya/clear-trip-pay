import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

export function ProfileDialog({ open, onOpenChange, userId }: ProfileDialogProps) {
  const { profile, updateDisplayName } = useProfile(userId);
  const [newName, setNewName] = useState('');
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    if (open && profile?.display_name) {
      setNewName(profile.display_name);
    }
  }, [open, profile?.display_name]);

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setSavingName(true);
    await updateDisplayName(newName);
    setSavingName(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-20px)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-base">
            Update your display name
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-base font-semibold">Display Name</Label>
            <Input
              id="displayName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter your name"
              className="h-12 text-base"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-11 text-base font-semibold" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              className="flex-1 h-11 text-base font-semibold" 
              onClick={handleSaveName}
              disabled={savingName || !newName.trim()}
            >
              {savingName ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

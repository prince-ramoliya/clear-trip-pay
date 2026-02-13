import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Ticket, Loader2 } from "lucide-react";

interface JoinTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onJoinTrip: (inviteCode: string, displayName?: string) => Promise<any>;
}

export function JoinTripDialog({ open, onOpenChange, onJoinTrip }: JoinTripDialogProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim() || !displayName.trim()) return;

    setLoading(true);
    const result = await onJoinTrip(inviteCode.trim(), displayName.trim());
    setLoading(false);

    if (result) {
      setInviteCode('');
      setDisplayName('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-20px)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Ticket className="h-5 w-5 text-primary" />
            </div>
            Join a Trip
          </DialogTitle>
          <DialogDescription className="text-base">
            Enter the invite code and your display name to join.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="display-name" className="text-base">Your Display Name</Label>
            <Input
              id="display-name"
              placeholder="e.g., John"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="h-12 text-base"
              required
              autoFocus
            />
            <p className="text-sm text-muted-foreground">
              This name will be visible to all trip members.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invite-code" className="text-base">Invite Code</Label>
            <Input
              id="invite-code"
              placeholder="e.g., abc123def456"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="text-center text-lg font-mono tracking-widest lowercase h-14"
              maxLength={12}
              required
            />
            <p className="text-sm text-muted-foreground text-center">
              The code is case-insensitive
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-10 text-base"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-10 text-base" disabled={loading || !inviteCode.trim() || !displayName.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join Trip'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

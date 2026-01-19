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
  onJoinTrip: (inviteCode: string) => Promise<any>;
}

export function JoinTripDialog({ open, onOpenChange, onJoinTrip }: JoinTripDialogProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) return;

    setLoading(true);
    const result = await onJoinTrip(inviteCode.trim());
    setLoading(false);

    if (result) {
      setInviteCode('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" />
            Join a Trip
          </DialogTitle>
          <DialogDescription>
            Enter the invite code shared by your friend to join their trip.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="invite-code">Invite Code</Label>
            <Input
              id="invite-code"
              placeholder="e.g., abc123def456"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="text-center text-lg font-mono tracking-widest lowercase"
              maxLength={12}
              required
            />
            <p className="text-xs text-muted-foreground text-center">
              The code is case-insensitive
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading || !inviteCode.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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

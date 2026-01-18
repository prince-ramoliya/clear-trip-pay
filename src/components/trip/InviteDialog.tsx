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
import { Copy, Check, Link2, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteCode: string;
  tripName: string;
}

export function InviteDialog({ open, onOpenChange, inviteCode, tripName }: InviteDialogProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const inviteUrl = `${window.location.origin}/join/${inviteCode}`;

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard.`,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Invite Friends
          </DialogTitle>
          <DialogDescription>
            Share this link or code with friends so they can join "{tripName}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Invite Link */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Invite Link
            </Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={inviteUrl}
                className="bg-muted/50"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(inviteUrl, 'Invite link')}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Invite Code */}
          <div className="space-y-2">
            <Label>Invite Code</Label>
            <div className="flex gap-2">
              <div className="flex-1 flex items-center justify-center py-3 px-4 rounded-lg bg-accent border-2 border-dashed border-primary/20">
                <span className="text-2xl font-mono font-bold tracking-widest text-primary">
                  {inviteCode.toUpperCase()}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => copyToClipboard(inviteCode.toUpperCase(), 'Invite code')}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Friends can enter this code on the home screen to join your trip.
            </p>
          </div>

          <div className="rounded-lg bg-muted/50 p-4 mt-4">
            <h4 className="font-medium text-sm mb-2">How to invite:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Share the link or code with your friends</li>
              <li>They sign up or log in to TripSplit</li>
              <li>They'll automatically join your trip!</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

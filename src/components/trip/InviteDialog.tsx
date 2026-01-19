import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Check, UserPlus } from "lucide-react";
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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode.toUpperCase());
      setCopied(true);
      toast({
        title: "Code Copied!",
        description: "Share this code with your friends.",
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
            Share this code with friends so they can join "{tripName}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Invite Code - Primary focus */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <div className="flex-1 flex items-center justify-center py-4 px-4 rounded-lg bg-accent border-2 border-dashed border-primary/20">
                <span className="text-3xl font-mono font-bold tracking-widest text-primary">
                  {inviteCode.toUpperCase()}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-auto aspect-square"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Friends can enter this code in "Join Trip" to access your trip
            </p>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <h4 className="font-medium text-sm mb-2">How it works:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Share this code with your friends</li>
              <li>They sign up or log in to TripSplit</li>
              <li>They tap "Join Trip" and enter the code</li>
              <li>All data syncs in real-time!</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

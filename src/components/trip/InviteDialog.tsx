import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Check, UserPlus, Link, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const APP_URL = "https://clear-trip-pay.lovable.app";

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  inviteCode: string;
  tripName: string;
}

export function InviteDialog({ open, onOpenChange, inviteCode, tripName }: InviteDialogProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const { toast } = useToast();

  const inviteLink = `${APP_URL}/join/${inviteCode}`;

  const copyInviteLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedLink(true);
      toast({
        title: "Link Copied!",
        description: "Share this link with your friends.",
      });
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopiedCode(true);
      toast({
        title: "Code Copied!",
        description: "Share this code with your friends.",
      });
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy manually.",
        variant: "destructive",
      });
    }
  };

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(
      `🎒 Join my trip "${tripName}" on TripSplit!\n\n🔗 Click to join: ${inviteLink}\n\n📋 Or use code: ${inviteCode}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-20px)] max-h-[calc(100vh-40px)] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="text-left">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <UserPlus className="h-5 w-5 text-primary shrink-0" />
            Invite Friends
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Share the link or code so friends can join "{tripName}".
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-3">
          {/* Invite Code */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Invite Code
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center justify-center bg-muted/50 rounded-lg px-3 py-3 border overflow-hidden min-w-0">
                <span className="text-base sm:text-lg font-mono tracking-[0.2em] text-foreground font-bold select-all truncate">
                  {inviteCode}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-lg"
                onClick={copyInviteCode}
              >
                {copiedCode ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Invite Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Invite Link
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2.5 border overflow-hidden min-w-0">
                <Link className="h-4 w-4 text-primary shrink-0" />
                <span className="text-xs sm:text-sm text-foreground font-medium truncate">
                  {inviteLink}
                </span>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-lg"
                onClick={copyInviteLink}
              >
                {copiedLink ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex flex-col gap-2.5">
            <Button
              variant="outline"
              onClick={copyInviteLink}
              className="w-full h-11 text-base font-semibold rounded-xl"
            >
              {copiedLink ? (
                <Check className="h-5 w-5 mr-2 text-emerald-500" />
              ) : (
                <Copy className="h-5 w-5 mr-2" />
              )}
              {copiedLink ? "Copied!" : "Copy Link"}
            </Button>
            <Button
              onClick={shareOnWhatsApp}
              className="w-full h-11 text-base font-semibold rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Share on WhatsApp
            </Button>
          </div>

          <div className="rounded-lg bg-muted/50 p-3">
            <h4 className="font-medium text-sm mb-1.5">How to join:</h4>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Share the link or invite code with friends</li>
              <li>They click the link or enter the code manually</li>
              <li>They'll be added automatically after signing in</li>
              <li>All data syncs in real-time!</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

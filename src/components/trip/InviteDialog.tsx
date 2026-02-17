import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Check, UserPlus, MessageCircle, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

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
      toast({ title: "Link Copied!", description: "Share this link with your friends." });
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      toast({ title: "Failed to copy", description: "Please copy manually.", variant: "destructive" });
    }
  };

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopiedCode(true);
      toast({ title: "Code Copied!", description: "Share this code with your friends." });
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      toast({ title: "Failed to copy", description: "Please copy manually.", variant: "destructive" });
    }
  };

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(
      `🎒 Join my trip "${tripName}" on Cleartrippay!\n\n🔗 Click to join: ${inviteLink}\n\n📋 Or use code: ${inviteCode}`
    );
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] max-w-[calc(100vw-20px)] max-h-[calc(100vh-40px)] overflow-y-auto p-0 gap-0 border-0">
        {/* Header with gradient */}
        <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/10 via-primary/5 to-transparent px-5 pt-6 pb-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <DialogHeader className="text-left space-y-1">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 mb-3"
            >
              <UserPlus className="h-5 w-5 text-primary" />
            </motion.div>
            <DialogTitle className="text-xl font-bold text-foreground">
              Invite Friends
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Share the code or link to join <span className="font-semibold text-foreground">"{tripName}"</span>
            </p>
          </DialogHeader>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {/* Invite Code - prominent display */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Invite Code
            </label>
            <button
              onClick={copyInviteCode}
              className="w-full flex items-center justify-between gap-3 bg-muted/60 hover:bg-muted rounded-xl px-4 py-3.5 border border-border/50 transition-colors group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                  <QrCode className="h-4 w-4 text-primary" />
                </div>
                <span className="text-lg font-mono tracking-[0.25em] font-bold text-foreground truncate">
                  {inviteCode}
                </span>
              </div>
              <div className="shrink-0">
                {copiedCode ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </div>
            </button>
          </div>

          {/* Invite Link - compact */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Invite Link
            </label>
            <button
              onClick={copyInviteLink}
              className="w-full flex items-center justify-between gap-3 bg-muted/60 hover:bg-muted rounded-xl px-4 py-3 border border-border/50 transition-colors group"
            >
              <span className="text-xs text-muted-foreground font-medium truncate min-w-0">
                {inviteLink}
              </span>
              <div className="shrink-0">
                {copiedLink ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-1">
            <Button
              variant="outline"
              onClick={copyInviteLink}
              className="w-full h-11 text-base font-semibold rounded-xl"
            >
              {copiedLink ? (
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4 mr-2" />
              )}
              {copiedLink ? "Copied!" : "Copy Link"}
            </Button>
            <Button
              onClick={shareOnWhatsApp}
              className="w-full h-11 text-base font-semibold rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Share on WhatsApp
            </Button>
          </div>

          {/* How to join */}
          <div className="rounded-xl bg-muted/40 p-3.5 border border-border/30">
            <h4 className="font-semibold text-xs text-foreground mb-2">How to join:</h4>
            <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside leading-relaxed">
              <li>Share the link or invite code with friends</li>
              <li>They sign in and click the link or enter the code</li>
              <li>They're added automatically — data syncs in real-time!</li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, MessageCircle, PartyPopper, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const APP_URL = "https://clear-trip-pay.lovable.app";

interface TripCreatedShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripName: string;
  inviteCode: string;
}

export function TripCreatedShareDialog({
  open,
  onOpenChange,
  tripName,
  inviteCode,
}: TripCreatedShareDialogProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const inviteLink = `${APP_URL}/join/${inviteCode}`;

  const getFormattedMessage = () => {
    return `🎒 Join my trip "${tripName}" on TripSplit!\n\n🔗 Click to join: ${inviteLink}\n\n📋 Or use code: ${inviteCode}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {
      // fallback
    }
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    } catch {
      // fallback
    }
  };

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(getFormattedMessage());
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] max-w-[calc(100vw-20px)] max-h-[calc(100vh-40px)] overflow-y-auto p-0 gap-0 border-0">
        {/* Celebration Header */}
        <div className="relative overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/15 via-primary/5 to-transparent px-5 pt-8 pb-6 text-center">
          <div className="absolute top-0 left-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 -translate-x-1/2" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full translate-y-1/2 translate-x-1/2" />
          
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.5 }}
            className="mx-auto mb-4"
          >
            <div className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15">
              <PartyPopper className="h-8 w-8 text-primary" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles className="h-4 w-4 text-primary" />
              </motion.div>
            </div>
          </motion.div>

          <DialogHeader className="space-y-1">
            <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
              Trip Created! 🎉
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              Share with friends to join <span className="font-semibold text-foreground">"{tripName}"</span>
            </p>
          </DialogHeader>
        </div>

        <div className="px-5 pb-5 space-y-4">
          {/* Invite Code */}
          <div className="space-y-2 pt-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Invite Code
            </label>
            <button
              onClick={copyCode}
              className="w-full flex items-center justify-between gap-3 bg-muted/60 hover:bg-muted rounded-xl px-4 py-3.5 border border-border/50 transition-colors group"
            >
              <span className="text-lg font-mono tracking-[0.25em] font-bold text-foreground truncate">
                {inviteCode}
              </span>
              <div className="shrink-0">
                {copiedCode ? (
                  <Check className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Copy className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </div>
            </button>
          </div>

          {/* Invite Link */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Invite Link
            </label>
            <button
              onClick={copyLink}
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
              type="button"
              variant="outline"
              onClick={copyLink}
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
              type="button"
              onClick={shareOnWhatsApp}
              className="w-full h-11 text-base font-semibold rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Share on WhatsApp
            </Button>
          </div>

          {/* Done */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full h-10 text-sm text-muted-foreground hover:text-foreground"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, Link, MessageCircle, PartyPopper } from "lucide-react";
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

  const inviteLink = `${APP_URL}/join/${inviteCode}`;

  const getFormattedMessage = () => {
    return `🎒 Join my trip "${tripName}" on TripSplit!\n\n🔗 Click to join: ${inviteLink}`;
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

  const shareOnWhatsApp = () => {
    const message = encodeURIComponent(getFormattedMessage());
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-20px)]">
        <DialogHeader className="text-center sm:text-center pb-2">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="mx-auto mb-3"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <PartyPopper className="h-8 w-8 text-primary" />
            </div>
          </motion.div>
          <DialogTitle className="text-xl sm:text-2xl font-bold">
            Trip Created! 🎉
          </DialogTitle>
          <DialogDescription className="text-base">
            Share this link with your friends so they can join <span className="font-semibold text-foreground">"{tripName}"</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Invite Link */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Invite Link
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-3 border text-sm min-w-0">
                <Link className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate text-foreground font-medium">{inviteLink}</span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={copyLink}
                className="h-12 w-12 shrink-0 rounded-lg"
              >
                {copiedLink ? (
                  <Check className="h-5 w-5 text-emerald-500" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={copyLink}
              className="flex-1 h-12 text-base font-semibold rounded-xl"
            >
              {copiedLink ? (
                <Check className="h-5 w-5 mr-2 text-emerald-500" />
              ) : (
                <Copy className="h-5 w-5 mr-2" />
              )}
              {copiedLink ? "Copied!" : "Copy Link"}
            </Button>
            <Button
              type="button"
              onClick={shareOnWhatsApp}
              className="flex-1 h-12 text-base font-semibold rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              WhatsApp
            </Button>
          </div>

          {/* Done Button */}
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="w-full h-11 text-muted-foreground hover:text-foreground"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

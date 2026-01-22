import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";

interface LeaveTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripName: string;
  onLeave: () => Promise<boolean>;
  isLoading: boolean;
}

export function LeaveTripDialog({
  open,
  onOpenChange,
  tripName,
  onLeave,
  isLoading,
}: LeaveTripDialogProps) {
  const handleLeave = async () => {
    const success = await onLeave();
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[calc(100vw-20px)] sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <LogOut className="h-5 w-5 text-destructive" />
            Leave Trip?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm sm:text-base">
            Are you sure you want to leave "{tripName}"? You'll need a new invite code to rejoin.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel className="text-base" disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLeave}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-base"
            disabled={isLoading}
          >
            {isLoading ? "Leaving..." : "Leave Trip"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DbPayment } from "@/types/payment";
import { Member } from "@/types/trip";
import { formatCurrency } from "@/lib/calculations";
import { History, Trash2, ArrowRight } from "lucide-react";
import { format } from "date-fns";

interface PaymentHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payments: DbPayment[];
  members: Member[];
  onDeletePayment: (paymentId: string) => void;
}

export function PaymentHistoryDialog({
  open,
  onOpenChange,
  payments,
  members,
  onDeletePayment,
}: PaymentHistoryDialogProps) {
  const getMemberName = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    return member?.name || 'Unknown';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Payment History
          </DialogTitle>
          <DialogDescription>
            All recorded payments for this trip
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
          {payments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No payments recorded yet</p>
            </div>
          ) : (
            payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium truncate">
                      {getMemberName(payment.from_member_id)}
                    </span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="font-medium truncate">
                      {getMemberName(payment.to_member_id)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-primary">
                      {formatCurrency(payment.amount)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(payment.paid_at), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {payment.notes && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {payment.notes}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onDeletePayment(payment.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

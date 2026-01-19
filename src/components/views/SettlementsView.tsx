import { useState } from "react";
import { Trip, Settlement } from "@/types/trip";
import { DbPayment } from "@/types/payment";
import { SettlementCard } from "@/components/trip/SettlementCard";
import { TripStats } from "@/components/trip/TripStats";
import { WhatsAppShareButton } from "@/components/trip/WhatsAppShareButton";
import { PaymentHistoryDialog } from "@/components/trip/PaymentHistoryDialog";
import { calculateSettlements, formatCurrency } from "@/lib/calculations";
import { CheckCircle2, Wallet, History } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettlementsViewProps {
  trip: Trip;
  payments: DbPayment[];
  onMarkPaid: (fromMemberId: string, toMemberId: string, amount: number) => Promise<any>;
  onDeletePayment: (paymentId: string) => Promise<boolean>;
}

export function SettlementsView({ trip, payments, onMarkPaid, onDeletePayment }: SettlementsViewProps) {
  const [historyOpen, setHistoryOpen] = useState(false);
  const allSettlements = calculateSettlements(trip.members, trip.expenses);
  
  // Calculate remaining settlements after payments
  const getRemainingSettlements = (): Settlement[] => {
    // Create a map of total payments between members
    const paymentMap = new Map<string, number>();
    
    payments.forEach(payment => {
      const key = `${payment.from_member_id}-${payment.to_member_id}`;
      paymentMap.set(key, (paymentMap.get(key) || 0) + payment.amount);
    });

    // Adjust settlements based on payments made
    return allSettlements
      .map(settlement => {
        const key = `${settlement.from}-${settlement.to}`;
        const paidAmount = paymentMap.get(key) || 0;
        const remaining = settlement.amount - paidAmount;
        
        if (remaining <= 0.01) return null; // Fully paid (with small tolerance for rounding)
        
        return {
          ...settlement,
          amount: remaining,
        };
      })
      .filter((s): s is Settlement => s !== null);
  };

  const remainingSettlements = getRemainingSettlements();
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
      <TripStats trip={trip} />

      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-xl font-semibold text-foreground">Settle Up</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {remainingSettlements.length > 0
                  ? `${remainingSettlements.length} payment${remainingSettlements.length > 1 ? 's' : ''} remaining`
                  : 'All settled!'}
              </p>
            </div>
          </div>
          
          {payments.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setHistoryOpen(true)}
              className="gap-1"
            >
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">History</span>
            </Button>
          )}
        </div>

        {/* Payment summary */}
        {payments.length > 0 && (
          <div className="rounded-xl bg-success/10 border border-success/20 p-3 mb-4">
            <p className="text-sm text-success font-medium flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              {formatCurrency(totalPaid)} already paid ({payments.length} payment{payments.length > 1 ? 's' : ''})
            </p>
          </div>
        )}

        {remainingSettlements.length > 0 ? (
          <div className="space-y-3">
            {remainingSettlements.map((settlement, index) => (
              <SettlementCard
                key={`${settlement.from}-${settlement.to}-${index}`}
                settlement={settlement}
                onMarkSettled={() => onMarkPaid(settlement.from, settlement.to, settlement.amount)}
              />
            ))}

            <div className="rounded-xl bg-accent/50 border border-accent p-3 mt-4">
              <p className="text-xs text-accent-foreground">
                💡 <span className="font-medium">Tip:</span> Share payment details with your group using WhatsApp.
              </p>
            </div>

            {/* WhatsApp Share Button - Fixed at bottom on mobile */}
            <div className="fixed bottom-20 left-4 right-4 sm:static sm:mt-4 z-10">
              <WhatsAppShareButton 
                trip={trip} 
                className="w-full shadow-lg sm:shadow-none"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 sm:py-16 text-center px-4">
            <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-success/10 mb-3 sm:mb-4">
              <CheckCircle2 className="h-6 w-6 sm:h-8 sm:w-8 text-success" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-foreground mb-1 sm:mb-2">All Settled!</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
              Great news! Everyone's balances are squared up. No payments needed.
            </p>
          </div>
        )}
      </div>

      <PaymentHistoryDialog
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        payments={payments}
        members={trip.members}
        onDeletePayment={onDeletePayment}
      />
    </div>
  );
}

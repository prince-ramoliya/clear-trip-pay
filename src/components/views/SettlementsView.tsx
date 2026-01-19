import { Trip } from "@/types/trip";
import { SettlementCard } from "@/components/trip/SettlementCard";
import { TripStats } from "@/components/trip/TripStats";
import { WhatsAppShareButton } from "@/components/trip/WhatsAppShareButton";
import { calculateSettlements } from "@/lib/calculations";
import { CheckCircle2, Wallet } from "lucide-react";

interface SettlementsViewProps {
  trip: Trip;
}

export function SettlementsView({ trip }: SettlementsViewProps) {
  const settlements = calculateSettlements(trip.members, trip.expenses);

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
      <TripStats trip={trip} />

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h2 className="text-base sm:text-xl font-semibold text-foreground">Settle Up</h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              {settlements.length > 0
                ? `${settlements.length} payment${settlements.length > 1 ? 's' : ''} needed`
                : 'All settled!'}
            </p>
          </div>
        </div>

        {settlements.length > 0 ? (
          <div className="space-y-3">
            {settlements.map((settlement, index) => (
              <SettlementCard
                key={`${settlement.from}-${settlement.to}-${index}`}
                settlement={settlement}
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
    </div>
  );
}

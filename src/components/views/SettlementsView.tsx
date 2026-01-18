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
    <div className="space-y-6">
      <TripStats trip={trip} />

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <Wallet className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground">Settle Up</h2>
              <p className="text-sm text-muted-foreground truncate">
                {settlements.length > 0
                  ? `${settlements.length} payment${settlements.length > 1 ? 's' : ''} needed`
                  : 'All settled!'}
              </p>
            </div>
          </div>
          {settlements.length > 0 && (
            <WhatsAppShareButton 
              trip={trip} 
              variant="default"
              size="sm"
              className="w-full sm:w-auto"
            />
          )}
        </div>

        {settlements.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {settlements.map((settlement, index) => (
              <SettlementCard
                key={`${settlement.from}-${settlement.to}-${index}`}
                settlement={settlement}
              />
            ))}

            <div className="rounded-xl bg-accent/50 border border-accent p-3 sm:p-4 mt-4 sm:mt-6">
              <p className="text-xs sm:text-sm text-accent-foreground">
                💡 <span className="font-medium">Tip:</span> Use the WhatsApp button above to share payment details with your group.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center px-4">
            <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-success/10 mb-4">
              <CheckCircle2 className="h-7 w-7 sm:h-8 sm:w-8 text-success" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-foreground mb-2">All Settled!</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm">
              Great news! Everyone's balances are squared up. No payments needed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

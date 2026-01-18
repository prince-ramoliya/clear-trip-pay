import { Trip } from "@/types/trip";
import { SettlementCard } from "@/components/trip/SettlementCard";
import { TripStats } from "@/components/trip/TripStats";
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
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Wallet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-foreground">Settle Up</h2>
            <p className="text-sm text-muted-foreground">
              {settlements.length > 0
                ? `${settlements.length} payment${settlements.length > 1 ? 's' : ''} needed to settle all balances`
                : 'All settled!'}
            </p>
          </div>
        </div>

        {settlements.length > 0 ? (
          <div className="space-y-4">
            {settlements.map((settlement, index) => (
              <SettlementCard
                key={`${settlement.from}-${settlement.to}-${index}`}
                settlement={settlement}
              />
            ))}

            <div className="rounded-xl bg-accent/50 border border-accent p-4 mt-6">
              <p className="text-sm text-accent-foreground">
                💡 <span className="font-medium">Tip:</span> Share this page with your group so everyone knows who needs to pay whom. Once payments are made, mark them as settled to keep track.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-4">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">All Settled!</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Great news! Everyone's balances are squared up. No payments needed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

import { Trip } from "@/types/trip";
import { getTotalExpenses } from "@/lib/calculations";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Users, Receipt, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface TripStatsProps {
  trip: Trip;
}

export function TripStats({ trip }: TripStatsProps) {
  const { formatCurrency } = useCurrency();
  const totalExpenses = getTotalExpenses(trip.expenses);
  const avgPerPerson = trip.members.length > 0 ? totalExpenses / trip.members.length : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <div className="rounded-xl bg-card p-3 sm:p-4 card-shadow">
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
            <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground truncate">Total Spent</span>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-foreground truncate">{formatCurrency(totalExpenses)}</p>
      </div>

      <div className="rounded-xl bg-card p-3 sm:p-4 card-shadow">
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-success/10 shrink-0">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground truncate">Per Person</span>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-foreground truncate">{formatCurrency(avgPerPerson)}</p>
      </div>

      <div className="rounded-xl bg-card p-3 sm:p-4 card-shadow">
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-warning/10 shrink-0">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-warning" />
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground truncate">Destination</span>
        </div>
        <p className="text-base sm:text-lg font-semibold text-foreground truncate">{trip.destination}</p>
      </div>

      <div className="rounded-xl bg-card p-3 sm:p-4 card-shadow">
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-accent shrink-0">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-accent-foreground" />
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground truncate">Duration</span>
        </div>
        <p className="text-sm sm:text-base font-medium text-foreground truncate">
          {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d')}
        </p>
      </div>
    </div>
  );
}

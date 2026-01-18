import { Trip } from "@/types/trip";
import { formatCurrency, getTotalExpenses } from "@/lib/calculations";
import { Users, Receipt, Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

interface TripStatsProps {
  trip: Trip;
}

export function TripStats({ trip }: TripStatsProps) {
  const totalExpenses = getTotalExpenses(trip.expenses);
  const avgPerPerson = trip.members.length > 0 ? totalExpenses / trip.members.length : 0;

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <div className="rounded-xl bg-card p-3 sm:p-4 card-shadow">
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
            <Receipt className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground truncate">Total Spent</span>
        </div>
        <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{formatCurrency(totalExpenses)}</p>
      </div>

      <div className="rounded-xl bg-card p-3 sm:p-4 card-shadow">
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-success/10 shrink-0">
            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground truncate">Per Person</span>
        </div>
        <p className="text-lg sm:text-2xl font-bold text-foreground truncate">{formatCurrency(avgPerPerson)}</p>
      </div>

      <div className="rounded-xl bg-card p-3 sm:p-4 card-shadow">
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-warning/10 shrink-0">
            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-warning" />
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground truncate">Destination</span>
        </div>
        <p className="text-sm sm:text-lg font-semibold text-foreground truncate">{trip.destination}</p>
      </div>

      <div className="rounded-xl bg-card p-3 sm:p-4 card-shadow">
        <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-accent shrink-0">
            <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-accent-foreground" />
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground truncate">Duration</span>
        </div>
        <p className="text-xs sm:text-sm font-medium text-foreground truncate">
          {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d')}
        </p>
      </div>
    </div>
  );
}

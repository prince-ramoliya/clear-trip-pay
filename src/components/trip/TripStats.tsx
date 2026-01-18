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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-xl bg-card p-4 card-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Receipt className="h-4 w-4 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground">Total Spent</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{formatCurrency(totalExpenses)}</p>
      </div>

      <div className="rounded-xl bg-card p-4 card-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
            <Users className="h-4 w-4 text-success" />
          </div>
          <span className="text-xs text-muted-foreground">Per Person</span>
        </div>
        <p className="text-2xl font-bold text-foreground">{formatCurrency(avgPerPerson)}</p>
      </div>

      <div className="rounded-xl bg-card p-4 card-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
            <MapPin className="h-4 w-4 text-warning" />
          </div>
          <span className="text-xs text-muted-foreground">Destination</span>
        </div>
        <p className="text-lg font-semibold text-foreground truncate">{trip.destination}</p>
      </div>

      <div className="rounded-xl bg-card p-4 card-shadow">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
            <Calendar className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="text-xs text-muted-foreground">Duration</span>
        </div>
        <p className="text-sm font-medium text-foreground">
          {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
        </p>
      </div>
    </div>
  );
}

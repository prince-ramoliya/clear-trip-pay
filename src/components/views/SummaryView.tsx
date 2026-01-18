import { Trip } from "@/types/trip";
import { BalanceCard } from "@/components/trip/BalanceCard";
import { TripStats } from "@/components/trip/TripStats";
import { calculateBalances, formatCurrency, getCategoryIcon, getCategoryLabel } from "@/lib/calculations";
import { PieChart as PieChartIcon } from "lucide-react";

interface SummaryViewProps {
  trip: Trip;
}

export function SummaryView({ trip }: SummaryViewProps) {
  const balances = calculateBalances(trip.members, trip.expenses);

  // Calculate category breakdown
  const categoryTotals = trip.expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const totalAmount = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  const categoryData = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: totalAmount > 0 ? (amount / totalAmount) * 100 : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const categoryColors: Record<string, string> = {
    food: 'bg-orange-500',
    stay: 'bg-blue-500',
    travel: 'bg-green-500',
    shopping: 'bg-pink-500',
    activities: 'bg-purple-500',
    other: 'bg-gray-500',
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <TripStats trip={trip} />

      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-3 sm:mb-4">Individual Balances</h2>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {balances.map(balance => (
            <BalanceCard
              key={balance.memberId}
              name={balance.memberName}
              totalPaid={balance.totalPaid}
              totalOwed={balance.totalOwed}
              netBalance={balance.netBalance}
            />
          ))}
        </div>
      </div>

      {categoryData.length > 0 && (
        <div className="rounded-xl bg-card p-4 sm:p-6 card-shadow">
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              <PieChartIcon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-semibold text-foreground">Spending by Category</h2>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">Where did the money go?</p>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            {categoryData.map(({ category, amount, percentage }) => (
              <div key={category} className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base sm:text-lg shrink-0">{getCategoryIcon(category)}</span>
                    <span className="text-xs sm:text-sm font-medium text-foreground truncate">
                      {getCategoryLabel(category)}
                    </span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-semibold text-foreground">
                      {formatCurrency(amount)}
                    </span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground ml-1 sm:ml-2">
                      ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <div className="h-1.5 sm:h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${categoryColors[category]} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

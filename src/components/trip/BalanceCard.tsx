import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/calculations";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface BalanceCardProps {
  name: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
}

export function BalanceCard({ name, totalPaid, totalOwed, netBalance }: BalanceCardProps) {
  const isPositive = netBalance > 0;
  const isNegative = netBalance < 0;
  const isSettled = Math.abs(netBalance) < 0.01;

  return (
    <div className="rounded-xl bg-card p-5 card-shadow animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-sm">
            {name.charAt(0).toUpperCase()}
          </div>
          <h3 className="font-semibold text-foreground">{name}</h3>
        </div>
        <div className={cn(
          "flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
          isPositive && "bg-success/10 text-success",
          isNegative && "bg-destructive/10 text-destructive",
          isSettled && "bg-muted text-muted-foreground"
        )}>
          {isPositive && <TrendingUp className="h-3.5 w-3.5" />}
          {isNegative && <TrendingDown className="h-3.5 w-3.5" />}
          {isSettled && <Minus className="h-3.5 w-3.5" />}
          {isSettled ? 'Settled' : isPositive ? 'Gets back' : 'Owes'}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Paid</p>
          <p className="text-base font-semibold text-foreground">{formatCurrency(totalPaid)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Share</p>
          <p className="text-base font-semibold text-foreground">{formatCurrency(totalOwed)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Balance</p>
          <p className={cn(
            "text-base font-bold",
            isPositive && "text-success",
            isNegative && "text-destructive",
            isSettled && "text-muted-foreground"
          )}>
            {isPositive && '+'}
            {formatCurrency(Math.abs(netBalance))}
          </p>
        </div>
      </div>
    </div>
  );
}

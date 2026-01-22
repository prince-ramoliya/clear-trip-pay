import { Settlement } from "@/types/trip";
import { useCurrency } from "@/contexts/CurrencyContext";
import { ArrowRight, ArrowDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettlementCardProps {
  settlement: Settlement;
  onMarkSettled?: () => void;
}

export function SettlementCard({ settlement, onMarkSettled }: SettlementCardProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="rounded-xl bg-card p-4 sm:p-5 card-shadow animate-fade-in">
      {/* Mobile Layout - Compact horizontal */}
      <div className="sm:hidden">
        <div className="flex items-center gap-2">
          {/* From person */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10 text-destructive text-sm font-semibold shrink-0">
              {settlement.fromName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium truncate">{settlement.fromName}</span>
          </div>
          
          {/* Arrow with amount */}
          <div className="flex items-center gap-1 shrink-0 px-2 py-1.5 rounded-full bg-primary/10">
            <span className="text-sm font-bold text-primary">{formatCurrency(settlement.amount)}</span>
            <ArrowRight className="h-3.5 w-3.5 text-primary" />
          </div>
          
          {/* To person */}
          <div className="flex items-center gap-2 min-w-0 flex-1 justify-end">
            <span className="text-sm font-medium truncate">{settlement.toName}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success/10 text-success text-sm font-semibold shrink-0">
              {settlement.toName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
        
        {onMarkSettled && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onMarkSettled}
            className="w-full mt-3 h-10 text-sm"
          >
            <Check className="h-4 w-4 mr-1.5" />
            Mark Paid
          </Button>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center gap-4">
        {/* From */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive font-semibold shrink-0">
            {settlement.fromName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate text-base">{settlement.fromName}</p>
            <p className="text-sm text-muted-foreground">pays</p>
          </div>
        </div>

        {/* Arrow & Amount */}
        <div className="flex-1 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 shrink-0">
            <span className="font-bold text-primary text-lg">{formatCurrency(settlement.amount)}</span>
            <ArrowRight className="h-5 w-5 text-primary" />
          </div>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* To */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <p className="font-medium text-foreground text-right truncate text-base">{settlement.toName}</p>
            <p className="text-sm text-muted-foreground text-right">receives</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success font-semibold shrink-0">
            {settlement.toName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Mark Settled */}
        {onMarkSettled && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onMarkSettled}
            className="ml-2 shrink-0"
          >
            <Check className="h-4 w-4 mr-1" />
            Mark Paid
          </Button>
        )}
      </div>
    </div>
  );
}

import { Settlement } from "@/types/trip";
import { formatCurrency } from "@/lib/calculations";
import { ArrowRight, ArrowDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettlementCardProps {
  settlement: Settlement;
  onMarkSettled?: () => void;
}

export function SettlementCard({ settlement, onMarkSettled }: SettlementCardProps) {
  return (
    <div className="rounded-xl bg-card p-4 sm:p-5 card-shadow animate-fade-in">
      {/* Mobile Layout */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive font-semibold shrink-0">
              {settlement.fromName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{settlement.fromName}</p>
              <p className="text-xs text-muted-foreground">pays</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20">
            <span className="font-bold text-primary">{formatCurrency(settlement.amount)}</span>
            <ArrowDown className="h-4 w-4 text-primary" />
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10 text-success font-semibold shrink-0">
              {settlement.toName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-foreground truncate">{settlement.toName}</p>
              <p className="text-xs text-muted-foreground">receives</p>
            </div>
          </div>
        </div>
        
        {onMarkSettled && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onMarkSettled}
            className="w-full mt-4"
          >
            <Check className="h-4 w-4 mr-1" />
            Mark Paid
          </Button>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center gap-4">
        {/* From */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/10 text-destructive font-semibold shrink-0">
            {settlement.fromName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{settlement.fromName}</p>
            <p className="text-xs text-muted-foreground">pays</p>
          </div>
        </div>

        {/* Arrow & Amount */}
        <div className="flex-1 flex items-center justify-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/20 shrink-0">
            <span className="font-bold text-primary">{formatCurrency(settlement.amount)}</span>
            <ArrowRight className="h-4 w-4 text-primary" />
          </div>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* To */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="min-w-0">
            <p className="font-medium text-foreground text-right truncate">{settlement.toName}</p>
            <p className="text-xs text-muted-foreground text-right">receives</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-success/10 text-success font-semibold shrink-0">
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

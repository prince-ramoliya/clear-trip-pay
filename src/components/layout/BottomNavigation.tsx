import { cn } from "@/lib/utils";
import { Receipt, PieChart, Wallet, Plus, UserPlus } from "lucide-react";
interface BottomNavigationProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onAddExpense: () => void;
  hasTripSelected: boolean;
}
const navItems = [{
  id: 'expenses',
  label: 'Expenses',
  icon: Receipt
}, {
  id: 'summary',
  label: 'Summary',
  icon: PieChart
}, {
  id: 'settlements',
  label: 'Settle',
  icon: Wallet
}];
export function BottomNavigation({
  currentView,
  onViewChange,
  onAddExpense,
  hasTripSelected
}: BottomNavigationProps) {
  if (!hasTripSelected) return null;
  return <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2 bg-primary-foreground">
        {navItems.map(item => <button key={item.id} onClick={() => onViewChange(item.id)} className={cn("flex flex-col items-center justify-center flex-1 h-full py-1 px-2 transition-colors min-w-0 bg-primary-foreground", currentView === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
            <item.icon className="h-5 w-5 shrink-0" />
            <span className="text-xs mt-1 font-medium truncate max-w-full">{item.label}</span>
          </button>)}
        
        {/* Floating Add Button */}
        <button onClick={onAddExpense} className="flex flex-col items-center justify-center flex-1 h-full py-1 px-2 bg-primary-foreground">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground shadow-lg -mt-3">
            <Plus className="h-5 w-5" />
          </div>
          <span className="text-xs mt-0.5 font-medium text-primary truncate">Add</span>
        </button>
      </div>
    </nav>;
}
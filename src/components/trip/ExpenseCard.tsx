import { Expense, Member } from "@/types/trip";
import { getCategoryIcon, getCategoryLabel, formatCurrency } from "@/lib/calculations";
import { Trash2, User, Pencil, MoreVertical } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ExpenseCardProps {
  expense: Expense;
  members: Member[];
  onEdit?: () => void;
  onDelete?: () => void;
  canEditDelete?: boolean;
}

export function ExpenseCard({ expense, members, onEdit, onDelete, canEditDelete = true }: ExpenseCardProps) {
  const payer = members.find(m => m.id === expense.paidBy);
  const participantNames = expense.participants.map(id => members.find(m => m.id === id)?.name || 'Unknown').join(', ');
  
  const showActions = canEditDelete && (onEdit || onDelete);

  return (
    <div className="group rounded-xl bg-card p-3 sm:p-4 card-shadow hover:card-shadow-hover transition-all duration-200 animate-fade-in">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-accent text-xl sm:text-2xl shrink-0">
          {getCategoryIcon(expense.category)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-foreground truncate text-sm sm:text-base">{expense.title}</h3>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-0.5 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1 shrink-0">
                  <User className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span className="truncate max-w-[80px] sm:max-w-none">{payer?.name}</span>
                </span>
                <span className="shrink-0">•</span>
                <span className="shrink-0">{format(new Date(expense.date), 'MMM d')}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 shrink-0">
              <div className="text-right">
                <p className="text-sm sm:text-lg font-semibold text-foreground">{formatCurrency(expense.amount)}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground">{formatCurrency(expense.amount / expense.participants.length)} each</p>
              </div>
              
              {/* Mobile: Dropdown Menu */}
              {showActions && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="sm:hidden">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover">
                    {onEdit && (
                      <DropdownMenuItem onClick={onEdit}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem onClick={onDelete} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {/* Desktop: Hover Buttons */}
              {showActions && (
                <div className="hidden sm:flex opacity-0 group-hover:opacity-100 gap-1 transition-all">
                  {onEdit && (
                    <button onClick={onEdit} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10">
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={onDelete} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 truncate">
            Split: {participantNames}
          </p>
        </div>
      </div>
    </div>
  );
}
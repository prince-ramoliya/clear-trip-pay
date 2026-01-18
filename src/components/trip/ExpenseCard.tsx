import { Expense, Member } from "@/types/trip";
import { getCategoryIcon, getCategoryLabel, formatCurrency } from "@/lib/calculations";
import { Trash2, User, Pencil } from "lucide-react";
import { format } from "date-fns";

interface ExpenseCardProps {
  expense: Expense;
  members: Member[];
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ExpenseCard({ expense, members, onEdit, onDelete }: ExpenseCardProps) {
  const payer = members.find(m => m.id === expense.paidBy);
  const participantNames = expense.participants.map(id => members.find(m => m.id === id)?.name || 'Unknown').join(', ');

  return (
    <div className="group flex items-center gap-4 rounded-xl bg-card p-4 card-shadow hover:card-shadow-hover transition-all duration-200 animate-fade-in">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent text-2xl shrink-0">{getCategoryIcon(expense.category)}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-foreground truncate">{expense.title}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full shrink-0">{getCategoryLabel(expense.category)}</span>
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{payer?.name} paid</span>
          <span>•</span>
          <span>{format(new Date(expense.date), 'MMM d, yyyy')}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 truncate">Split between: {participantNames}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-lg font-semibold text-foreground">{formatCurrency(expense.amount)}</p>
        <p className="text-xs text-muted-foreground">{formatCurrency(expense.amount / expense.participants.length)} each</p>
      </div>
      <div className="opacity-0 group-hover:opacity-100 flex gap-1 transition-all">
        {onEdit && <button onClick={onEdit} className="p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10"><Pencil className="h-4 w-4" /></button>}
        {onDelete && <button onClick={onDelete} className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></button>}
      </div>
    </div>
  );
}
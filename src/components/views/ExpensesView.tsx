import { useState } from "react";
import { DbTripMember, DbExpense, DbExpenseParticipant } from "@/types/database";
import { ExpenseCard } from "@/components/trip/ExpenseCard";
import { TripStats } from "@/components/trip/TripStats";
import { AddExpenseDialog } from "@/components/trip/AddExpenseDialog";
import { EditExpenseDialog } from "@/components/trip/EditExpenseDialog";
import { Button } from "@/components/ui/button";
import { Plus, Receipt } from "lucide-react";
import { Trip } from "@/types/trip";

interface ExpensesViewProps {
  trip: Trip;
  members: DbTripMember[];
  expenses: (DbExpense & { participants: DbExpenseParticipant[] })[];
  memberMode?: string;
  onAddExpense: (expense: { title: string; amount: number; paidBy: string; participants: string[]; category: string; date: string; }) => Promise<any>;
  onUpdateExpense: (expenseId: string, expense: { title: string; amount: number; paidBy: string; participants: string[]; category: string; date: string; }) => Promise<boolean>;
  onRemoveExpense: (expenseId: string) => Promise<boolean>;
  currentUserId?: string;
}

export function ExpensesView({ trip, members, expenses, memberMode, onAddExpense, onUpdateExpense, onRemoveExpense, currentUserId }: ExpensesViewProps) {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<(DbExpense & { participants: DbExpenseParticipant[] }) | null>(null);

  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime());
  
  // Find current user's member ID
  const currentMember = members.find(m => m.user_id === currentUserId);

  return (
    <div className="space-y-5 sm:space-y-6">
      <TripStats trip={trip} />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-foreground">Expenses</h2>
          <p className="text-base text-muted-foreground">{expenses.length} transactions</p>
        </div>
        {/* Hide on mobile - use bottom nav button instead */}
        <Button onClick={() => setIsAddExpenseOpen(true)} className="hidden sm:flex h-11 text-base">
          <Plus className="h-5 w-5 mr-2" /> Add Expense
        </Button>
      </div>

      {sortedExpenses.length > 0 ? (
        <div className="space-y-3">
          {sortedExpenses.map(expense => {
            // Check if current user created this expense
            const canEditDelete = expense.created_by === currentUserId || expense.created_by === currentMember?.id;
            
            return (
              <ExpenseCard
                key={expense.id}
                expense={{ id: expense.id, title: expense.title, amount: Number(expense.amount), paidBy: expense.paid_by, participants: expense.participants.map(p => p.member_id), category: expense.category as any, date: expense.expense_date, createdAt: expense.created_at, createdBy: expense.created_by }}
                members={members.map(m => ({ id: m.id, name: m.display_name }))}
                onEdit={() => setEditingExpense(expense)}
                onDelete={() => onRemoveExpense(expense.id)}
                canEditDelete={canEditDelete}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center px-4">
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-muted mb-4">
            <Receipt className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg sm:text-xl font-medium text-foreground mb-2">No expenses yet</h3>
          <p className="text-base text-muted-foreground mb-6">Start tracking by adding your first expense.</p>
          <Button onClick={() => setIsAddExpenseOpen(true)} className="h-12 text-base px-6">
            <Plus className="h-5 w-5 mr-2" /> Add First Expense
          </Button>
        </div>
      )}

      <AddExpenseDialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen} members={members} currentUserId={currentUserId} memberMode={memberMode} onAddExpense={onAddExpense} />
      {editingExpense && (
        <EditExpenseDialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)} expense={editingExpense} members={members} currentUserId={currentUserId} memberMode={memberMode} onUpdateExpense={onUpdateExpense} />
      )}
    </div>
  );
}

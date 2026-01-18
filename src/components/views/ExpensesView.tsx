import { Trip, ExpenseCategory } from "@/types/trip";
import { ExpenseCard } from "@/components/trip/ExpenseCard";
import { TripStats } from "@/components/trip/TripStats";
import { AddExpenseDialog } from "@/components/trip/AddExpenseDialog";
import { Button } from "@/components/ui/button";
import { Plus, Receipt } from "lucide-react";
import { useState } from "react";

interface ExpensesViewProps {
  trip: Trip;
  onAddExpense: (expense: {
    title: string;
    amount: number;
    paidBy: string;
    participants: string[];
    category: ExpenseCategory;
    date: string;
  }) => void;
  onRemoveExpense: (expenseId: string) => void;
}

export function ExpensesView({ trip, onAddExpense, onRemoveExpense }: ExpensesViewProps) {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const sortedExpenses = [...trip.expenses].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <TripStats trip={trip} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Expenses</h2>
          <p className="text-sm text-muted-foreground">{trip.expenses.length} transactions</p>
        </div>
        <Button onClick={() => setIsAddExpenseOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      {sortedExpenses.length > 0 ? (
        <div className="space-y-3">
          {sortedExpenses.map(expense => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              members={trip.members}
              onDelete={() => onRemoveExpense(expense.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Receipt className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No expenses yet</h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-sm">
            Start tracking your trip expenses by adding your first transaction.
          </p>
          <Button onClick={() => setIsAddExpenseOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add First Expense
          </Button>
        </div>
      )}

      <AddExpenseDialog
        open={isAddExpenseOpen}
        onOpenChange={setIsAddExpenseOpen}
        members={trip.members}
        onAddExpense={onAddExpense}
      />
    </div>
  );
}

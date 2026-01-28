import { useState, useEffect } from "react";
import { DbTripMember, DbExpense, DbExpenseParticipant } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategoryIcon, getCategoryLabel } from "@/lib/calculations";
import { useCurrency } from "@/contexts/CurrencyContext";

interface EditExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: DbExpense & { participants: DbExpenseParticipant[] };
  members: DbTripMember[];
  currentUserId?: string;
  memberMode?: string;
  onUpdateExpense: (expenseId: string, expense: {
    title: string;
    amount: number;
    paidBy: string;
    participants: string[];
    category: string;
    date: string;
  }) => Promise<boolean>;
}

const categories = ['food', 'stay', 'travel', 'shopping', 'activities', 'other'];

export function EditExpenseDialog({ 
  open, 
  onOpenChange, 
  expense, 
  members,
  currentUserId,
  memberMode,
  onUpdateExpense 
}: EditExpenseDialogProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { currency } = useCurrency();

  // Check if this is an "automatic" trip
  const isAutomaticTrip = memberMode === 'automatic';
  
  // Find current user's member record
  const currentUserMember = members.find(m => m.user_id === currentUserId);

  useEffect(() => {
    if (expense && open) {
      setTitle(expense.title);
      setAmount(expense.amount.toString());
      setPaidBy(expense.paid_by);
      setCategory(expense.category);
      setDate(expense.expense_date);
    }
  }, [expense, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For automatic trips, use current user as paidBy
    const effectivePaidBy = isAutomaticTrip && currentUserMember ? currentUserMember.id : paidBy;
    
    if (!title || !amount || !effectivePaidBy) return;

    // Validate amount is a positive number within bounds
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount <= 0 || parsedAmount >= 999999999) {
      return;
    }

    setLoading(true);
    // Always split between all members
    const success = await onUpdateExpense(expense.id, {
      title,
      amount: parsedAmount,
      paidBy: effectivePaidBy,
      participants: members.map(m => m.id),
      category,
      date,
    });
    setLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-20px)] max-h-[calc(100vh-40px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Edit Expense</DialogTitle>
          <DialogDescription className="text-base">
            Update the expense details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title" className="text-base">Description</Label>
            <Input
              id="edit-title"
              placeholder="e.g., Dinner at restaurant"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="h-10 text-base"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-amount" className="text-base">Amount ({currency.symbol})</Label>
              <Input
                id="edit-amount"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="h-10 text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-date" className="text-base">Date</Label>
              <Input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="h-10 text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-10 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-base py-2">
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{getCategoryIcon(cat)}</span>
                      <span>{getCategoryLabel(cat)}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base">Paid by</Label>
            {isAutomaticTrip && currentUserMember ? (
              <div className="h-10 flex items-center px-3 rounded-md border bg-muted/50 text-base text-foreground">
                {currentUserMember.display_name}
              </div>
            ) : (
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger className="h-10 text-base">
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {members.map(member => (
                    <SelectItem key={member.id} value={member.id} className="text-base py-2">
                      {member.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-10 text-base"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-10 text-base" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

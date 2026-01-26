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
import { Checkbox } from "@/components/ui/checkbox";
import { getCategoryIcon, getCategoryLabel } from "@/lib/calculations";
import { useCurrency } from "@/contexts/CurrencyContext";

interface EditExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: DbExpense & { participants: DbExpenseParticipant[] };
  members: DbTripMember[];
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
  onUpdateExpense 
}: EditExpenseDialogProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { currency } = useCurrency();

  useEffect(() => {
    if (expense && open) {
      setTitle(expense.title);
      setAmount(expense.amount.toString());
      setPaidBy(expense.paid_by);
      setCategory(expense.category);
      setDate(expense.expense_date);
      setParticipants(expense.participants.map(p => p.member_id));
    }
  }, [expense, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !paidBy || participants.length === 0) return;

    // Validate amount is a positive number within bounds
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount <= 0 || parsedAmount >= 999999999) {
      return;
    }

    setLoading(true);
    const success = await onUpdateExpense(expense.id, {
      title,
      amount: parsedAmount,
      paidBy,
      participants,
      category,
      date,
    });
    setLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  const toggleParticipant = (memberId: string) => {
    setParticipants(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAllParticipants = () => {
    setParticipants(members.map(m => m.id));
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
              className="h-12 text-base"
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
                className="h-12 text-base"
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
                className="h-12 text-base"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-base">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat} className="text-base py-3">
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
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger className="h-12 text-base">
                <SelectValue placeholder="Select who paid" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                {members.map(member => (
                  <SelectItem key={member.id} value={member.id} className="text-base py-3">
                    {member.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base">Split between</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={selectAllParticipants}
                className="text-sm text-primary h-9"
              >
                Select all
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border bg-muted/30">
              {members.map(member => (
                <label
                  key={member.id}
                  className="flex items-center gap-3 cursor-pointer p-3 rounded-md hover:bg-accent transition-colors"
                >
                  <Checkbox
                    checked={participants.includes(member.id)}
                    onCheckedChange={() => toggleParticipant(member.id)}
                    className="h-5 w-5"
                  />
                  <span className="text-base">{member.display_name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 text-base"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-12 text-base" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { useState } from "react";
import { Member, ExpenseCategory } from "@/types/trip";
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

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  onAddExpense: (expense: {
    title: string;
    amount: number;
    paidBy: string;
    participants: string[];
    category: ExpenseCategory;
    date: string;
  }) => void;
}

const categories: ExpenseCategory[] = ['food', 'stay', 'travel', 'shopping', 'activities', 'other'];

export function AddExpenseDialog({ open, onOpenChange, members, onAddExpense }: AddExpenseDialogProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !paidBy || participants.length === 0) return;

    onAddExpense({
      title,
      amount: parseFloat(amount),
      paidBy,
      participants,
      category,
      date,
    });

    // Reset form
    setTitle('');
    setAmount('');
    setPaidBy('');
    setCategory('food');
    setDate(new Date().toISOString().split('T')[0]);
    setParticipants([]);
    onOpenChange(false);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Add a new expense to split among group members.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Description</Label>
            <Input
              id="title"
              placeholder="e.g., Dinner at restaurant"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as ExpenseCategory)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2">
                      <span>{getCategoryIcon(cat)}</span>
                      <span>{getCategoryLabel(cat)}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Paid by</Label>
            <Select value={paidBy} onValueChange={setPaidBy}>
              <SelectTrigger>
                <SelectValue placeholder="Select who paid" />
              </SelectTrigger>
              <SelectContent>
                {members.map(member => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Split between</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={selectAllParticipants}
                className="text-xs text-primary"
              >
                Select all
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border bg-muted/30">
              {members.map(member => (
                <label
                  key={member.id}
                  className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-accent transition-colors"
                >
                  <Checkbox
                    checked={participants.includes(member.id)}
                    onCheckedChange={() => toggleParticipant(member.id)}
                  />
                  <span className="text-sm">{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Expense
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

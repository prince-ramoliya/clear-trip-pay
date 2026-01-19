import { useState } from "react";
import { DbTripMember } from "@/types/database";
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
  members: DbTripMember[];
  currentUserId?: string;
  onAddExpense: (expense: {
    title: string;
    amount: number;
    paidBy: string;
    participants: string[];
    category: string;
    date: string;
  }) => Promise<any>;
}

const categories = ['food', 'stay', 'travel', 'shopping', 'activities', 'other'];

export function AddExpenseDialog({ open, onOpenChange, members, currentUserId, onAddExpense }: AddExpenseDialogProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Find the current user's member ID
  const currentUserMember = members.find(m => m.user_id === currentUserId);
  const paidBy = currentUserMember?.id || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !paidBy || participants.length === 0) return;

    setLoading(true);
    await onAddExpense({
      title,
      amount: parseFloat(amount),
      paidBy,
      participants,
      category,
      date,
    });
    setLoading(false);

    setTitle('');
    setAmount('');
    setCategory('food');
    setDate(new Date().toISOString().split('T')[0]);
    setParticipants([]);
    onOpenChange(false);
  };

  const toggleParticipant = (memberId: string) => {
    setParticipants(prev =>
      prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>Add a new expense to split among group members.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Description</Label>
            <Input id="title" placeholder="e.g., Dinner" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input type="number" min="0" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    <span className="flex items-center gap-2"><span>{getCategoryIcon(cat)}</span><span>{getCategoryLabel(cat)}</span></span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {currentUserMember && (
            <div className="space-y-2">
              <Label>Paid by</Label>
              <div className="flex items-center h-10 px-3 rounded-md border bg-muted/50 text-sm">
                {currentUserMember.display_name} (You)
              </div>
            </div>
          )}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Split between</Label>
              <Button type="button" variant="ghost" size="sm" onClick={() => setParticipants(members.map(m => m.id))} className="text-xs text-primary">Select all</Button>
            </div>
            <div className="grid grid-cols-2 gap-2 p-3 rounded-lg border bg-muted/30">
              {members.map(m => (
                <label key={m.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-accent">
                  <Checkbox checked={participants.includes(m.id)} onCheckedChange={() => toggleParticipant(m.id)} />
                  <span className="text-sm">{m.display_name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? 'Adding...' : 'Add Expense'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
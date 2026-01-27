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
import { getCategoryIcon, getCategoryLabel } from "@/lib/calculations";
import { useCurrency } from "@/contexts/CurrencyContext";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: DbTripMember[];
  currentUserId?: string;
  memberMode?: string;
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

export function AddExpenseDialog({ open, onOpenChange, members, currentUserId, memberMode, onAddExpense }: AddExpenseDialogProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('');
  const [category, setCategory] = useState('food');
  const [loading, setLoading] = useState(false);
  const { currency } = useCurrency();

  // Check if this is an "automatic" trip - use the trip's member_mode
  const isAutomaticTrip = memberMode === 'automatic';
  
  // Find current user's member record
  const currentUserMember = members.find(m => m.user_id === currentUserId);

  // Auto-set paidBy to current user for automatic trips
  const effectivePaidBy = isAutomaticTrip && currentUserMember ? currentUserMember.id : paidBy;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !effectivePaidBy) return;

    // Validate amount is a positive number within bounds
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount <= 0 || parsedAmount >= 999999999) {
      return;
    }

    setLoading(true);
    // Auto-split between all members
    await onAddExpense({
      title,
      amount: parsedAmount,
      paidBy: effectivePaidBy,
      participants: members.map(m => m.id),
      category,
      date: new Date().toISOString().split('T')[0],
    });
    setLoading(false);

    setTitle('');
    setAmount('');
    setPaidBy('');
    setCategory('food');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-20px)] max-h-[calc(100vh-40px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Add Expense</DialogTitle>
          <DialogDescription className="text-base">Add a new expense to split among all members.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base">Description</Label>
            <Input 
              id="title" 
              placeholder="e.g., Dinner" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="h-12 text-base"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-base">Amount ({currency.symbol})</Label>
            <Input 
              type="number" 
              min="0" 
              step="0.01" 
              value={amount} 
              onChange={(e) => setAmount(e.target.value)} 
              required 
              className="h-12 text-base"
            />
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
            {isAutomaticTrip && currentUserMember ? (
              <div className="h-12 flex items-center px-3 rounded-md border bg-muted/50 text-base text-foreground">
                {currentUserMember.display_name}
              </div>
            ) : (
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger className="h-12 text-base">
                  <SelectValue placeholder="Select who paid" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {members.map(m => (
                    <SelectItem key={m.id} value={m.id} className="text-base py-3">
                      {m.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1 h-12 text-base" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-12 text-base" disabled={loading}>
              {loading ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

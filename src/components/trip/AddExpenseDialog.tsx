import { useState } from "react";
import { DbTripMember } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Users } from "lucide-react";

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
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [splitAll, setSplitAll] = useState(true);
  const [loading, setLoading] = useState(false);
  const { currency } = useCurrency();

  const isAutomaticTrip = memberMode === 'automatic';
  const currentUserMember = members.find(m => m.user_id === currentUserId);
  const effectivePaidBy = isAutomaticTrip && currentUserMember ? currentUserMember.id : paidBy;

  const toggleParticipant = (memberId: string) => {
    setSelectedParticipants(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleSplitAllToggle = (checked: boolean) => {
    setSplitAll(checked);
    if (checked) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants(members.map(m => m.id));
    }
  };

  const getEffectiveParticipants = () => {
    if (splitAll) return members.map(m => m.id);
    return selectedParticipants;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const participants = getEffectiveParticipants();
    if (!title || !amount || !effectivePaidBy || participants.length === 0) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || !isFinite(parsedAmount) || parsedAmount <= 0 || parsedAmount >= 999999999) {
      return;
    }

    setLoading(true);
    await onAddExpense({
      title,
      amount: parsedAmount,
      paidBy: effectivePaidBy,
      participants,
      category,
      date: new Date().toISOString().split('T')[0],
    });
    setLoading(false);

    setTitle('');
    setAmount('');
    setPaidBy('');
    setCategory('food');
    setSelectedParticipants([]);
    setSplitAll(true);
    onOpenChange(false);
  };

  const effectiveParticipants = getEffectiveParticipants();
  const perPerson = amount && effectiveParticipants.length > 0
    ? parseFloat(amount) / effectiveParticipants.length
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-20px)] max-h-[calc(100vh-40px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Add Expense</DialogTitle>
          <DialogDescription className="text-base">Add a new expense to split among members.</DialogDescription>
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
              className="h-10 text-base"
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
              className="h-10 text-base"
            />
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
                  {members.map(m => (
                    <SelectItem key={m.id} value={m.id} className="text-base py-2">
                      {m.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Split Between Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base flex items-center gap-2">
                <Users className="h-4 w-4" />
                Split between
              </Label>
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <Checkbox
                  checked={splitAll}
                  onCheckedChange={(checked) => handleSplitAllToggle(!!checked)}
                />
                All members
              </label>
            </div>

            {!splitAll && (
              <div className="rounded-lg border bg-muted/30 p-3 space-y-1 max-h-40 overflow-y-auto">
                {members.map(member => (
                  <label
                    key={member.id}
                    className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <Checkbox
                      checked={selectedParticipants.includes(member.id)}
                      onCheckedChange={() => toggleParticipant(member.id)}
                    />
                    <span className="text-base text-foreground truncate">{member.display_name}</span>
                  </label>
                ))}
                {selectedParticipants.length === 0 && (
                  <p className="text-sm text-destructive px-2 py-1">Select at least one member</p>
                )}
              </div>
            )}

            {/* Per-person preview */}
            {amount && effectiveParticipants.length > 0 && (
              <div className="text-sm text-muted-foreground bg-muted/40 rounded-md px-3 py-2">
                {currency.symbol}{perPerson.toFixed(2)} per person · {effectiveParticipants.length} member{effectiveParticipants.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1 h-10 text-base" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-10 text-base" disabled={loading || (!splitAll && selectedParticipants.length === 0)}>
              {loading ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

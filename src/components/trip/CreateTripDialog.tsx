import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, X } from "lucide-react";

interface CreateTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (trip: { name: string; destination: string; startDate: string; endDate: string }, memberNames: string[]) => Promise<void>;
}

export function CreateTripDialog({ open, onOpenChange, onCreate }: CreateTripDialogProps) {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [members, setMembers] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !destination || !startDate || !endDate) return;

    setLoading(true);
    await onCreate({ name, destination, startDate, endDate }, members.filter(m => m.trim()));
    setLoading(false);

    setName(''); setDestination(''); setStartDate(''); setEndDate(''); setMembers(['']);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Trip</DialogTitle>
          <DialogDescription>Set up your trip and add members.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label>Trip Name</Label>
            <Input placeholder="e.g., Goa Beach Trip" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Destination</Label>
            <Input placeholder="e.g., Goa, India" value={destination} onChange={(e) => setDestination(e.target.value)} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></div>
            <div className="space-y-2"><Label>End Date</Label><Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required /></div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Other Members (optional)</Label>
              <Button type="button" variant="ghost" size="sm" onClick={() => setMembers([...members, ''])} className="text-xs text-primary"><Plus className="h-3 w-3 mr-1" />Add</Button>
            </div>
            <div className="space-y-2">
              {members.map((member, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder={`Member ${i + 1}`} value={member} onChange={(e) => setMembers(members.map((m, j) => j === i ? e.target.value : m))} />
                  {members.length > 1 && <Button type="button" variant="ghost" size="icon" onClick={() => setMembers(members.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">You'll be added automatically. Add friends now or invite them later.</p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? 'Creating...' : 'Create Trip'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
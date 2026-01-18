import { useState } from "react";
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
import { Plus, X } from "lucide-react";
import { Member } from "@/types/trip";

interface CreateTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (trip: {
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    members: Member[];
  }) => void;
}

export function CreateTripDialog({ open, onOpenChange, onCreate }: CreateTripDialogProps) {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [members, setMembers] = useState<{ id: string; name: string }[]>([
    { id: crypto.randomUUID(), name: '' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validMembers = members.filter(m => m.name.trim());
    if (!name || !destination || !startDate || !endDate || validMembers.length === 0) return;

    onCreate({
      name,
      destination,
      startDate,
      endDate,
      members: validMembers,
    });

    // Reset form
    setName('');
    setDestination('');
    setStartDate('');
    setEndDate('');
    setMembers([{ id: crypto.randomUUID(), name: '' }]);
    onOpenChange(false);
  };

  const addMember = () => {
    setMembers(prev => [...prev, { id: crypto.randomUUID(), name: '' }]);
  };

  const removeMember = (id: string) => {
    if (members.length > 1) {
      setMembers(prev => prev.filter(m => m.id !== id));
    }
  };

  const updateMember = (id: string, name: string) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, name } : m));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Trip</DialogTitle>
          <DialogDescription>
            Set up your trip and add members to start splitting expenses.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="tripName">Trip Name</Label>
            <Input
              id="tripName"
              placeholder="e.g., Goa Beach Trip"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g., Goa, India"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Members</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addMember}
                className="text-xs text-primary"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Member
              </Button>
            </div>
            <div className="space-y-2">
              {members.map((member, index) => (
                <div key={member.id} className="flex gap-2">
                  <Input
                    placeholder={`Member ${index + 1}`}
                    value={member.name}
                    onChange={(e) => updateMember(member.id, e.target.value)}
                  />
                  {members.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeMember(member.id)}
                      className="shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
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
              Create Trip
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

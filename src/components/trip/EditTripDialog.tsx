import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { DbTrip } from "@/types/database";

interface EditTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip: DbTrip | null;
  onUpdate: (tripId: string, data: { name: string; destination: string; startDate: string; endDate: string }) => Promise<boolean>;
  onDelete: (tripId: string) => Promise<boolean>;
}

export function EditTripDialog({ open, onOpenChange, trip, onUpdate, onDelete }: EditTripDialogProps) {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    if (trip) {
      setName(trip.name);
      setDestination(trip.destination);
      setStartDate(trip.start_date);
      setEndDate(trip.end_date);
    }
  }, [trip]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip || !name || !destination || !startDate || !endDate) return;

    setLoading(true);
    const success = await onUpdate(trip.id, { name, destination, startDate, endDate });
    setLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  const handleDelete = async () => {
    if (!trip) return;

    setDeleteLoading(true);
    const success = await onDelete(trip.id);
    setDeleteLoading(false);

    if (success) {
      onOpenChange(false);
    }
  };

  if (!trip) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-20px)] max-h-[calc(100vh-40px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Trip</DialogTitle>
          <DialogDescription>Update trip details or delete the trip.</DialogDescription>
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
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>End Date</Label>
              <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="flex-1" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
          </div>

          <div className="border-t border-border pt-4 mt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" className="w-full" disabled={deleteLoading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleteLoading ? 'Deleting...' : 'Delete Trip'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[calc(100vw-20px)]">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Trip?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete "{trip.name}" and all its expenses. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Trip
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

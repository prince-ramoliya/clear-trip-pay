import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, X, Users, UserPlus, Info, ChevronDown, ChevronUp, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreateTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (
    trip: {
      name: string;
      destination: string;
      startDate: string;
      endDate: string;
      inviteCode?: string;
      memberMode?: 'automatic' | 'manual';
    },
    memberNames: string[],
  ) => Promise<any>;
}

export function CreateTripDialog({ open, onOpenChange, onCreate }: CreateTripDialogProps) {
  const [name, setName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showDates, setShowDates] = useState(false);
  const [members, setMembers] = useState<string[]>([""]);
  const [loading, setLoading] = useState(false);
  const [memberMode, setMemberMode] = useState<"automatic" | "manual">("automatic");
  const [generatedCode, setGeneratedCode] = useState("");

  const generatePreviewCode = () => {
    const bytes = new Uint8Array(6);
    crypto.getRandomValues(bytes);
    return Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  };

  useEffect(() => {
    if (open) {
      setGeneratedCode((prev) => prev || generatePreviewCode());
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !destination) return;

    const today = new Date().toISOString().split('T')[0];

    setLoading(true);
    const memberNames = memberMode === "manual" ? members.filter((m) => m.trim()) : [];
    await onCreate(
      {
        name,
        destination,
        startDate: startDate || today,
        endDate: endDate || today,
        inviteCode: memberMode === "automatic" ? generatedCode : undefined,
        memberMode: memberMode,
      },
      memberNames,
    );
    setLoading(false);
    setName("");
    setDestination("");
    setStartDate("");
    setEndDate("");
    setShowDates(false);
    setMembers([""]);
    setMemberMode("automatic");
    setGeneratedCode("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-20px)] max-h-[calc(100vh-40px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold">Create New Trip</DialogTitle>
          <DialogDescription className="text-base">Set up your trip and add members.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label className="text-base font-semibold">Trip Name</Label>
            <Input
              placeholder="e.g., Goa Beach Trip"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="h-10 text-base"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-base font-semibold">Destination</Label>
            <Input
              placeholder="e.g., Goa, India"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              className="h-10 text-base"
            />
          </div>

          {/* Optional Dates - Collapsible */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setShowDates(!showDates)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full"
            >
              <CalendarDays className="h-4 w-4" />
              <span>Add trip dates</span>
              <span className="text-xs text-muted-foreground/60">(optional)</span>
              {showDates ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
            </button>
            
            {showDates && (
              <div className="grid grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">Start Date</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-10 text-base"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm text-muted-foreground">End Date</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-10 text-base"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Team Member Mode Toggle */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Team Member Adding</Label>
            <div className="flex rounded-lg border bg-muted/30 p-1 px-[5px] mx-0">
              <button
                type="button"
                onClick={() => setMemberMode("automatic")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all px-[24px]",
                  memberMode === "automatic"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Users className="h-4 w-4" />
                Automatic
              </button>
              <button
                type="button"
                onClick={() => setMemberMode("manual")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 rounded-md text-sm font-medium transition-all px-[24px]",
                  memberMode === "manual"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <UserPlus className="h-4 w-4" />
                Manual
              </button>
            </div>

            {memberMode === "automatic" && (
              <div className="p-4 rounded-lg border bg-accent/50 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 shrink-0 mt-0.5">
                    <Info className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">How automatic mode works:</p>
                    <ol className="text-sm text-muted-foreground space-y-1.5 list-decimal list-inside">
                      <li>Create your trip below</li>
                      <li>You'll get a shareable invite link</li>
                      <li>Share it with friends via WhatsApp or copy</li>
                      <li>They click the link, sign up & join instantly</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {memberMode === "manual" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Add members manually</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setMembers([...members, ""])}
                    className="text-sm text-primary h-9"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {members.map((member, i) => (
                    <div key={i} className="flex gap-2">
                      <Input
                        placeholder={`Member ${i + 1}`}
                        value={member}
                        onChange={(e) => setMembers(members.map((m, j) => (j === i ? e.target.value : m)))}
                        className="h-10 text-base"
                      />
                      {members.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setMembers(members.filter((_, j) => j !== i))}
                          className="h-10 w-10 shrink-0"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  You'll be added automatically. Add friends now or invite them later.
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-10 text-base font-semibold"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-10 text-base font-semibold" disabled={loading}>
              {loading ? "Creating..." : "Create Trip"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

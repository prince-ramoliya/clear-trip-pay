import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, X, Copy, Check, ChevronDown, ChevronUp, Users, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [showDates, setShowDates] = useState(false);
  const [memberMode, setMemberMode] = useState<'automatic' | 'manual'>('automatic');
  const [generatedCode, setGeneratedCode] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate a preview code when dialog opens
  const generatePreviewCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && !generatedCode) {
      setGeneratedCode(generatePreviewCode());
    }
    onOpenChange(isOpen);
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !destination) return;

    // Use today's date as default if dates not provided
    const today = new Date().toISOString().split('T')[0];
    const finalStartDate = startDate || today;
    const finalEndDate = endDate || today;

    setLoading(true);
    const memberNames = memberMode === 'manual' ? members.filter(m => m.trim()) : [];
    await onCreate({ name, destination, startDate: finalStartDate, endDate: finalEndDate }, memberNames);
    setLoading(false);

    setName(''); 
    setDestination(''); 
    setStartDate(''); 
    setEndDate(''); 
    setMembers(['']);
    setShowDates(false);
    setMemberMode('automatic');
    setGeneratedCode('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
              className="h-12 text-base"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-base font-semibold">Destination</Label>
            <Input 
              placeholder="e.g., Goa, India" 
              value={destination} 
              onChange={(e) => setDestination(e.target.value)} 
              required 
              className="h-12 text-base"
            />
          </div>

          {/* Team Member Mode Toggle */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Team Member Adding</Label>
            <div className="flex rounded-lg border bg-muted/30 p-1">
              <button
                type="button"
                onClick={() => setMemberMode('automatic')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all",
                  memberMode === 'automatic' 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Users className="h-4 w-4" />
                Automatic
              </button>
              <button
                type="button"
                onClick={() => setMemberMode('manual')}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-md text-sm font-medium transition-all",
                  memberMode === 'manual' 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <UserPlus className="h-4 w-4" />
                Manual
              </button>
            </div>

            {/* Automatic Mode - Show Invite Code */}
            {memberMode === 'automatic' && (
              <div className="p-4 rounded-lg border bg-accent/50 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Share this code with your team members to join:
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background rounded-md px-4 py-3 font-mono text-lg font-bold tracking-wider text-center border">
                    {generatedCode}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copyCode}
                    className="h-12 w-12 shrink-0"
                  >
                    {copied ? <Check className="h-5 w-5 text-success" /> : <Copy className="h-5 w-5" />}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  A unique code will be generated when your trip is created.
                </p>
              </div>
            )}

            {/* Manual Mode - Add Member Names */}
            {memberMode === 'manual' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Add members manually</span>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setMembers([...members, ''])} 
                    className="text-sm text-primary h-9"
                  >
                    <Plus className="h-4 w-4 mr-1" />Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {members.map((member, i) => (
                    <div key={i} className="flex gap-2">
                      <Input 
                        placeholder={`Member ${i + 1}`} 
                        value={member} 
                        onChange={(e) => setMembers(members.map((m, j) => j === i ? e.target.value : m))} 
                        className="h-12 text-base"
                      />
                      {members.length > 1 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => setMembers(members.filter((_, j) => j !== i))}
                          className="h-12 w-12 shrink-0"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">You'll be added automatically. Add friends now or invite them later.</p>
              </div>
            )}
          </div>

          {/* Collapsible Dates Section */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setShowDates(!showDates)}
              className="flex items-center justify-between w-full text-left py-2"
            >
              <Label className="text-base font-semibold cursor-pointer">Trip Dates (Optional)</Label>
              {showDates ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            
            {showDates && (
              <div className="grid grid-cols-2 gap-4 animate-fade-in">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Start Date</Label>
                  <Input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)} 
                    className="h-12 text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">End Date</Label>
                  <Input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="h-12 text-base"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" className="flex-1 h-12 text-base font-semibold" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 h-12 text-base font-semibold" disabled={loading}>
              {loading ? 'Creating...' : 'Create Trip'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
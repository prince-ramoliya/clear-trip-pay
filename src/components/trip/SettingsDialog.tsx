import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency, CURRENCIES } from "@/contexts/CurrencyContext";
import { Settings, Wallet } from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (code: string) => {
    const selected = CURRENCIES.find(c => c.code === code);
    if (selected) {
      setCurrency(selected);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-20px)] max-h-[calc(100vh-40px)] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            Settings
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Customize your TripSplit experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Currency Setting */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <Label className="text-base font-medium">Currency</Label>
            </div>
            <Select value={currency.code} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((curr) => (
                  <SelectItem key={curr.code} value={curr.code} className="text-base py-3">
                    <span className="flex items-center gap-3">
                      <span className="text-lg font-medium w-8">{curr.symbol}</span>
                      <span>{curr.name}</span>
                      <span className="text-muted-foreground">({curr.code})</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              This will be used to display all amounts in the app
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

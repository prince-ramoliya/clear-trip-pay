import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";
import { useCurrency, CURRENCIES } from "@/contexts/CurrencyContext";

interface CurrencyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CurrencyDialog({ open, onOpenChange }: CurrencyDialogProps) {
  const { currency, setCurrency } = useCurrency();

  const handleCurrencyChange = (code: string) => {
    const selected = CURRENCIES.find(c => c.code === code);
    if (selected) {
      setCurrency(selected);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-w-[calc(100vw-20px)]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Globe className="h-5 w-5 text-primary" />
            </div>
            Currency
          </DialogTitle>
          <DialogDescription className="text-base">
            Select your preferred currency
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Select value={currency.code} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="w-full h-12 text-base font-medium">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              {CURRENCIES.map((curr) => (
                <SelectItem key={curr.code} value={curr.code} className="text-base py-3">
                  <span className="flex items-center gap-3">
                    <span className="text-lg font-bold w-8">{curr.symbol}</span>
                    <span className="font-medium">{curr.name}</span>
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
      </DialogContent>
    </Dialog>
  );
}

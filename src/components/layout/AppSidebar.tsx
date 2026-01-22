import { useState } from "react";
import { cn } from "@/lib/utils";
import { Map, Receipt, PieChart, Plus, ChevronRight, Wallet, LogOut, Ticket, Settings, User, Globe } from "lucide-react";
import { DbTrip } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCurrency, CURRENCIES } from "@/contexts/CurrencyContext";
import { useProfile } from "@/hooks/useProfile";

interface AppSidebarProps {
  trips: DbTrip[];
  currentTripId: string | null;
  onSelectTrip: (tripId: string) => void;
  onCreateTrip: () => void;
  onJoinTrip: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
  onSignOut: () => void;
  onEditTrip?: () => void;
  onLeaveTrip?: () => void;
  isMobile?: boolean;
  currentUserId?: string;
  onCloseSidebar?: () => void;
}

const navItems = [
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'summary', label: 'Summary', icon: PieChart },
  { id: 'settlements', label: 'Settle Up', icon: Wallet },
];

export function AppSidebar({ 
  trips, currentTripId, onSelectTrip, onCreateTrip, onJoinTrip, 
  currentView, onViewChange, onSignOut, onEditTrip, onLeaveTrip,
  isMobile = false, currentUserId, onCloseSidebar 
}: AppSidebarProps) {
  const currentTrip = trips.find(t => t.id === currentTripId);
  const isAdmin = currentTrip?.created_by === currentUserId;
  const { currency, setCurrency } = useCurrency();
  const { profile, updateDisplayName } = useProfile(currentUserId);
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingName, setSavingName] = useState(false);

  const handleCurrencyChange = (code: string) => {
    const selected = CURRENCIES.find(c => c.code === code);
    if (selected) {
      setCurrency(selected);
    }
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setSavingName(true);
    await updateDisplayName(newName);
    setSavingName(false);
    setIsProfileOpen(false);
  };

  const openProfileDialog = () => {
    setNewName(profile?.display_name || '');
    setIsProfileOpen(true);
    onCloseSidebar?.();
  };

  const openCurrencyDialog = () => {
    setIsCurrencyOpen(true);
    onCloseSidebar?.();
  };

  // Settings section component
  const SettingsSection = () => (
    <div className="px-4 mb-4">
      <span className="text-xs font-medium uppercase tracking-wider text-sidebar-muted mb-3 block">Settings</span>
      <div className="space-y-1">
        {/* Edit Profile */}
        <button 
          onClick={openProfileDialog}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-all text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary/20 shrink-0">
            <User className="h-4 w-4 text-sidebar-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">My Profile</p>
            <p className="text-xs text-sidebar-muted truncate">{profile?.display_name || 'Set your name'}</p>
          </div>
        </button>

        {/* Currency Setting */}
        <button 
          onClick={openCurrencyDialog}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-all text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary/20 shrink-0">
            <Globe className="h-4 w-4 text-sidebar-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">Currency</p>
            <p className="text-xs text-sidebar-muted">{currency.symbol} {currency.code}</p>
          </div>
        </button>

        {/* Leave Trip - Only for non-admin members with active trip */}
        {currentTrip && !isAdmin && onLeaveTrip && (
          <button 
            onClick={onLeaveTrip}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-all text-destructive hover:bg-destructive/10"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-destructive/20 shrink-0">
              <LogOut className="h-4 w-4 text-destructive" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Leave Trip</p>
              <p className="text-xs text-destructive/70 truncate">{currentTrip.name}</p>
            </div>
          </button>
        )}
      </div>
    </div>
  );

  // Mobile version
  if (isMobile) {
    return (
      <>
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4">
            {/* Big buttons for Create and Join */}
            <div className="px-4 mb-4 space-y-2">
              <Button onClick={onCreateTrip} className="w-full justify-start gap-3 h-12 text-base" size="lg">
                <Plus className="h-5 w-5" />
                Create a New Trip
              </Button>
              <Button onClick={onJoinTrip} variant="outline" className="w-full justify-start gap-3 h-12 text-base" size="lg">
                <Ticket className="h-5 w-5" />
                Join a Trip
              </Button>
            </div>

            <div className="px-4 mb-4">
              <span className="text-xs font-medium uppercase tracking-wider text-sidebar-muted mb-3 block">Your Trips</span>
              <div className="space-y-1">
                {trips.length === 0 ? (
                  <p className="text-sm text-sidebar-muted px-3 py-4 text-center">No trips yet</p>
                ) : (
                  trips.map(trip => (
                    <button key={trip.id} onClick={() => onSelectTrip(trip.id)}
                      className={cn("w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-all",
                        currentTripId === trip.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50")}>
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary/20 shrink-0">
                        <Map className="h-4 w-4 text-sidebar-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{trip.name}</p>
                        <p className="text-xs text-sidebar-muted truncate">{trip.destination}</p>
                      </div>
                      {currentTripId === trip.id && <ChevronRight className="h-4 w-4 text-sidebar-muted shrink-0" />}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Settings Section */}
            <SettingsSection />
          </div>

          <div className="border-t border-sidebar-border p-4">
            <button onClick={onSignOut} className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-sidebar-foreground hover:bg-sidebar-accent/50">
              <LogOut className="h-4 w-4" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>

        {/* Profile Dialog */}
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="sm:max-w-md max-w-[calc(100vw-20px)]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                Edit Profile
              </DialogTitle>
              <DialogDescription className="text-base">
                Update your display name
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-base">Display Name</Label>
                <Input
                  id="displayName"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter your name"
                  className="h-12 text-base"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 h-11 text-base" 
                  onClick={() => setIsProfileOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  className="flex-1 h-11 text-base" 
                  onClick={handleSaveName}
                  disabled={savingName || !newName.trim()}
                >
                  {savingName ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Currency Dialog */}
        <Dialog open={isCurrencyOpen} onOpenChange={setIsCurrencyOpen}>
          <DialogContent className="sm:max-w-md max-w-[calc(100vw-20px)]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg">
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
                <SelectTrigger className="w-full h-12 text-base">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
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
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Desktop version
  return (
    <>
      <aside className="h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary shrink-0">
            <Wallet className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-lg font-semibold text-sidebar-foreground">TripSplit</span>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          {/* Big buttons for Create and Join */}
          <div className="px-4 mb-4 space-y-2">
            <Button onClick={onCreateTrip} className="w-full justify-start gap-3" size="lg">
              <Plus className="h-5 w-5" />
              Create a New Trip
            </Button>
            <Button onClick={onJoinTrip} variant="outline" className="w-full justify-start gap-3" size="lg">
              <Ticket className="h-5 w-5" />
              Join a Trip
            </Button>
          </div>

          <div className="px-4 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider text-sidebar-muted mb-3 block">Your Trips</span>
            <div className="space-y-1">
              {trips.length === 0 ? (
                <p className="text-sm text-sidebar-muted px-3 py-4 text-center">No trips yet</p>
              ) : (
                trips.map(trip => (
                  <button key={trip.id} onClick={() => onSelectTrip(trip.id)}
                    className={cn("w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
                      currentTripId === trip.id ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50")}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary/20 shrink-0">
                      <Map className="h-4 w-4 text-sidebar-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{trip.name}</p>
                      <p className="text-xs text-sidebar-muted truncate">{trip.destination}</p>
                    </div>
                    {currentTripId === trip.id && <ChevronRight className="h-4 w-4 text-sidebar-muted shrink-0" />}
                  </button>
                ))
              )}
            </div>
          </div>

          {currentTrip && (
            <div className="px-4 mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium uppercase tracking-wider text-sidebar-muted truncate">{currentTrip.name}</span>
                {isAdmin && onEditTrip && (
                  <button onClick={onEditTrip} className="flex h-6 w-6 items-center justify-center rounded-md text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground">
                    <Settings className="h-4 w-4" />
                  </button>
                )}
              </div>
              <nav className="space-y-1">
                {navItems.map(item => (
                  <button key={item.id} onClick={() => onViewChange(item.id)}
                    className={cn("w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
                      currentView === item.id ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50")}>
                    <item.icon className="h-4 w-4 shrink-0" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Settings Section */}
          <div className="mt-6">
            <SettingsSection />
          </div>
        </div>

        <div className="border-t border-sidebar-border p-4">
          <button onClick={onSignOut} className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground hover:bg-sidebar-accent/50">
            <LogOut className="h-4 w-4 shrink-0" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Profile Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              Edit Profile
            </DialogTitle>
            <DialogDescription>
              Update your display name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="displayNameDesktop">Display Name</Label>
              <Input
                id="displayNameDesktop"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter your name"
                className="h-11"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1" 
                onClick={() => setIsProfileOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                className="flex-1" 
                onClick={handleSaveName}
                disabled={savingName || !newName.trim()}
              >
                {savingName ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Currency Dialog */}
      <Dialog open={isCurrencyOpen} onOpenChange={setIsCurrencyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              Currency
            </DialogTitle>
            <DialogDescription>
              Select your preferred currency
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Select value={currency.code} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="bg-popover">
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
        </DialogContent>
      </Dialog>
    </>
  );
}

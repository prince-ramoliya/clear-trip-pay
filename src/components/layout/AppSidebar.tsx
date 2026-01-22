import { cn } from "@/lib/utils";
import { Map, Receipt, PieChart, Plus, ChevronRight, Wallet, LogOut, Ticket, Settings, User, Globe } from "lucide-react";
import { DbTrip } from "@/types/database";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/contexts/CurrencyContext";
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
  onOpenProfile?: () => void;
  onOpenCurrency?: () => void;
}

const navItems = [
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'summary', label: 'Summary', icon: PieChart },
  { id: 'settlements', label: 'Settle Up', icon: Wallet },
];

export function AppSidebar({ 
  trips, currentTripId, onSelectTrip, onCreateTrip, onJoinTrip, 
  currentView, onViewChange, onSignOut, onEditTrip, onLeaveTrip,
  isMobile = false, currentUserId, onOpenProfile, onOpenCurrency 
}: AppSidebarProps) {
  const currentTrip = trips.find(t => t.id === currentTripId);
  const isAdmin = currentTrip?.created_by === currentUserId;
  const { currency } = useCurrency();
  const { profile } = useProfile(currentUserId);

  // Settings section component
  const SettingsSection = () => (
    <div className="px-4 mb-4">
      <span className="text-xs font-bold uppercase tracking-wider text-sidebar-muted mb-3 block">Settings</span>
      <div className="space-y-1">
        {/* Edit Profile */}
        <button 
          onClick={onOpenProfile}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-all text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary/20 shrink-0">
            <User className="h-4 w-4 text-sidebar-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">My Profile</p>
            <p className="text-xs text-sidebar-muted truncate">{profile?.display_name || 'Set your name'}</p>
          </div>
        </button>

        {/* Currency Setting */}
        <button 
          onClick={onOpenCurrency}
          className="w-full flex items-center gap-3 rounded-lg px-3 py-3 text-left transition-all text-sidebar-foreground hover:bg-sidebar-accent/50"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary/20 shrink-0">
            <Globe className="h-4 w-4 text-sidebar-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold">Currency</p>
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
              <p className="text-sm font-semibold">Leave Trip</p>
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
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto py-4">
          {/* Big buttons for Create and Join */}
          <div className="px-4 mb-4 space-y-2">
            <Button onClick={onCreateTrip} className="w-full justify-start gap-3 h-12 text-base font-semibold" size="lg">
              <Plus className="h-5 w-5" />
              Create a New Trip
            </Button>
            <Button onClick={onJoinTrip} variant="outline" className="w-full justify-start gap-3 h-12 text-base font-semibold" size="lg">
              <Ticket className="h-5 w-5" />
              Join a Trip
            </Button>
          </div>

          <div className="px-4 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-sidebar-muted mb-3 block">Your Trips</span>
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
                      <p className="text-sm font-semibold truncate">{trip.name}</p>
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
            <span className="text-sm font-semibold">Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <aside className="h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary shrink-0">
          <Wallet className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-bold text-sidebar-foreground">TripSplit</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {/* Big buttons for Create and Join */}
        <div className="px-4 mb-4 space-y-2">
          <Button onClick={onCreateTrip} className="w-full justify-start gap-3 font-semibold" size="lg">
            <Plus className="h-5 w-5" />
            Create a New Trip
          </Button>
          <Button onClick={onJoinTrip} variant="outline" className="w-full justify-start gap-3 font-semibold" size="lg">
            <Ticket className="h-5 w-5" />
            Join a Trip
          </Button>
        </div>

        <div className="px-4 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sidebar-muted mb-3 block">Your Trips</span>
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
                    <p className="text-sm font-semibold truncate">{trip.name}</p>
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
              <span className="text-xs font-bold uppercase tracking-wider text-sidebar-muted truncate">{currentTrip.name}</span>
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
                  <span className="text-sm font-semibold">{item.label}</span>
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
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

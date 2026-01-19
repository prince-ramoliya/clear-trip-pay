import { cn } from "@/lib/utils";
import { Map, Receipt, PieChart, Plus, ChevronRight, Wallet, LogOut, Ticket, Settings } from "lucide-react";
import { DbTrip } from "@/types/database";
import { Button } from "@/components/ui/button";

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
  isMobile?: boolean;
  currentUserId?: string;
}

const navItems = [
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'summary', label: 'Summary', icon: PieChart },
  { id: 'settlements', label: 'Settle Up', icon: Wallet },
];

export function AppSidebar({ trips, currentTripId, onSelectTrip, onCreateTrip, onJoinTrip, currentView, onViewChange, onSignOut, onEditTrip, isMobile = false, currentUserId }: AppSidebarProps) {
  const currentTrip = trips.find(t => t.id === currentTripId);
  const isAdmin = currentTrip?.created_by === currentUserId;

  // Mobile version - simplified without header
  if (isMobile) {
    return (
      <div className="flex flex-col h-full">
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
        </div>

        <div className="border-t border-sidebar-border p-4">
          <button onClick={onSignOut} className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground hover:bg-sidebar-accent/50">
            <LogOut className="h-4 w-4" />
            <span className="text-sm font-medium">Sign Out</span>
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
      </div>

      <div className="border-t border-sidebar-border p-4">
        <button onClick={onSignOut} className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground hover:bg-sidebar-accent/50">
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
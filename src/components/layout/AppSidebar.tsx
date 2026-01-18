import { cn } from "@/lib/utils";
import { 
  Map, 
  Receipt, 
  PieChart, 
  Settings, 
  Plus,
  ChevronRight,
  Wallet
} from "lucide-react";
import { Trip } from "@/types/trip";

interface AppSidebarProps {
  trips: Trip[];
  currentTripId: string | null;
  onSelectTrip: (tripId: string) => void;
  onCreateTrip: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'expenses', label: 'Expenses', icon: Receipt },
  { id: 'summary', label: 'Summary', icon: PieChart },
  { id: 'settlements', label: 'Settle Up', icon: Wallet },
];

export function AppSidebar({
  trips,
  currentTripId,
  onSelectTrip,
  onCreateTrip,
  currentView,
  onViewChange,
}: AppSidebarProps) {
  const currentTrip = trips.find(t => t.id === currentTripId);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
          <Wallet className="h-5 w-5 text-sidebar-primary-foreground" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">TripSplit</span>
      </div>

      {/* Trips Section */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-sidebar-muted">
              Your Trips
            </span>
            <button
              onClick={onCreateTrip}
              className="flex h-6 w-6 items-center justify-center rounded-md text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          <div className="space-y-1">
            {trips.map(trip => (
              <button
                key={trip.id}
                onClick={() => onSelectTrip(trip.id)}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
                  currentTripId === trip.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary/20">
                  <Map className="h-4 w-4 text-sidebar-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{trip.name}</p>
                  <p className="text-xs text-sidebar-muted truncate">{trip.destination}</p>
                </div>
                {currentTripId === trip.id && (
                  <ChevronRight className="h-4 w-4 text-sidebar-muted" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Items */}
        {currentTrip && (
          <div className="px-4 mt-6">
            <span className="text-xs font-medium uppercase tracking-wider text-sidebar-muted px-3 mb-3 block">
              {currentTrip.name}
            </span>
            <nav className="space-y-1">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all",
                    currentView === item.id
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="border-t border-sidebar-border p-4">
        <button className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all">
          <Settings className="h-4 w-4" />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
}

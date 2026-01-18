import { useState } from "react";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ExpensesView } from "@/components/views/ExpensesView";
import { SummaryView } from "@/components/views/SummaryView";
import { SettlementsView } from "@/components/views/SettlementsView";
import { CreateTripDialog } from "@/components/trip/CreateTripDialog";
import { useTripStore } from "@/hooks/useTripStore";
import { ExpenseCategory, Member } from "@/types/trip";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const {
    trips,
    currentTrip,
    currentTripId,
    setCurrentTripId,
    createTrip,
    addExpense,
    removeExpense,
  } = useTripStore();

  const [currentView, setCurrentView] = useState<string>('expenses');
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleCreateTrip = (tripData: {
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    members: Member[];
  }) => {
    createTrip(tripData);
    setCurrentView('expenses');
  };

  const handleAddExpense = (expense: {
    title: string;
    amount: number;
    paidBy: string;
    participants: string[];
    category: ExpenseCategory;
    date: string;
  }) => {
    if (currentTripId) {
      addExpense(currentTripId, expense);
    }
  };

  const handleRemoveExpense = (expenseId: string) => {
    if (currentTripId) {
      removeExpense(currentTripId, expenseId);
    }
  };

  const renderView = () => {
    if (!currentTrip) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
              <span className="text-4xl">✈️</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to TripSplit</h2>
            <p className="text-muted-foreground max-w-md">
              Create your first trip to start tracking and splitting expenses with your group.
            </p>
          </div>
          <Button size="lg" onClick={() => setIsCreateTripOpen(true)}>
            Create Your First Trip
          </Button>
        </div>
      );
    }

    switch (currentView) {
      case 'expenses':
        return (
          <ExpensesView
            trip={currentTrip}
            onAddExpense={handleAddExpense}
            onRemoveExpense={handleRemoveExpense}
          />
        );
      case 'summary':
        return <SummaryView trip={currentTrip} />;
      case 'settlements':
        return <SettlementsView trip={currentTrip} />;
      default:
        return (
          <ExpensesView
            trip={currentTrip}
            onAddExpense={handleAddExpense}
            onRemoveExpense={handleRemoveExpense}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
            <span className="text-sm font-bold text-sidebar-primary-foreground">T</span>
          </div>
          <span className="font-semibold text-sidebar-foreground">TripSplit</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="text-sidebar-foreground"
        >
          {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:transform-none
        ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <AppSidebar
          trips={trips}
          currentTripId={currentTripId}
          onSelectTrip={(id) => {
            setCurrentTripId(id);
            setIsMobileSidebarOpen(false);
          }}
          onCreateTrip={() => {
            setIsCreateTripOpen(true);
            setIsMobileSidebarOpen(false);
          }}
          currentView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            setIsMobileSidebarOpen(false);
          }}
        />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-5xl mx-auto p-6 lg:p-8">
          {currentTrip && (
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{currentTrip.name}</h1>
              <p className="text-muted-foreground">{currentTrip.destination}</p>
            </div>
          )}
          {renderView()}
        </div>
      </main>

      <CreateTripDialog
        open={isCreateTripOpen}
        onOpenChange={setIsCreateTripOpen}
        onCreate={handleCreateTrip}
      />
    </div>
  );
};

export default Index;

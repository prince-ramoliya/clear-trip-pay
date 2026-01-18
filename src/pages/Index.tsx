import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTrips } from "@/hooks/useTrips";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ExpensesView } from "@/components/views/ExpensesView";
import { SummaryView } from "@/components/views/SummaryView";
import { SettlementsView } from "@/components/views/SettlementsView";
import { CreateTripDialog } from "@/components/trip/CreateTripDialog";
import { JoinTripDialog } from "@/components/trip/JoinTripDialog";
import { InviteDialog } from "@/components/trip/InviteDialog";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, UserPlus, Loader2 } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { inviteCode: urlInviteCode } = useParams();
  const { user, loading: authLoading, signOut, isAuthenticated } = useAuth();
  const {
    trips, currentTripId, currentTripData, loading: tripsLoading,
    setCurrentTripId, createTrip, addExpense, updateExpense, removeExpense, joinTripByCode,
  } = useTrips(user?.id);

  const [currentView, setCurrentView] = useState('expenses');
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isJoinTripOpen, setIsJoinTripOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth');
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (urlInviteCode && isAuthenticated) {
      joinTripByCode(urlInviteCode);
      navigate('/');
    }
  }, [urlInviteCode, isAuthenticated, joinTripByCode, navigate]);

  if (authLoading || tripsLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleCreateTrip = async (data: { name: string; destination: string; startDate: string; endDate: string }, memberNames: string[]) => {
    await createTrip(data, memberNames);
    setCurrentView('expenses');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const renderView = () => {
    if (!currentTripData) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
              <span className="text-4xl">✈️</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to TripSplit</h2>
            <p className="text-muted-foreground max-w-md">Create your first trip or join an existing one.</p>
          </div>
          <div className="flex gap-3">
            <Button size="lg" onClick={() => setIsCreateTripOpen(true)}>Create Trip</Button>
            <Button size="lg" variant="outline" onClick={() => setIsJoinTripOpen(true)}>Join Trip</Button>
          </div>
        </div>
      );
    }

    const tripForView = {
      id: currentTripData.trip.id,
      name: currentTripData.trip.name,
      destination: currentTripData.trip.destination,
      startDate: currentTripData.trip.start_date,
      endDate: currentTripData.trip.end_date,
      createdAt: currentTripData.trip.created_at,
      members: currentTripData.members.map(m => ({ id: m.id, name: m.display_name })),
      expenses: currentTripData.expenses.map(e => ({
        id: e.id, title: e.title, amount: Number(e.amount), paidBy: e.paid_by,
        participants: e.participants.map(p => p.member_id),
        category: e.category as any, date: e.expense_date, createdAt: e.created_at,
      })),
    };

    switch (currentView) {
      case 'expenses':
        return <ExpensesView trip={tripForView} members={currentTripData.members} expenses={currentTripData.expenses} onAddExpense={addExpense} onUpdateExpense={updateExpense} onRemoveExpense={removeExpense} />;
      case 'summary':
        return <SummaryView trip={tripForView} />;
      case 'settlements':
        return <SettlementsView trip={tripForView} />;
      default:
        return <ExpensesView trip={tripForView} members={currentTripData.members} expenses={currentTripData.expenses} onAddExpense={addExpense} onUpdateExpense={updateExpense} onRemoveExpense={removeExpense} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-sidebar-foreground">TripSplit</span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} className="text-sidebar-foreground">
          {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </header>

      {isMobileSidebarOpen && <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)} />}

      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:transform-none ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <AppSidebar
          trips={trips}
          currentTripId={currentTripId}
          onSelectTrip={(id) => { setCurrentTripId(id); setIsMobileSidebarOpen(false); }}
          onCreateTrip={() => { setIsCreateTripOpen(true); setIsMobileSidebarOpen(false); }}
          onJoinTrip={() => { setIsJoinTripOpen(true); setIsMobileSidebarOpen(false); }}
          currentView={currentView}
          onViewChange={(view) => { setCurrentView(view); setIsMobileSidebarOpen(false); }}
          onSignOut={handleSignOut}
        />
      </div>

      <main className="lg:ml-64 pt-16 lg:pt-0">
        <div className="max-w-5xl mx-auto p-6 lg:p-8">
          {currentTripData && (
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{currentTripData.trip.name}</h1>
                <p className="text-muted-foreground">{currentTripData.trip.destination}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsInviteOpen(true)}>
                <UserPlus className="h-4 w-4 mr-2" /> Invite
              </Button>
            </div>
          )}
          {renderView()}
        </div>
      </main>

      <CreateTripDialog open={isCreateTripOpen} onOpenChange={setIsCreateTripOpen} onCreate={handleCreateTrip} />
      <JoinTripDialog open={isJoinTripOpen} onOpenChange={setIsJoinTripOpen} onJoinTrip={joinTripByCode} />
      {currentTripData && (
        <InviteDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} inviteCode={currentTripData.trip.invite_code} tripName={currentTripData.trip.name} />
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTrips } from "@/hooks/useTrips";
import { usePayments } from "@/hooks/usePayments";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { ExpensesView } from "@/components/views/ExpensesView";
import { SummaryView } from "@/components/views/SummaryView";
import { SettlementsView } from "@/components/views/SettlementsView";
import { CreateTripDialog } from "@/components/trip/CreateTripDialog";
import { JoinTripDialog } from "@/components/trip/JoinTripDialog";
import { InviteDialog } from "@/components/trip/InviteDialog";
import { AddExpenseDialog } from "@/components/trip/AddExpenseDialog";
import { MembersDialog } from "@/components/trip/MembersDialog";
import { Button } from "@/components/ui/button";
import { Menu, X, UserPlus, Loader2, Users } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const { inviteCode: urlInviteCode } = useParams();
  const { user, loading: authLoading, signOut, isAuthenticated } = useAuth();
  const {
    trips, currentTripId, currentTripData, loading: tripsLoading,
    setCurrentTripId, createTrip, addExpense, updateExpense, removeExpense, joinTripByCode,
    addMember, removeMember, updateMemberName,
  } = useTrips(user?.id);
  const { payments, addPayment, deletePayment } = usePayments(currentTripId || undefined, user?.id);

  const [currentView, setCurrentView] = useState('expenses');
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isJoinTripOpen, setIsJoinTripOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileAddExpenseOpen, setIsMobileAddExpenseOpen] = useState(false);

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
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="mb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
              <span className="text-4xl">✈️</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Welcome to TripSplit</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md">Create your first trip or join an existing one.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Button size="lg" onClick={() => setIsCreateTripOpen(true)} className="w-full sm:w-auto">Create Trip</Button>
            <Button size="lg" variant="outline" onClick={() => setIsJoinTripOpen(true)} className="w-full sm:w-auto">Join Trip</Button>
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
        return <SettlementsView trip={tripForView} payments={payments} onMarkPaid={addPayment} onDeletePayment={deletePayment} />;
      default:
        return <ExpensesView trip={tripForView} members={currentTripData.members} expenses={currentTripData.expenses} onAddExpense={addExpense} onUpdateExpense={updateExpense} onRemoveExpense={removeExpense} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(true)} className="shrink-0">
            <Menu className="h-5 w-5" />
          </Button>
          {currentTripData ? (
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-foreground truncate">{currentTripData.trip.name}</h1>
              <p className="text-xs text-muted-foreground truncate">{currentTripData.trip.destination}</p>
            </div>
          ) : (
            <span className="font-semibold text-foreground">TripSplit</span>
          )}
        </div>
        {currentTripData && (
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" onClick={() => setIsMembersOpen(true)}>
              <Users className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsInviteOpen(true)}>
              <UserPlus className="h-5 w-5" />
            </Button>
          </div>
        )}
      </header>

      {/* Mobile Sidebar Overlay - Full screen drawer */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[280px] max-w-[85vw] bg-sidebar shadow-xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border">
              <span className="text-lg font-semibold text-sidebar-foreground">TripSplit</span>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(false)} className="text-sidebar-foreground">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              <AppSidebar
                trips={trips}
                currentTripId={currentTripId}
                onSelectTrip={(id) => { setCurrentTripId(id); setIsMobileSidebarOpen(false); }}
                onCreateTrip={() => { setIsCreateTripOpen(true); setIsMobileSidebarOpen(false); }}
                onJoinTrip={() => { setIsJoinTripOpen(true); setIsMobileSidebarOpen(false); }}
                currentView={currentView}
                onViewChange={(view) => { setCurrentView(view); setIsMobileSidebarOpen(false); }}
                onSignOut={handleSignOut}
                isMobile={true}
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50">
        <AppSidebar
          trips={trips}
          currentTripId={currentTripId}
          onSelectTrip={(id) => setCurrentTripId(id)}
          onCreateTrip={() => setIsCreateTripOpen(true)}
          onJoinTrip={() => setIsJoinTripOpen(true)}
          currentView={currentView}
          onViewChange={setCurrentView}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-14 lg:pt-0 pb-20 lg:pb-0">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Desktop Trip Header */}
          {currentTripData && (
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{currentTripData.trip.name}</h1>
                <p className="text-muted-foreground">{currentTripData.trip.destination}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsMembersOpen(true)}>
                  <Users className="h-4 w-4 mr-2" /> Members ({currentTripData.members.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsInviteOpen(true)}>
                  <UserPlus className="h-4 w-4 mr-2" /> Invite
                </Button>
              </div>
            </div>
          )}
          {renderView()}
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNavigation
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddExpense={() => setIsMobileAddExpenseOpen(true)}
        hasTripSelected={!!currentTripData}
      />

      {/* Dialogs */}
      <CreateTripDialog open={isCreateTripOpen} onOpenChange={setIsCreateTripOpen} onCreate={handleCreateTrip} />
      <JoinTripDialog open={isJoinTripOpen} onOpenChange={setIsJoinTripOpen} onJoinTrip={joinTripByCode} />
      {currentTripData && (
        <>
          <InviteDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} inviteCode={currentTripData.trip.invite_code} tripName={currentTripData.trip.name} />
          <AddExpenseDialog 
            open={isMobileAddExpenseOpen} 
            onOpenChange={setIsMobileAddExpenseOpen} 
            members={currentTripData.members} 
            onAddExpense={addExpense} 
          />
          <MembersDialog
            open={isMembersOpen}
            onOpenChange={setIsMembersOpen}
            members={currentTripData.members}
            currentUserId={user?.id}
            tripCreatedBy={currentTripData.trip.created_by}
            onAddMember={addMember}
            onRemoveMember={removeMember}
            onUpdateMemberName={updateMemberName}
          />
        </>
      )}
    </div>
  );
}

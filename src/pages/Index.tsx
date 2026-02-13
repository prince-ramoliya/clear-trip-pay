import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTrips } from "@/hooks/useTrips";
import { usePayments } from "@/hooks/usePayments";
import { useProfile } from "@/hooks/useProfile";
import { useToast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { ExpensesView } from "@/components/views/ExpensesView";
import { SummaryView } from "@/components/views/SummaryView";
import { SettlementsView } from "@/components/views/SettlementsView";
import { CreateTripDialog } from "@/components/trip/CreateTripDialog";
import { TripCreatedShareDialog } from "@/components/trip/TripCreatedShareDialog";
import { JoinTripDialog } from "@/components/trip/JoinTripDialog";
import { InviteDialog } from "@/components/trip/InviteDialog";
import { AddExpenseDialog } from "@/components/trip/AddExpenseDialog";
import { MembersDialog } from "@/components/trip/MembersDialog";
import { EditTripDialog } from "@/components/trip/EditTripDialog";
import { LeaveTripDialog } from "@/components/trip/LeaveTripDialog";
import { ProfileDialog } from "@/components/trip/ProfileDialog";
import { CurrencyDialog } from "@/components/trip/CurrencyDialog";
import { FirstLoginNamePrompt } from "@/components/trip/FirstLoginNamePrompt";
import { EmptyTripState } from "@/components/trip/EmptyTripState";

import { Button } from "@/components/ui/button";
import { Menu, X, UserPlus, Loader2, Users, Plane } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const {
    inviteCode: urlInviteCode
  } = useParams();
  const {
    user,
    loading: authLoading,
    signOut,
    isAuthenticated
  } = useAuth();
  const { profile, loading: profileLoading } = useProfile(user?.id);
  const { toast } = useToast();
  const welcomeShownRef = useRef(false);
  const {
    trips,
    currentTripId,
    currentTripData,
    loading: tripsLoading,
    setCurrentTripId,
    createTrip,
    updateTrip,
    deleteTrip,
    addExpense,
    updateExpense,
    removeExpense,
    joinTripByCode,
    addMember,
    removeMember,
    updateMemberName,
    leaveTrip,
    prefetchTrip
  } = useTrips(user?.id);
  const {
    payments,
    addPayment,
    deletePayment
  } = usePayments(currentTripId || undefined, user?.id);
  const [currentView, setCurrentView] = useState('expenses');
  const [isCreateTripOpen, setIsCreateTripOpen] = useState(false);
  const [isJoinTripOpen, setIsJoinTripOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isEditTripOpen, setIsEditTripOpen] = useState(false);
  const [isLeaveTripOpen, setIsLeaveTripOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isLeavingTrip, setIsLeavingTrip] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobileAddExpenseOpen, setIsMobileAddExpenseOpen] = useState(false);
  const [shareDialogData, setShareDialogData] = useState<{ tripName: string; inviteCode: string } | null>(null);
  const [isJoiningViaLink, setIsJoiningViaLink] = useState(false);
  const isAdmin = currentTripData?.trip.created_by === user?.id;
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      if (urlInviteCode) {
        // Redirect to auth with return URL so they come back after login
        navigate(`/auth?redirect=/join/${urlInviteCode}`);
      } else {
        navigate('/');
      }
    }
  }, [authLoading, isAuthenticated, navigate, urlInviteCode]);
  useEffect(() => {
    if (urlInviteCode && isAuthenticated && !isJoiningViaLink) {
      setIsJoiningViaLink(true);
      joinTripByCode(urlInviteCode).finally(() => {
        setIsJoiningViaLink(false);
        navigate('/dashboard');
      });
    }
  }, [urlInviteCode, isAuthenticated, joinTripByCode, navigate, isJoiningViaLink]);

  // Show welcome message on first load after login
  useEffect(() => {
    if (!profileLoading && profile && isAuthenticated && !welcomeShownRef.current) {
      const sessionKey = `welcome_shown_${user?.id}`;
      const alreadyShown = sessionStorage.getItem(sessionKey);
      
      if (!alreadyShown) {
        const displayName = profile.display_name || 'there';
        const firstName = displayName.split(' ')[0];
        
        toast({
          title: `Welcome back, ${firstName}! 👋`,
          description: "Ready to track your trip expenses?",
        });
        
        sessionStorage.setItem(sessionKey, 'true');
        welcomeShownRef.current = true;
      }
    }
  }, [profileLoading, profile, isAuthenticated, user?.id, toast]);
  if (authLoading || tripsLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>;
  }
  if (isJoiningViaLink) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
          <Plane className="h-8 w-8 text-primary-foreground" />
        </div>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center space-y-1">
          <p className="text-lg font-semibold text-foreground">Joining trip...</p>
          <p className="text-sm text-muted-foreground">Please wait while we add you to the trip</p>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return null;
  const handleCreateTrip = async (data: {
    name: string;
    destination: string;
    startDate: string;
    endDate: string;
    inviteCode?: string;
    memberMode?: 'automatic' | 'manual';
  }, memberNames: string[]) => {
    const trip = await createTrip(data, memberNames);
    setCurrentView('expenses');
    
    // Show share dialog for automatic trips
    if (trip && data.memberMode === 'automatic' && data.inviteCode) {
      setShareDialogData({ tripName: trip.name, inviteCode: data.inviteCode });
    }
  };
  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };
  const handleLeaveTrip = async () => {
    setIsLeavingTrip(true);
    const success = await leaveTrip();
    setIsLeavingTrip(false);
    return success;
  };
  const handleOpenProfile = () => {
    setIsMobileSidebarOpen(false);
    setIsProfileOpen(true);
  };
  const handleOpenCurrency = () => {
    setIsMobileSidebarOpen(false);
    setIsCurrencyOpen(true);
  };
  const renderView = () => {
    if (!currentTripData) {
      return (
        <EmptyTripState
          onCreateTrip={() => setIsCreateTripOpen(true)}
          onJoinTrip={() => setIsJoinTripOpen(true)}
        />
      );
    }
    const tripForView = {
      id: currentTripData.trip.id,
      name: currentTripData.trip.name,
      destination: currentTripData.trip.destination,
      startDate: currentTripData.trip.start_date,
      endDate: currentTripData.trip.end_date,
      createdAt: currentTripData.trip.created_at,
      members: currentTripData.members.map(m => ({
        id: m.id,
        name: m.display_name
      })),
      expenses: currentTripData.expenses.map(e => ({
        id: e.id,
        title: e.title,
        amount: Number(e.amount),
        paidBy: e.paid_by,
        participants: e.participants.map(p => p.member_id),
        category: e.category as any,
        date: e.expense_date,
        createdAt: e.created_at
      }))
    };
    switch (currentView) {
      case 'expenses':
        return <ExpensesView trip={tripForView} members={currentTripData.members} expenses={currentTripData.expenses} memberMode={currentTripData.trip.member_mode} onAddExpense={addExpense} onUpdateExpense={updateExpense} onRemoveExpense={removeExpense} currentUserId={user?.id} />;
      case 'summary':
        return <SummaryView trip={tripForView} />;
      case 'settlements':
        return <SettlementsView trip={tripForView} payments={payments} onMarkPaid={addPayment} onDeletePayment={deletePayment} />;
      default:
        return <ExpensesView trip={tripForView} members={currentTripData.members} expenses={currentTripData.expenses} memberMode={currentTripData.trip.member_mode} onAddExpense={addExpense} onUpdateExpense={updateExpense} onRemoveExpense={removeExpense} currentUserId={user?.id} />;
    }
  };
  return <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-3 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(true)} className="shrink-0 h-10 w-10">
            <Menu className="h-5 w-5" />
          </Button>
          {currentTripData ? <div className="min-w-0 flex-1">
              <h1 className="font-bold text-foreground truncate text-lg">{currentTripData.trip.name}</h1>
              
            </div> : <span className="font-bold text-foreground text-lg">TripSplit</span>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {currentTripData && <>
              <Button variant="ghost" size="icon" onClick={() => setIsMembersOpen(true)} className="h-10 w-10">
                <Users className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsInviteOpen(true)} className="h-10 w-10">
                <UserPlus className="h-5 w-5" />
              </Button>
            </>}
        </div>
      </header>

      {/* Mobile Sidebar Overlay - Full screen drawer */}
      {isMobileSidebarOpen && <div className="lg:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-[300px] max-w-[85vw] bg-sidebar shadow-xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-sidebar-border">
              <span className="text-lg font-bold text-sidebar-foreground">TripSplit</span>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(false)} className="text-sidebar-foreground h-10 w-10">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="overflow-y-auto h-[calc(100%-60px)]">
              <AppSidebar trips={trips} currentTripId={currentTripId} onSelectTrip={id => {
            setCurrentTripId(id);
            setIsMobileSidebarOpen(false);
          }} onCreateTrip={() => {
            setIsCreateTripOpen(true);
            setIsMobileSidebarOpen(false);
          }} onJoinTrip={() => {
            setIsJoinTripOpen(true);
            setIsMobileSidebarOpen(false);
          }} currentView={currentView} onViewChange={view => {
            setCurrentView(view);
            setIsMobileSidebarOpen(false);
          }} onSignOut={handleSignOut} onEditTrip={() => {
            setIsEditTripOpen(true);
            setIsMobileSidebarOpen(false);
          }} onLeaveTrip={() => {
            setIsLeaveTripOpen(true);
            setIsMobileSidebarOpen(false);
          }} isMobile={true} currentUserId={user?.id} onOpenProfile={handleOpenProfile} onOpenCurrency={handleOpenCurrency} onPrefetchTrip={prefetchTrip} />
            </div>
          </div>
        </div>}

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50">
        <AppSidebar trips={trips} currentTripId={currentTripId} onSelectTrip={id => setCurrentTripId(id)} onCreateTrip={() => setIsCreateTripOpen(true)} onJoinTrip={() => setIsJoinTripOpen(true)} currentView={currentView} onViewChange={setCurrentView} onSignOut={handleSignOut} onEditTrip={() => setIsEditTripOpen(true)} onLeaveTrip={() => setIsLeaveTripOpen(true)} currentUserId={user?.id} onOpenProfile={() => setIsProfileOpen(true)} onOpenCurrency={() => setIsCurrencyOpen(true)} onPrefetchTrip={prefetchTrip} />
      </div>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 pb-24 lg:pb-0">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 py-[17px]">
          {/* Desktop Trip Header */}
          {currentTripData && <div className="hidden lg:flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">{currentTripData.trip.name}</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsMembersOpen(true)} className="font-semibold">
                  <Users className="h-4 w-4 mr-2" /> Members ({currentTripData.members.length})
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsInviteOpen(true)} className="font-semibold">
                  <UserPlus className="h-4 w-4 mr-2" /> Invite
                </Button>
              </div>
            </div>}
          {renderView()}
        </div>
      </main>

      {/* Bottom Navigation (Mobile Only) */}
      <BottomNavigation currentView={currentView} onViewChange={setCurrentView} onAddExpense={() => setIsMobileAddExpenseOpen(true)} hasTripSelected={!!currentTripData} />

      {/* Dialogs */}
      <CreateTripDialog open={isCreateTripOpen} onOpenChange={setIsCreateTripOpen} onCreate={handleCreateTrip} />
      <JoinTripDialog open={isJoinTripOpen} onOpenChange={setIsJoinTripOpen} onJoinTrip={joinTripByCode} />
      {shareDialogData && (
        <TripCreatedShareDialog
          open={!!shareDialogData}
          onOpenChange={(open) => { if (!open) setShareDialogData(null); }}
          tripName={shareDialogData.tripName}
          inviteCode={shareDialogData.inviteCode}
        />
      )}
      <ProfileDialog open={isProfileOpen} onOpenChange={setIsProfileOpen} userId={user?.id} />
      <CurrencyDialog open={isCurrencyOpen} onOpenChange={setIsCurrencyOpen} />
      <FirstLoginNamePrompt userId={user?.id} />
      
      {currentTripData && <>
          <InviteDialog open={isInviteOpen} onOpenChange={setIsInviteOpen} inviteCode={currentTripData.trip.invite_code} tripName={currentTripData.trip.name} />
          <AddExpenseDialog open={isMobileAddExpenseOpen} onOpenChange={setIsMobileAddExpenseOpen} members={currentTripData.members} currentUserId={user?.id} memberMode={currentTripData.trip.member_mode} onAddExpense={addExpense} />
          <MembersDialog open={isMembersOpen} onOpenChange={setIsMembersOpen} members={currentTripData.members} currentUserId={user?.id} tripCreatedBy={currentTripData.trip.created_by} memberMode={currentTripData.trip.member_mode} inviteCode={currentTripData.trip.invite_code} tripName={currentTripData.trip.name} onAddMember={addMember} onRemoveMember={removeMember} onUpdateMemberName={updateMemberName} />
          {isAdmin ? <EditTripDialog open={isEditTripOpen} onOpenChange={setIsEditTripOpen} trip={currentTripData.trip} onUpdate={updateTrip} onDelete={deleteTrip} /> : <LeaveTripDialog open={isLeaveTripOpen} onOpenChange={setIsLeaveTripOpen} tripName={currentTripData.trip.name} onLeave={handleLeaveTrip} isLoading={isLeavingTrip} />}
          
        </>}
    </div>;
}
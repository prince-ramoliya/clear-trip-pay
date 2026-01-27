export interface DbTrip {
  id: string;
  name: string;
  destination: string;
  start_date: string;
  end_date: string;
  invite_code: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  member_mode: string;
}

export interface DbTripMember {
  id: string;
  trip_id: string;
  user_id: string | null;
  display_name: string;
  is_registered: boolean;
  created_at: string;
}

export interface DbExpense {
  id: string;
  trip_id: string;
  title: string;
  amount: number;
  paid_by: string;
  category: string;
  expense_date: string;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbExpenseParticipant {
  id: string;
  expense_id: string;
  member_id: string;
  created_at: string;
}

export interface DbProfile {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

// Extended types with relations
export interface TripWithMembers extends DbTrip {
  trip_members: DbTripMember[];
}

export interface ExpenseWithDetails extends DbExpense {
  expense_participants: DbExpenseParticipant[];
  payer?: DbTripMember;
}

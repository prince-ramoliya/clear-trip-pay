export interface Payment {
  id: string;
  tripId: string;
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  paidAt: string;
  notes?: string;
  createdBy?: string;
  createdAt: string;
}

export interface DbPayment {
  id: string;
  trip_id: string;
  from_member_id: string;
  to_member_id: string;
  amount: number;
  paid_at: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

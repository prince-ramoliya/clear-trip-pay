export interface Member {
  id: string;
  name: string;
  avatar?: string;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string;
  participants: string[];
  category: ExpenseCategory;
  date: string;
  createdAt: string;
  createdBy?: string | null;
}

export type ExpenseCategory = 
  | 'food' 
  | 'stay' 
  | 'travel' 
  | 'shopping' 
  | 'activities' 
  | 'other';

export interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  members: Member[];
  expenses: Expense[];
  createdAt: string;
}

export interface MemberBalance {
  memberId: string;
  memberName: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
}

export interface Settlement {
  from: string;
  fromName: string;
  to: string;
  toName: string;
  amount: number;
}

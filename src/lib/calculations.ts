import { Expense, Member, MemberBalance, Settlement } from "@/types/trip";

export function calculateBalances(members: Member[], expenses: Expense[]): MemberBalance[] {
  const balances: Map<string, { paid: number; owes: number }> = new Map();
  
  // Initialize balances for all members
  members.forEach(member => {
    balances.set(member.id, { paid: 0, owes: 0 });
  });
  
  // Calculate what each person paid and owes
  expenses.forEach(expense => {
    const payer = balances.get(expense.paidBy);
    if (payer) {
      payer.paid += expense.amount;
    }
    
    const sharePerPerson = expense.amount / expense.participants.length;
    expense.participants.forEach(participantId => {
      const participant = balances.get(participantId);
      if (participant) {
        participant.owes += sharePerPerson;
      }
    });
  });
  
  return members.map(member => {
    const balance = balances.get(member.id) || { paid: 0, owes: 0 };
    return {
      memberId: member.id,
      memberName: member.name,
      totalPaid: Math.round(balance.paid * 100) / 100,
      totalOwed: Math.round(balance.owes * 100) / 100,
      netBalance: Math.round((balance.paid - balance.owes) * 100) / 100,
    };
  });
}

export function calculateSettlements(members: Member[], expenses: Expense[]): Settlement[] {
  const balances = calculateBalances(members, expenses);
  
  // Separate into creditors (positive balance) and debtors (negative balance)
  const creditors: { id: string; name: string; amount: number }[] = [];
  const debtors: { id: string; name: string; amount: number }[] = [];
  
  balances.forEach(balance => {
    if (balance.netBalance > 0.01) {
      creditors.push({
        id: balance.memberId,
        name: balance.memberName,
        amount: balance.netBalance,
      });
    } else if (balance.netBalance < -0.01) {
      debtors.push({
        id: balance.memberId,
        name: balance.memberName,
        amount: Math.abs(balance.netBalance),
      });
    }
  });
  
  // Sort to minimize transactions
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);
  
  const settlements: Settlement[] = [];
  
  let i = 0;
  let j = 0;
  
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    
    const amount = Math.min(debtor.amount, creditor.amount);
    
    if (amount > 0.01) {
      settlements.push({
        from: debtor.id,
        fromName: debtor.name,
        to: creditor.id,
        toName: creditor.name,
        amount: Math.round(amount * 100) / 100,
      });
    }
    
    debtor.amount -= amount;
    creditor.amount -= amount;
    
    if (debtor.amount < 0.01) i++;
    if (creditor.amount < 0.01) j++;
  }
  
  return settlements;
}

export function getTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, expense) => sum + expense.amount, 0);
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    food: '🍽️',
    stay: '🏨',
    travel: '🚗',
    shopping: '🛍️',
    activities: '🎯',
    other: '📝',
  };
  return icons[category] || '📝';
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    food: 'Food & Drinks',
    stay: 'Accommodation',
    travel: 'Transport',
    shopping: 'Shopping',
    activities: 'Activities',
    other: 'Other',
  };
  return labels[category] || 'Other';
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

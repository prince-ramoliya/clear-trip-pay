import { useState, useCallback } from 'react';
import { Trip, Expense, Member, ExpenseCategory } from '@/types/trip';

// Sample data for demo
const sampleTrips: Trip[] = [
  {
    id: '1',
    name: 'Goa Beach Trip',
    destination: 'Goa, India',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    createdAt: new Date().toISOString(),
    members: [
      { id: 'm1', name: 'Rahul' },
      { id: 'm2', name: 'Priya' },
      { id: 'm3', name: 'Amit' },
      { id: 'm4', name: 'Sneha' },
    ],
    expenses: [
      {
        id: 'e1',
        title: 'Hotel Booking',
        amount: 12000,
        paidBy: 'm1',
        participants: ['m1', 'm2', 'm3', 'm4'],
        category: 'stay',
        date: '2024-01-15',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'e2',
        title: 'Dinner at Beach Shack',
        amount: 3200,
        paidBy: 'm2',
        participants: ['m1', 'm2', 'm3', 'm4'],
        category: 'food',
        date: '2024-01-16',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'e3',
        title: 'Water Sports',
        amount: 4000,
        paidBy: 'm3',
        participants: ['m1', 'm3', 'm4'],
        category: 'activities',
        date: '2024-01-17',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'e4',
        title: 'Taxi to Airport',
        amount: 2500,
        paidBy: 'm4',
        participants: ['m1', 'm2', 'm3', 'm4'],
        category: 'travel',
        date: '2024-01-20',
        createdAt: new Date().toISOString(),
      },
    ],
  },
];

export function useTripStore() {
  const [trips, setTrips] = useState<Trip[]>(sampleTrips);
  const [currentTripId, setCurrentTripId] = useState<string | null>(sampleTrips[0]?.id || null);

  const currentTrip = trips.find(t => t.id === currentTripId) || null;

  const createTrip = useCallback((tripData: Omit<Trip, 'id' | 'createdAt' | 'expenses'>) => {
    const newTrip: Trip = {
      ...tripData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      expenses: [],
    };
    setTrips(prev => [...prev, newTrip]);
    setCurrentTripId(newTrip.id);
    return newTrip;
  }, []);

  const addMember = useCallback((tripId: string, member: Omit<Member, 'id'>) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      return {
        ...trip,
        members: [...trip.members, { ...member, id: crypto.randomUUID() }],
      };
    }));
  }, []);

  const removeMember = useCallback((tripId: string, memberId: string) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      return {
        ...trip,
        members: trip.members.filter(m => m.id !== memberId),
      };
    }));
  }, []);

  const addExpense = useCallback((tripId: string, expense: Omit<Expense, 'id' | 'createdAt'>) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      return {
        ...trip,
        expenses: [
          ...trip.expenses,
          { ...expense, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
        ],
      };
    }));
  }, []);

  const removeExpense = useCallback((tripId: string, expenseId: string) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      return {
        ...trip,
        expenses: trip.expenses.filter(e => e.id !== expenseId),
      };
    }));
  }, []);

  const updateExpense = useCallback((tripId: string, expenseId: string, updates: Partial<Expense>) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id !== tripId) return trip;
      return {
        ...trip,
        expenses: trip.expenses.map(e => 
          e.id === expenseId ? { ...e, ...updates } : e
        ),
      };
    }));
  }, []);

  return {
    trips,
    currentTrip,
    currentTripId,
    setCurrentTripId,
    createTrip,
    addMember,
    removeMember,
    addExpense,
    removeExpense,
    updateExpense,
  };
}

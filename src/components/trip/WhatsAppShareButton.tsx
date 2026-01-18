import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Trip, Settlement } from "@/types/trip";
import { calculateSettlements, formatCurrency, getTotalExpenses } from "@/lib/calculations";
import { format } from "date-fns";

interface WhatsAppShareButtonProps {
  trip: Trip;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

export function WhatsAppShareButton({ trip, className, variant = "default", size = "default" }: WhatsAppShareButtonProps) {
  const settlements = calculateSettlements(trip.members, trip.expenses);
  const totalExpenses = getTotalExpenses(trip.expenses);

  const generateWhatsAppMessage = () => {
    const lines: string[] = [];
    
    // Header
    lines.push(`🌴 *${trip.name}* - Trip Expense Summary`);
    lines.push(`📍 ${trip.destination}`);
    lines.push(`📅 ${format(new Date(trip.startDate), 'dd MMM')} - ${format(new Date(trip.endDate), 'dd MMM yyyy')}`);
    lines.push('');
    
    // Total
    lines.push(`💰 *Total Spent:* ${formatCurrency(totalExpenses)}`);
    lines.push(`👥 *Members:* ${trip.members.map(m => m.name).join(', ')}`);
    lines.push('');
    
    // Settlements
    if (settlements.length > 0) {
      lines.push('━━━━━━━━━━━━━━━━━━');
      lines.push('💸 *Payments Required:*');
      lines.push('');
      
      settlements.forEach((settlement, index) => {
        lines.push(`${index + 1}. *${settlement.fromName}* ➜ pays ➜ *${settlement.toName}*`);
        lines.push(`   Amount: *${formatCurrency(settlement.amount)}*`);
        lines.push('');
      });
      
      lines.push('━━━━━━━━━━━━━━━━━━');
      lines.push('');
      lines.push('✅ Please settle up at your earliest convenience!');
    } else {
      lines.push('✅ *All Settled!* No pending payments.');
    }
    
    lines.push('');
    lines.push('_Sent via TripSplit_');
    
    return lines.join('\n');
  };

  const handleShare = () => {
    const message = generateWhatsAppMessage();
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Button 
      onClick={handleShare} 
      variant={variant} 
      size={size}
      className={className}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      Share on WhatsApp
    </Button>
  );
}

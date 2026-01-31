import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Users, PieChart, Calculator, Plane, Plus, Ticket } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyTripStateProps {
  onCreateTrip: () => void;
  onJoinTrip: () => void;
}

const features = [
  {
    icon: Users,
    title: "Group Expenses",
    description: "Track shared costs with friends and family",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Calculator,
    title: "Auto Splitting",
    description: "Automatically calculate who owes what",
    color: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: PieChart,
    title: "Visual Summary",
    description: "See spending breakdowns at a glance",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Wallet,
    title: "Easy Settlements",
    description: "Settle up with minimal transactions",
    color: "bg-amber-500/10 text-amber-500",
  },
];

export function EmptyTripState({ onCreateTrip, onJoinTrip }: EmptyTripStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="relative mx-auto mb-6"
        >
          <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 mx-auto shadow-lg">
            <Plane className="h-12 w-12 text-primary" />
          </div>
          {/* Decorative elements */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center"
          >
            <span className="text-xs">✨</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
            className="absolute -bottom-1 -left-2 h-5 w-5 rounded-full bg-amber-500/20 flex items-center justify-center"
          >
            <span className="text-xs">💰</span>
          </motion.div>
        </motion.div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3">
          Welcome to <span className="text-primary">TripSplit</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto">
          Split expenses effortlessly with your travel companions. No more awkward money talks!
        </p>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-12"
      >
        <Button
          size="lg"
          onClick={onCreateTrip}
          className="flex-1 h-14 text-base font-semibold gap-2 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
        >
          <Plus className="h-5 w-5" />
          Create a Trip
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={onJoinTrip}
          className="flex-1 h-14 text-base font-semibold gap-2 hover:bg-accent transition-all"
        >
          <Ticket className="h-5 w-5" />
          Join with Code
        </Button>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <p className="text-sm font-medium text-muted-foreground text-center mb-4 uppercase tracking-wider">
          Why TripSplit?
        </p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
            >
              <Card className="h-full border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300 bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-5">
                  <div className={`h-10 w-10 rounded-xl ${feature.color} flex items-center justify-center mb-3`}>
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Trust indicators */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="flex flex-wrap justify-center gap-4 mt-10 text-xs text-muted-foreground"
      >
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          Free to use
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
          No ads
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-purple-500"></span>
          Privacy first
        </span>
      </motion.div>
    </div>
  );
}

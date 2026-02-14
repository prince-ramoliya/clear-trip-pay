import { Button } from "@/components/ui/button";
import { Plus, Link, Users, Calculator, BarChart3, Handshake } from "lucide-react";
import { motion } from "framer-motion";

interface EmptyTripStateProps {
  onCreateTrip: () => void;
  onJoinTrip: () => void;
}

const features = [
  {
    icon: Users,
    title: "Track Together",
    description: "Add expenses for the whole group",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: Calculator,
    title: "Smart Split",
    description: "Auto-calculate fair shares",
    gradient: "from-emerald-500 to-emerald-600",
  },
  {
    icon: BarChart3,
    title: "See Stats",
    description: "Visual spending breakdown",
    gradient: "from-violet-500 to-violet-600",
  },
  {
    icon: Handshake,
    title: "Settle Up",
    description: "Clear debts with one tap",
    gradient: "from-amber-500 to-amber-600",
  },
];

export function EmptyTripState({ onCreateTrip, onJoinTrip }: EmptyTripStateProps) {
  return (
    <div className="flex flex-col min-h-[65vh] lg:min-h-[70vh] px-1 sm:px-4 py-6 sm:py-10">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8 sm:mb-12"
      >
        {/* Emoji Hero - Simple and friendly */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="mb-5 sm:mb-6"
        >
          <span className="text-6xl sm:text-7xl lg:text-8xl">🌴</span>
        </motion.div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-3">
          Welcome to <span className="text-primary">TripSplit</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-sm sm:max-w-md mx-auto">
          Split travel expenses with friends — no spreadsheets, no drama.
        </p>
      </motion.div>

      {/* Big Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="space-y-3 sm:space-y-4 mb-10 sm:mb-14 w-full max-w-md mx-auto"
      >
        <Button
          size="lg"
          onClick={onCreateTrip}
          className="w-full h-16 sm:h-[72px] text-lg sm:text-xl font-bold gap-3 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all rounded-2xl"
        >
          <Plus className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2.5} />
          Create a New Trip
        </Button>
        <Button
          size="lg"
          variant="outline"
          onClick={onJoinTrip}
          className="w-full h-16 sm:h-[72px] text-lg sm:text-xl font-bold gap-3 hover:bg-accent transition-all border-2 rounded-2xl"
        >
          <Link className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={2} />
          Join with Invite Code
        </Button>
      </motion.div>

      {/* Features Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="w-full max-w-lg mx-auto"
      >
        <p className="text-sm font-semibold text-muted-foreground text-center mb-5 uppercase tracking-wide">
          How it works
        </p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.08, duration: 0.35 }}
                className="bg-card border border-border rounded-2xl p-4 sm:p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-300"
              >
                {/* Icon with gradient background */}
                <div className={`h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-3 shadow-md`}>
                  <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-foreground text-base sm:text-lg mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-snug">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Trust badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="flex justify-center gap-6 mt-10 sm:mt-12"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500"></div>
          <span className="font-medium">100% Free</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>
          <span className="font-medium">No Ads</span>
        </div>
      </motion.div>
    </div>
  );
}

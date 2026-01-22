import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plane,
  Users,
  Receipt,
  Calculator,
  MessageCircle,
  Shield,
  Smartphone,
  Globe,
  ChevronRight,
  Check,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  CreditCard,
  PieChart,
  UserPlus,
  QrCode,
  Zap,
  Heart,
  Star,
  Wallet,
  Share2,
  Lock,
  BarChart3,
  RefreshCw,
  Bell,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Plane,
      title: "Trip Management",
      description: "Create and manage trips with destinations, dates, and members. Full control over your adventures.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Receipt,
      title: "Smart Expense Tracking",
      description: "Log expenses in 6 categories. Split costs among participants with precision.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Calculator,
      title: "Settlement Engine",
      description: "Smart algorithm minimizes transactions needed to settle all debts.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Users,
      title: "Member Management",
      description: "Add registered users or manual members. Perfect for mixed groups.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: QrCode,
      title: "Invite System",
      description: "Share invite codes for instant trip access. Secure and validated.",
      gradient: "from-indigo-500 to-violet-500",
    },
    {
      icon: CreditCard,
      title: "Payment Tracking",
      description: "Mark settlements as paid. Real-time balance updates.",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      icon: PieChart,
      title: "Spending Analytics",
      description: "Visual breakdown by category with percentages and charts.",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Sharing",
      description: "Generate and share trip summaries directly via WhatsApp.",
      gradient: "from-green-500 to-lime-500",
    },
    {
      icon: Shield,
      title: "Role Permissions",
      description: "Only creators can edit entries. Admins control settings.",
      gradient: "from-slate-500 to-gray-600",
    },
    {
      icon: Smartphone,
      title: "Mobile-First",
      description: "Optimized for phones with touch-friendly controls.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Globe,
      title: "Real-Time Sync",
      description: "Changes sync instantly across all devices.",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      icon: TrendingUp,
      title: "Trip Statistics",
      description: "Total spent, per-person average, and complete insights.",
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Create Trip",
      description: "Set up with destination, dates, and invite companions.",
      icon: Plane,
      color: "bg-blue-500",
    },
    {
      step: "02",
      title: "Add Expenses",
      description: "Log payments with amount, category, and participants.",
      icon: Receipt,
      color: "bg-purple-500",
    },
    {
      step: "03",
      title: "Track Balance",
      description: "See who owes whom in real-time with visual cards.",
      icon: Calculator,
      color: "bg-orange-500",
    },
    {
      step: "04",
      title: "Settle Up",
      description: "Get smart suggestions and share via WhatsApp.",
      icon: Check,
      color: "bg-green-500",
    },
  ];

  const testimonials = [
    {
      quote: "TripSplit made our Europe trip so much easier. No more awkward money talks!",
      author: "Priya M.",
      role: "Adventure Traveler",
      avatar: "🌍",
    },
    {
      quote: "The settlement algorithm is genius. Hours of work now takes seconds.",
      author: "Rahul K.",
      role: "Group Organizer",
      avatar: "✈️",
    },
    {
      quote: "Love adding friends without accounts. WhatsApp sharing is a game-changer.",
      author: "Sneha P.",
      role: "Weekend Explorer",
      avatar: "🏖️",
    },
  ];

  const stats = [
    { value: "10K+", label: "Trips" },
    { value: "₹5Cr+", label: "Tracked" },
    { value: "50K+", label: "Settlements" },
    { value: "4.9★", label: "Rating" },
  ];

  const whyChooseFeatures = [
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant calculations with zero lag",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: RefreshCw,
      title: "Real-Time Sync",
      description: "Updates across all devices instantly",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: UserPlus,
      title: "Guest Members",
      description: "Add friends without app accounts",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description: "WhatsApp summaries in one tap",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      icon: Lock,
      title: "Secure & Private",
      description: "Role-based access controls",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Visual spending breakdown",
      color: "text-pink-500",
      bgColor: "bg-pink-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden font-['DM_Sans',sans-serif]">
      {/* Navigation - Mobile Optimized */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
                <Plane className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground">
                TripSplit
              </span>
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-sm font-medium px-3"
              >
                <Link to="/auth?tab=login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="text-sm shadow-md px-3 sm:px-4">
                <Link to="/auth?tab=signup">
                  Sign Up
                  <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Mobile First with Creative Backgrounds */}
      <section className="relative pt-20 sm:pt-28 lg:pt-36 pb-16 sm:pb-24 lg:pb-32 overflow-hidden">
        {/* Creative Background Elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Gradient Orbs */}
          <div className="absolute top-10 sm:top-20 -left-20 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-primary/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 sm:bottom-20 -right-20 sm:right-10 w-56 sm:w-96 h-56 sm:h-96 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] lg:w-[800px] h-[300px] sm:h-[600px] lg:h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
          
          {/* Decorative Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] sm:bg-[size:6rem_6rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
          
          {/* Floating Shapes */}
          <motion.div 
            className="absolute top-32 right-8 sm:right-20 w-3 h-3 sm:w-4 sm:h-4 bg-primary/40 rounded-full"
            animate={{ y: [0, -10, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-48 left-8 sm:left-32 w-2 h-2 sm:w-3 sm:h-3 bg-accent-foreground/30 rounded-full"
            animate={{ y: [0, 10, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1 }}
          />
          <motion.div 
            className="absolute bottom-32 left-1/4 w-2 h-2 bg-success/40 rounded-full hidden sm:block"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          />
          
          {/* Light Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">
                Simplify Group Travel Expenses
              </span>
            </motion.div>

            {/* Headline - Mobile Optimized */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-4 sm:mb-6">
              Split Expenses
              <span className="block bg-gradient-to-r from-primary via-primary to-accent-foreground bg-clip-text text-transparent">
                Without Drama
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2">
              Track, split, and settle trip expenses with friends. Focus on memories, we handle the math.
            </p>

            {/* CTA Buttons - Stacked on Mobile */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto text-base px-6 py-5 sm:py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/25 transition-all"
              >
                <Link to="/auth?tab=signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto text-base px-6 py-5 sm:py-6"
              >
                <a href="#features">
                  See Features
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats - Mobile Grid */}
          <motion.div
            className="grid grid-cols-4 gap-2 sm:gap-4 lg:gap-8 mt-10 sm:mt-16 lg:mt-24 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center p-2 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl bg-card/60 backdrop-blur-sm border border-border/30"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section - Mobile Optimized Grid */}
      <section id="features" className="py-12 sm:py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-8 sm:mb-12 lg:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3 sm:mb-4">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-primary">Features</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-4">
              Everything You Need
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto px-4">
              Complete expense management from trip creation to final settlement.
            </p>
          </motion.div>

          {/* Mobile: 2 columns, Tablet: 2-3, Desktop: 3-4 */}
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group"
              >
                <Card className="h-full border-border/40 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
                  <CardContent className="p-3 sm:p-4 lg:p-6">
                    <div
                      className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 lg:h-12 lg:w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-md mb-2 sm:mb-3 lg:mb-4 group-hover:scale-105 transition-transform`}
                    >
                      <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works - Mobile Horizontal Scroll / Vertical Stack */}
      <section className="py-12 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-8 sm:mb-12 lg:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 mb-3 sm:mb-4">
              <Clock className="h-3 w-3 text-success" />
              <span className="text-xs font-medium text-success">Simple Process</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-4">
              How It Works
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground">
              Four simple steps to stress-free expense sharing.
            </p>
          </motion.div>

          {/* Mobile: Stack, Desktop: Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Connector Line - Hidden on Mobile */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-border to-transparent" />
                )}
                
                <div className="flex sm:flex-col items-start sm:items-center text-left sm:text-center gap-4 sm:gap-0 p-4 sm:p-0">
                  <div className="relative shrink-0">
                    <div className={`flex h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 items-center justify-center rounded-2xl ${item.color} text-white shadow-lg`}>
                      <item.icon className="h-5 w-5 sm:h-7 sm:w-7 lg:h-8 lg:w-8" />
                    </div>
                    <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-foreground text-background text-[10px] sm:text-xs font-bold shadow">
                      {item.step}
                    </span>
                  </div>
                  <div className="sm:mt-4">
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expense Categories - Mobile Scroll */}
      <section className="py-12 sm:py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-6 sm:mb-10 lg:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-2 sm:mb-4">
              Track Every Expense
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Six smart categories for organized spending.
            </p>
          </motion.div>

          {/* Mobile: Horizontal Scroll, Desktop: Grid */}
          <div className="flex sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none">
            {[
              { name: "Food", emoji: "🍽️", color: "from-orange-500 to-amber-500" },
              { name: "Stay", emoji: "🏨", color: "from-blue-500 to-cyan-500" },
              { name: "Travel", emoji: "🚗", color: "from-green-500 to-emerald-500" },
              { name: "Shopping", emoji: "🛍️", color: "from-pink-500 to-rose-500" },
              { name: "Activities", emoji: "🎯", color: "from-purple-500 to-violet-500" },
              { name: "Other", emoji: "📦", color: "from-gray-500 to-slate-500" },
            ].map((category, index) => (
              <motion.div
                key={index}
                className="shrink-0 w-24 sm:w-auto snap-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="border-border/40 bg-card/80">
                  <CardContent className="p-3 sm:p-4 lg:p-6 text-center">
                    <div
                      className={`inline-flex h-10 w-10 sm:h-12 sm:w-12 lg:h-14 lg:w-14 items-center justify-center rounded-xl bg-gradient-to-br ${category.color} text-white text-lg sm:text-xl lg:text-2xl shadow-md mb-2`}
                    >
                      {category.emoji}
                    </div>
                    <h3 className="text-xs sm:text-sm font-medium text-foreground">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose TripSplit - NEW DESIGN */}
      <section className="py-12 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/50 border border-accent-foreground/10 mb-3 sm:mb-4">
              <Heart className="h-3 w-3 text-primary" />
              <span className="text-xs font-medium text-accent-foreground">Why TripSplit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-4">
              Built for Travelers
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto">
              Every feature designed to eliminate money stress from group trips.
            </p>
          </motion.div>

          {/* New Card Grid Layout */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {whyChooseFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Card className="h-full border-border/40 bg-card hover:shadow-md transition-all duration-300 group">
                  <CardContent className="p-4 sm:p-5 lg:p-6">
                    <div className={`inline-flex h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 items-center justify-center rounded-xl ${feature.bgColor} mb-3 group-hover:scale-105 transition-transform`}>
                      <feature.icon className={`h-5 w-5 sm:h-5 sm:w-5 lg:h-6 lg:w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Trust Indicators */}
          <motion.div 
            className="mt-8 sm:mt-12 lg:mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-success" />
                <span className="text-xs sm:text-sm">100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-primary" />
                <span className="text-xs sm:text-sm">Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-warning" />
                <span className="text-xs sm:text-sm">No Spam</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials - Mobile Carousel Style */}
      <section className="py-12 sm:py-20 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-6 sm:mb-10 lg:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20 mb-3">
              <Star className="h-3 w-3 text-warning fill-warning" />
              <span className="text-xs font-medium text-warning">Reviews</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
              Loved by Travelers
            </h2>
          </motion.div>

          {/* Mobile: Stack, Desktop: Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-border/40 bg-card">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-sm sm:text-base text-foreground leading-relaxed mb-4">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          {testimonial.author}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Mobile Optimized */}
      <section className="py-12 sm:py-20 lg:py-32">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/80 p-6 sm:p-10 lg:p-14 text-center overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Pattern Background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTAgMGg0MHY0MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
            
            <div className="relative z-10">
              <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-primary-foreground mb-3 sm:mb-4">
                Ready to Split Smarter?
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-primary-foreground/90 max-w-md mx-auto mb-6">
                Join thousands of travelers enjoying stress-free expense sharing.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="w-full sm:w-auto text-sm sm:text-base px-6 py-5 bg-white text-primary hover:bg-white/95 shadow-lg"
                >
                  <Link to="/auth?tab=signup">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto text-sm sm:text-base px-6 py-5 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to="/auth?tab=login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Mobile Optimized */}
      <footer className="py-8 sm:py-12 lg:py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4 sm:gap-6 text-center">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Plane className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-foreground">TripSplit</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              © {new Date().getFullYear()} TripSplit. Developed by Prince Ramoliya ❤️ for travelers everywhere.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm">
                <Link to="/auth?tab=login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="text-xs sm:text-sm">
                <Link to="/auth?tab=signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

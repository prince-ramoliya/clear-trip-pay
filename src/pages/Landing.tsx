import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Plane, Users, Receipt, Calculator, MessageCircle, Shield,
  Smartphone, Globe, ChevronRight, Check, ArrowRight, Sparkles,
  TrendingUp, CreditCard, PieChart,
  QrCode, Zap, Heart, Star, ChevronDown, Play,
  Utensils, Home, Car, ShoppingBag, Palette, MoreHorizontal,
  ArrowDown, CircleDot, Menu, X
} from "lucide-react";

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [heroWordIndex, setHeroWordIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => {
      setHeroWordIndex((i) => (i + 1) % 4);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  const heroWords = [
    "without the drama",
    "with total clarity",
    "in real-time",
    "with fewer payments",
  ];

  const coreFeatures = [
    {
      icon: Plane,
      title: "Trip Management",
      description: "Create, edit, and manage trips with destinations and dates",
      color: "bg-primary",
      iconColor: "text-primary-foreground",
    },
    {
      icon: Receipt,
      title: "Expense Tracking", 
      description: "Log expenses with categories and participant splits",
      color: "bg-success",
      iconColor: "text-success-foreground",
    },
    {
      icon: Calculator,
      title: "Smart Settlements",
      description: "Minimize transactions with intelligent algorithms",
      color: "bg-accent-foreground",
      iconColor: "text-background",
    },
    {
      icon: Users,
      title: "Member System",
      description: "Add registered or manual members to any trip",
      color: "bg-warning",
      iconColor: "text-warning-foreground",
    }
  ];

  const allFeatures = [
    {
      icon: Plane,
      title: "Trip Creation & Lifecycle",
      description: "Create trips with custom names, destinations, and travel dates. Full management from start to finish.",
      category: "Core"
    },
    {
      icon: Receipt,
      title: "Smart Expense Logging",
      description: "Add expenses with amounts, payers, and participants. Choose from 6 categories for organized tracking.",
      category: "Core"
    },
    {
      icon: Calculator,
      title: "Settlement Engine",
      description: "Our algorithm calculates minimum transactions needed to settle all debts automatically.",
      category: "Core"
    },
    {
      icon: Users,
      title: "Flexible Members",
      description: "Add registered users or manual members who don't have accounts. Perfect for mixed groups.",
      category: "Core"
    },
    {
      icon: QrCode,
      title: "Invite System",
      description: "Share unique invite codes to let friends join trips instantly with secure validation.",
      category: "Collaboration"
    },
    {
      icon: CreditCard,
      title: "Payment Tracking",
      description: "Mark settlements as paid and track payment history. Real-time balance updates.",
      category: "Payments"
    },
    {
      icon: PieChart,
      title: "Spending Analytics",
      description: "Visual breakdown of expenses by category with percentages and progress indicators.",
      category: "Insights"
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Sharing",
      description: "Generate trip summaries with all pending payments and share directly via WhatsApp.",
      category: "Sharing"
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Only expense creators can edit their entries. Admins have full trip control.",
      category: "Security"
    },
    {
      icon: Smartphone,
      title: "Mobile-First UI",
      description: "Optimized for phones with touch-friendly controls and bottom navigation.",
      category: "Design"
    },
    {
      icon: Globe,
      title: "Real-Time Sync",
      description: "All changes sync instantly. Multiple users can add expenses simultaneously.",
      category: "Tech"
    },
    {
      icon: TrendingUp,
      title: "Trip Statistics",
      description: "View total spent, average per person, trip duration, and complete insights.",
      category: "Insights"
    }
  ];

  const expenseCategories = [
    { icon: Utensils, name: "Food", color: "bg-warning", fg: "text-warning-foreground", description: "Meals & drinks" },
    { icon: Home, name: "Stay", color: "bg-primary", fg: "text-primary-foreground", description: "Accommodation" },
    { icon: Car, name: "Travel", color: "bg-success", fg: "text-success-foreground", description: "Transport" },
    { icon: ShoppingBag, name: "Shopping", color: "bg-destructive", fg: "text-destructive-foreground", description: "Purchases" },
    { icon: Palette, name: "Activities", color: "bg-accent-foreground", fg: "text-background", description: "Fun & tours" },
    { icon: MoreHorizontal, name: "Other", color: "bg-muted", fg: "text-foreground", description: "Miscellaneous" }
  ];

  const flowSteps = [
    {
      step: 1,
      title: "Create Trip",
      description: "Set destination, dates & invite friends",
      icon: Plane,
      details: ["Name your adventure", "Set travel dates", "Add trip members"]
    },
    {
      step: 2,
      title: "Add Expenses",
      description: "Log who paid & who participated",
      icon: Receipt,
      details: ["Enter amount & category", "Select who paid", "Choose participants"]
    },
    {
      step: 3,
      title: "View Balances",
      description: "See real-time who owes whom",
      icon: TrendingUp,
      details: ["Automatic calculations", "Visual balance cards", "Per-person breakdown"]
    },
    {
      step: 4,
      title: "Settle Up",
      description: "Mark payments & share via WhatsApp",
      icon: Check,
      details: ["Minimal transactions", "Record payments", "Share summaries"]
    }
  ];

  const testimonials = [
    {
      quote: "TripSplit made our Europe trip so much easier. No more awkward money conversations!",
      author: "Priya M.",
      role: "Adventure Traveler",
      rating: 5
    },
    {
      quote: "The settlement algorithm is genius. What took hours now takes seconds.",
      author: "Rahul K.",
      role: "Trip Organizer",
      rating: 5
    },
    {
      quote: "Love adding friends who don't have the app. WhatsApp sharing is a game-changer.",
      author: "Sneha P.",
      role: "Weekend Explorer",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans overflow-x-hidden">
      {/* Sticky Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-background/95 backdrop-blur-xl border-b border-border shadow-sm" 
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Plane className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground">
                TripSplit
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#categories" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Categories
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="hidden sm:flex">
                <Link to="/auth?tab=login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="shadow-lg shadow-primary/20">
                <Link to="/auth?tab=signup">
                  Get Started
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="px-4 py-4 space-y-3">
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-muted-foreground"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-muted-foreground"
              >
                How It Works
              </a>
              <a 
                href="#categories" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-medium text-muted-foreground"
              >
                Categories
              </a>
              <div className="pt-2 border-t border-border">
                <Link 
                  to="/auth?tab=login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-sm font-medium text-foreground"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center pt-14 pb-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          {/* Gradient Base */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          
          {/* Animated Orbs */}
          <motion.div 
            className="absolute top-20 left-[10%] w-48 sm:w-72 h-48 sm:h-72 rounded-full bg-primary/10 blur-3xl"
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-32 right-[10%] w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-accent/30 blur-3xl"
            animate={{ 
              x: [0, -20, 0],
              y: [0, 30, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-success/5 blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          {/* Floating Elements */}
          <motion.div
            className="absolute top-[25%] right-[15%] hidden sm:block"
            animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 backdrop-blur-sm border border-primary/30 flex items-center justify-center">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
          </motion.div>
          <motion.div
            className="absolute bottom-[30%] left-[12%] hidden sm:block"
            animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div className="w-10 h-10 rounded-lg bg-success/20 backdrop-blur-sm border border-success/30 flex items-center justify-center">
              <Calculator className="h-5 w-5 text-success" />
            </div>
          </motion.div>
          <motion.div
            className="absolute top-[40%] left-[20%] hidden lg:block"
            animate={{ y: [0, 10, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          >
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 flex items-center justify-center">
              <Users className="h-4 w-4 text-orange-500" />
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="max-w-7xl mx-auto px-4 w-full"
          style={{ y: heroY }}
        >
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">
                Free • No Credit Card Required
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-[1.05] mb-4 sm:mb-6 tracking-[-0.02em]"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className="block">Split trip expenses</span>
              <span className="block mt-2 sm:mt-3">
                <span className="inline-flex items-baseline gap-3">
                  <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {""}
                    {""}
                    TripSplit
                  </span>
                  <span className="relative inline-block min-w-[14ch] text-left">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={heroWordIndex}
                        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                      >
                        {heroWords[heroWordIndex]}
                      </motion.span>
                    </AnimatePresence>
                    <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" />
                  </span>
                </span>
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed px-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Track shared expenses, calculate fair splits, and settle up with friends effortlessly. TripSplit handles the math.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8 sm:mb-12"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button 
                size="lg" 
                asChild 
                className="w-full sm:w-auto text-base px-6 py-5 sm:px-8 sm:py-6 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all"
              >
                <Link to="/auth?tab=signup">
                  Start Free Now
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="w-full sm:w-auto text-base px-6 py-5 sm:px-8 sm:py-6"
              >
                <a href="#how-it-works">
                  See How It Works
                </a>
              </Button>
            </motion.div>

            {/* Quick Features Preview */}
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {coreFeatures.map((feature, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center p-3 sm:p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50"
                >
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${feature.color} flex items-center justify-center mb-2`}>
                    <feature.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${feature.iconColor}`} />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-foreground text-center">
                    {feature.title}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            className="absolute bottom-6 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <a href="#how-it-works" className="flex flex-col items-center text-muted-foreground hover:text-foreground transition-colors">
              <span className="text-xs mb-1 hidden sm:block">Scroll to explore</span>
              <ChevronDown className="h-5 w-5" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works - Visual Flow */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-10 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 mb-4">
              <Play className="h-3.5 w-3.5 text-success" />
              <span className="text-xs sm:text-sm font-medium text-success">Simple 4-Step Process</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              How TripSplit Works
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
              From trip creation to final settlement in minutes
            </p>
          </motion.div>

          {/* Flow Diagram */}
          <div className="relative">
            {/* Connection Lines - Desktop */}
            <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/50 via-primary/30 to-primary/50" />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
              {flowSteps.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Mobile Arrow */}
                  {index < flowSteps.length - 1 && (
                    <div className="sm:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 z-10">
                      <ArrowDown className="h-6 w-6 text-primary/50" />
                    </div>
                  )}
                  
                  <div className="bg-card rounded-2xl border border-border p-5 sm:p-6 text-center relative group hover:shadow-lg hover:border-primary/20 transition-all">
                    {/* Step Number */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg">
                      {item.step}
                    </div>
                    
                    {/* Icon */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <item.icon className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {item.description}
                    </p>
                    
                    {/* Details */}
                    <ul className="space-y-1.5">
                      {item.details.map((detail, i) => (
                        <li key={i} className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                          <CircleDot className="h-2.5 w-2.5 text-primary" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div 
            className="text-center mt-10 sm:mt-14"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Button size="lg" asChild className="shadow-lg">
              <Link to="/auth?tab=signup">
                Try It Now — It's Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Expense Categories */}
      <section id="categories" className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20 mb-4">
              <PieChart className="h-3.5 w-3.5 text-warning" />
              <span className="text-xs sm:text-sm font-medium text-warning">Smart Categories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              Track Every Expense Type
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
              Six smart categories to organize spending and get visual insights
            </p>
          </motion.div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {expenseCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex flex-col items-center p-3 sm:p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${category.color} flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <category.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${category.fg}`} />
                </div>
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  {category.name}
                </span>
                <span className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
                  {category.description}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Features Grid */}
      <section id="features" className="py-16 sm:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary">Complete Feature Set</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              Everything You Need
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
              Powerful features for transparent and fair expense management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {allFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="h-full border-border/50 bg-card/80 hover:shadow-lg hover:border-primary/20 transition-all group">
                  <CardContent className="p-4 sm:p-5 flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-5 w-5 sm:h-5.5 sm:w-5.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm sm:text-base font-semibold text-foreground">
                          {feature.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            className="text-center mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
              <Heart className="h-3.5 w-3.5 text-destructive" />
              <span className="text-xs sm:text-sm font-medium text-destructive">Loved by Travelers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              What Users Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full border-border/50 bg-card">
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground mb-4 leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {testimonial.author}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-24 bg-primary/5">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to Simplify Your Next Trip?
            </h2>
            <p className="text-muted-foreground mb-6 sm:mb-8 text-sm sm:text-base">
              Join thousands of travelers who've said goodbye to expense confusion. Free forever.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" asChild className="w-full sm:w-auto px-8 shadow-xl shadow-primary/25">
                <Link to="/auth?tab=signup">
                  Create Free Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto px-8">
                <Link to="/auth?tab=login">
                  Sign In
                </Link>
              </Button>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 text-xs sm:text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Shield className="h-4 w-4 text-success" />
                Secure & Private
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-primary" />
                100% Free
              </span>
              <span className="flex items-center gap-1.5">
                <Smartphone className="h-4 w-4 text-warning" />
                Mobile Friendly
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-10 bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Plane className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-foreground">TripSplit</span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} TripSplit. Developed by Prince Ramoliya ❤️ for travelers everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

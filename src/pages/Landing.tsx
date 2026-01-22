import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
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
  Share2,
  CreditCard,
  PieChart,
  UserPlus,
  QrCode,
  History,
  Zap,
  Heart,
  Star,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.9]);

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
      title: "Trip Creation & Management",
      description:
        "Create trips with custom names, destinations, and travel dates. Edit or delete trips anytime. Full lifecycle management for every adventure.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Receipt,
      title: "Smart Expense Tracking",
      description:
        "Log expenses across 6 categories: Food, Stay, Travel, Shopping, Activities, and Other. Assign payers and split costs among selected participants with precision.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Calculator,
      title: "Intelligent Settlement Engine",
      description:
        "Our algorithm calculates the minimum number of transactions needed to settle all debts. No more complex mental math or spreadsheets.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Users,
      title: "Flexible Member Management",
      description:
        "Add registered users or manual members who don't have accounts. Perfect for mixed groups where not everyone uses the app.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: QrCode,
      title: "Secure Invite System",
      description:
        "Share unique invite codes to let friends join your trip instantly. Validated through secure backend functions for data privacy.",
      gradient: "from-indigo-500 to-violet-500",
    },
    {
      icon: CreditCard,
      title: "Payment Recording & History",
      description:
        "Mark settlements as paid and track all payment history. Delete records if needed. Real-time balance updates after every transaction.",
      gradient: "from-teal-500 to-cyan-500",
    },
    {
      icon: PieChart,
      title: "Spending Analytics",
      description:
        "Visual breakdown of expenses by category with percentages and progress bars. See where your money goes at a glance.",
      gradient: "from-rose-500 to-pink-500",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Integration",
      description:
        "Generate beautiful trip summaries with all pending payments and share directly via WhatsApp. Keep everyone informed effortlessly.",
      gradient: "from-green-500 to-lime-500",
    },
    {
      icon: Shield,
      title: "Role-Based Permissions",
      description:
        "Only expense creators can edit or delete their entries. Trip admins have full control over trip settings and members.",
      gradient: "from-slate-500 to-gray-500",
    },
    {
      icon: Smartphone,
      title: "Mobile-First Design",
      description:
        "Optimized for phones with responsive layouts, touch-friendly controls, and bottom navigation. Use it anywhere, anytime.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: Globe,
      title: "Real-Time Synchronization",
      description:
        "All changes sync instantly across devices. Multiple users can add expenses simultaneously without conflicts.",
      gradient: "from-blue-500 to-indigo-500",
    },
    {
      icon: TrendingUp,
      title: "Trip Statistics",
      description:
        "View total spent, average per person, trip duration, and destination info. Get complete financial insights for your journey.",
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Create Your Trip",
      description:
        "Set up a new trip with destination, dates, and invite your travel companions. Add members who'll share expenses.",
      icon: Plane,
    },
    {
      step: "02",
      title: "Log Expenses",
      description:
        "When someone pays for dinner, activities, or accommodation, add the expense with amount, category, and who participated.",
      icon: Receipt,
    },
    {
      step: "03",
      title: "Track Balances",
      description:
        "Watch as the app calculates who owes whom in real-time. Visual balance cards show positive and negative amounts.",
      icon: Calculator,
    },
    {
      step: "04",
      title: "Settle Up",
      description:
        "Get smart settlement suggestions that minimize transactions. Mark payments as complete and share summaries via WhatsApp.",
      icon: Check,
    },
  ];

  const testimonials = [
    {
      quote:
        "TripSplit made our Europe backpacking trip so much easier. No more awkward money conversations!",
      author: "Priya M.",
      role: "Adventure Traveler",
      avatar: "🌍",
    },
    {
      quote:
        "The settlement algorithm is genius. What used to take us hours to figure out now takes seconds.",
      author: "Rahul K.",
      role: "Group Trip Organizer",
      avatar: "✈️",
    },
    {
      quote:
        "Love how I can add friends who don't have the app. The WhatsApp sharing is a game-changer.",
      author: "Sneha P.",
      role: "Weekend Getaway Enthusiast",
      avatar: "🏖️",
    },
  ];

  const stats = [
    { value: "10K+", label: "Trips Created" },
    { value: "₹5Cr+", label: "Expenses Tracked" },
    { value: "50K+", label: "Settlements Made" },
    { value: "4.9★", label: "User Rating" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
        style={{ opacity }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                <Plane className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-foreground">
                TripSplit
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3">
              <Button
                variant="ghost"
                asChild
                className="text-sm sm:text-base font-medium"
              >
                <Link to="/auth?tab=login">Sign In</Link>
              </Button>
              <Button asChild className="text-sm sm:text-base shadow-lg">
                <Link to="/auth?tab=signup">
                  Sign Up
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-accent-foreground/10 mb-6 sm:mb-8"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">
                Simplify Group Travel Expenses
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6 sm:mb-8">
              Split Trip Expenses
              <span className="block bg-gradient-to-r from-primary via-primary to-accent-foreground bg-clip-text text-transparent">
                Without the Drama
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Track expenses, calculate fair splits, and settle up with friends
              effortlessly. TripSplit handles the math so you can focus on
              making memories.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all"
              >
                <Link to="/auth?tab=signup">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="w-full sm:w-auto text-base sm:text-lg px-8 py-6"
              >
                <a href="#features">
                  Explore Features
                  <ChevronRight className="ml-1 h-5 w-5" />
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mt-16 sm:mt-24 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4 sm:p-6 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Powerful Features
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Everything You Need for
              <span className="block text-primary">Group Expense Management</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              From trip creation to final settlement, TripSplit provides all the
              tools to manage shared expenses transparently and fairly.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
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
                <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-1">
                  <CardContent className="p-6 sm:p-8">
                    <div
                      className={`inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg mb-5 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <feature.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
              <Clock className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">
                Simple Process
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              How TripSplit Works
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to stress-free expense sharing. Get started in
              under a minute.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="text-center">
                  <div className="relative inline-flex mb-6">
                    <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-primary/10 border-2 border-primary/20">
                      <item.icon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-3">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 sm:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              Track Every Type of Expense
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Six smart categories to organize your trip spending and get visual
              insights.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
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
                className="group"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} text-white text-2xl sm:text-3xl shadow-lg mb-4 group-hover:rotate-6 transition-transform`}
                    >
                      {category.emoji}
                    </div>
                    <h3 className="font-semibold text-foreground">
                      {category.name}
                    </h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20 mb-6">
              <Heart className="h-4 w-4 text-warning" />
              <span className="text-sm font-medium text-warning">
                Loved by Travelers
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 sm:mb-6">
              What Our Users Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full border-border/50 bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-5 w-5 fill-warning text-warning"
                        />
                      ))}
                    </div>
                    <p className="text-foreground leading-relaxed mb-6 text-lg">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-2xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-muted-foreground">
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

      {/* Key Benefits */}
      <section className="py-20 sm:py-32 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                Why Choose TripSplit?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We've thought about every detail to make group expense management
                as seamless as possible. No more spreadsheets, no more awkward
                conversations about money.
              </p>
              <div className="space-y-4">
                {[
                  "Instant calculations with smart settlement algorithms",
                  "Works offline — sync when you're back online",
                  "No registration required for guest members",
                  "Share summaries instantly via WhatsApp",
                  "Role-based access for security and privacy",
                  "Beautiful mobile-first interface",
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-success text-success-foreground">
                      <Check className="h-4 w-4" />
                    </div>
                    <span className="text-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative z-10 grid grid-cols-2 gap-4 sm:gap-6">
                <Card className="border-border/50 bg-card shadow-xl">
                  <CardContent className="p-6 text-center">
                    <Share2 className="h-10 w-10 text-primary mx-auto mb-4" />
                    <h4 className="font-semibold text-foreground mb-2">
                      Easy Sharing
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Invite with a simple code
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-card shadow-xl mt-8">
                  <CardContent className="p-6 text-center">
                    <UserPlus className="h-10 w-10 text-success mx-auto mb-4" />
                    <h4 className="font-semibold text-foreground mb-2">
                      Guest Members
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      No app needed for everyone
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-card shadow-xl">
                  <CardContent className="p-6 text-center">
                    <History className="h-10 w-10 text-warning mx-auto mb-4" />
                    <h4 className="font-semibold text-foreground mb-2">
                      Payment History
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Track every settlement
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-border/50 bg-card shadow-xl mt-8">
                  <CardContent className="p-6 text-center">
                    <PieChart className="h-10 w-10 text-destructive mx-auto mb-4" />
                    <h4 className="font-semibold text-foreground mb-2">
                      Visual Analytics
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      See spending breakdown
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="relative rounded-3xl bg-gradient-to-br from-primary via-primary to-accent-foreground p-8 sm:p-12 lg:p-16 text-center overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLThoLTJ2LTRoMnY0em0tOCA4aC0ydi00aDJ2NHptMC04aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-4 sm:mb-6">
                Ready to Simplify Your Trip Expenses?
              </h2>
              <p className="text-lg sm:text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
                Join thousands of travelers who've said goodbye to expense
                spreadsheets and awkward money conversations.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 bg-white text-primary hover:bg-white/90 shadow-xl"
                >
                  <Link to="/auth?tab=signup">
                    Create Free Account
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to="/auth?tab=login">
                    Sign In
                    <ChevronRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 sm:py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Plane className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-foreground">TripSplit</span>
            </div>
            <p className="text-muted-foreground text-center">
              © {new Date().getFullYear()} TripSplit. Made with ❤️ for travelers
              everywhere.
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth?tab=login">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/auth?tab=signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

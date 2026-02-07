import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Plane, Users, Receipt, Calculator, MessageCircle, Shield,
  Smartphone, Globe, ChevronRight, Check, ArrowRight, Sparkles,
  TrendingUp, Clock, Share2, CreditCard, PieChart, UserPlus,
  QrCode, History, Zap, Heart, Star, ArrowDown, Menu, X,
} from "lucide-react";

/* ─── Reveal wrapper ─── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Data ─── */
const features = [
  { icon: Plane, title: "Trip Management", desc: "Create, edit & manage every adventure with full lifecycle control.", gradient: "from-blue-500 to-cyan-500", span: "md:col-span-2 lg:col-span-1" },
  { icon: Receipt, title: "Smart Expenses", desc: "6 categories with precise participant-based splitting.", gradient: "from-purple-500 to-pink-500", span: "" },
  { icon: Calculator, title: "Settlement Engine", desc: "Minimum transactions algorithm to settle all debts instantly.", gradient: "from-orange-500 to-red-500", span: "" },
  { icon: Users, title: "Flexible Members", desc: "Registered users or guests — everyone fits in.", gradient: "from-green-500 to-emerald-500", span: "md:col-span-2 lg:col-span-1" },
  { icon: QrCode, title: "Invite System", desc: "Unique codes for instant, secure trip joining.", gradient: "from-indigo-500 to-violet-500", span: "" },
  { icon: CreditCard, title: "Payment Tracking", desc: "Record settlements with real-time balance updates.", gradient: "from-teal-500 to-cyan-500", span: "" },
  { icon: PieChart, title: "Visual Analytics", desc: "Category breakdowns with progress bars at a glance.", gradient: "from-rose-500 to-pink-500", span: "" },
  { icon: MessageCircle, title: "WhatsApp Share", desc: "Generate & share beautiful trip summaries instantly.", gradient: "from-green-500 to-lime-500", span: "" },
  { icon: Shield, title: "Role Permissions", desc: "Admins control trips, creators own their expenses.", gradient: "from-slate-500 to-gray-600", span: "md:col-span-2 lg:col-span-1" },
  { icon: Smartphone, title: "Mobile-First", desc: "Touch-friendly, responsive everywhere you go.", gradient: "from-amber-500 to-orange-500", span: "" },
  { icon: Globe, title: "Real-Time Sync", desc: "Instant updates across all devices, no conflicts.", gradient: "from-blue-500 to-indigo-500", span: "" },
  { icon: TrendingUp, title: "Trip Stats", desc: "Total spend, averages, duration & destination insights.", gradient: "from-violet-500 to-purple-500", span: "" },
];

const steps = [
  { num: "01", title: "Create Trip", desc: "Set destination, dates & invite companions.", icon: Plane, emoji: "✈️" },
  { num: "02", title: "Log Expenses", desc: "Add amounts, categories & participants.", icon: Receipt, emoji: "📝" },
  { num: "03", title: "Track Balances", desc: "See who owes whom in real-time.", icon: Calculator, emoji: "📊" },
  { num: "04", title: "Settle Up", desc: "Minimal transactions. Share via WhatsApp.", icon: Check, emoji: "🤝" },
];

const testimonials = [
  { quote: "TripSplit made our Europe trip so much easier. No more awkward money conversations!", author: "Priya M.", role: "Adventure Traveler", avatar: "🌍" },
  { quote: "The settlement algorithm is genius. What took hours now takes seconds.", author: "Rahul K.", role: "Group Trip Organizer", avatar: "✈️" },
  { quote: "Love how I can add friends without the app. WhatsApp sharing is a game-changer.", author: "Sneha P.", role: "Weekend Getaway Enthusiast", avatar: "🏖️" },
];

const stats = [
  { value: "10K+", label: "Trips Created", icon: Plane },
  { value: "₹5Cr+", label: "Tracked", icon: TrendingUp },
  { value: "50K+", label: "Settlements", icon: CreditCard },
  { value: "4.9★", label: "Rating", icon: Star },
];

const benefits = [
  "Instant smart settlement calculations",
  "Offline-ready — sync when back online",
  "No registration needed for guests",
  "One-tap WhatsApp summaries",
  "Role-based access & security",
  "Beautiful mobile-first design",
];

const categories = [
  { name: "Food", emoji: "🍽️", color: "from-orange-500 to-amber-500" },
  { name: "Stay", emoji: "🏨", color: "from-blue-500 to-cyan-500" },
  { name: "Travel", emoji: "🚗", color: "from-green-500 to-emerald-500" },
  { name: "Shopping", emoji: "🛍️", color: "from-pink-500 to-rose-500" },
  { name: "Activities", emoji: "🎯", color: "from-purple-500 to-violet-500" },
  { name: "Other", emoji: "📦", color: "from-gray-500 to-slate-500" },
];

/* ─── Landing ─── */
export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -60]);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ─── Navbar ─── */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/85 backdrop-blur-xl border-b border-border shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14 sm:h-16 md:h-20">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              <Plane className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-foreground">TripSplit</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild className="font-medium">
              <Link to="/auth?tab=login">Sign In</Link>
            </Button>
            <Button size="sm" asChild className="shadow-lg">
              <Link to="/auth?tab=signup">Get Started <ChevronRight className="ml-1 h-3.5 w-3.5" /></Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="sm:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="sm:hidden bg-background border-b border-border px-4 pb-4 space-y-2"
          >
            <Button variant="ghost" asChild className="w-full justify-center" onClick={() => setMobileMenuOpen(false)}>
              <Link to="/auth?tab=login">Sign In</Link>
            </Button>
            <Button asChild className="w-full" onClick={() => setMobileMenuOpen(false)}>
              <Link to="/auth?tab=signup">Get Started Free</Link>
            </Button>
          </motion.div>
        )}
      </header>

      {/* ─── Hero ─── */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden px-4 sm:px-6 lg:px-8 pt-16">
        {/* Animated background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-[5%] -left-[10%] w-[60vw] h-[60vw] max-w-[500px] max-h-[500px] rounded-full bg-primary/8 blur-[80px] sm:blur-[120px]" />
          <div className="absolute bottom-[5%] -right-[10%] w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full bg-accent/12 blur-[80px] sm:blur-[120px]" />
          <div className="absolute top-[35%] left-1/2 -translate-x-1/2 w-[80vw] h-[40vw] max-w-[800px] max-h-[400px] rounded-full bg-primary/4 blur-[80px]" />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }} />
        </div>

        <motion.div style={{ y: heroY }} className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-5 sm:mb-6"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
              <span className="text-xs sm:text-sm font-semibold text-primary">Simplify Group Expenses</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="text-[2rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight mb-4 sm:mb-6 max-w-4xl"
            >
              Split Expenses,{" "}
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                Not Friendships
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-md sm:max-w-lg md:max-w-xl leading-relaxed mb-7 sm:mb-9"
            >
              Track expenses, calculate fair splits, and settle up effortlessly.
              TripSplit handles the math — you make the memories.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-8 sm:mb-10"
            >
              <Button size="lg" asChild className="w-full sm:w-auto text-base px-7 py-5 sm:py-6 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all rounded-xl">
                <Link to="/auth?tab=signup">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-base px-7 py-5 sm:py-6 rounded-xl">
                <a href="#features">
                  Explore Features <ChevronRight className="ml-1 h-4 w-4 sm:h-5 sm:w-5" />
                </a>
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="flex items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-muted-foreground mb-10 sm:mb-14"
            >
              <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-success" /> Free Forever</span>
              <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-primary" /> No Ads</span>
              <span className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-warning" /> Secure</span>
            </motion.div>

            {/* Stats — Horizontal scroll on mobile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="w-full max-w-2xl"
            >
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.65 + i * 0.08 }}
                    className="rounded-xl sm:rounded-2xl border border-border bg-card/70 backdrop-blur-sm p-3 sm:p-5 text-center"
                  >
                    <div className="text-lg sm:text-2xl md:text-3xl font-extrabold text-foreground">{s.value}</div>
                    <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground font-medium mt-0.5">{s.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground/60" />
        </motion.div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-10 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                <span className="text-xs sm:text-sm font-semibold text-primary">Powerful Features</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                Everything for <span className="text-primary">Group Expenses</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md sm:max-w-xl mx-auto">
                From trip creation to final settlement — transparent, fair, effortless.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.04} className={f.span}>
                <div className="h-full rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-5 sm:p-6 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-400 group">
                  <div className="flex items-start gap-4">
                    <div className={`shrink-0 h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br ${f.gradient} text-white shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <f.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-foreground mb-1">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-10 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-success/10 border border-success/20 mb-4 sm:mb-6">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
                <span className="text-xs sm:text-sm font-semibold text-success">Simple Process</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                How TripSplit Works
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md sm:max-w-xl mx-auto">
                Four steps to stress-free expense sharing. Start in under a minute.
              </p>
            </div>
          </Reveal>

          {/* Mobile: vertical cards. Desktop: horizontal timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
            {/* Connecting line — desktop only */}
            <div className="hidden lg:block absolute top-[56px] left-[14%] right-[14%] h-[2px] bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="relative bg-card rounded-2xl border border-border p-5 sm:p-6 text-center hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  {/* Step number pill */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-7 px-3 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md ring-4 ring-background">
                    Step {s.num}
                  </div>

                  <div className="mt-3 mb-3 text-4xl">{s.emoji}</div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
                Track Every Expense Type
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-md sm:max-w-xl mx-auto">
                Six smart categories to organize your spending.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((c, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -3 }}
                  transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  className="group cursor-default"
                >
                  <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-4 sm:p-5 text-center hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                    <div className={`inline-flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-gradient-to-br ${c.color} text-white text-xl sm:text-2xl shadow-lg mb-2 sm:mb-3 group-hover:rotate-6 transition-transform`}>
                      {c.emoji}
                    </div>
                    <h3 className="font-bold text-foreground text-xs sm:text-sm">{c.name}</h3>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why Choose ─── */}
      <section className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left */}
            <Reveal>
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6">
                  Why Choose TripSplit?
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-6 sm:mb-8 leading-relaxed">
                  Every detail designed for seamless group expense management.
                </p>
                <div className="space-y-3">
                  {benefits.map((b, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.07 }}
                      className="flex items-center gap-3"
                    >
                      <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-success text-success-foreground flex items-center justify-center shrink-0">
                        <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                      </div>
                      <span className="text-sm sm:text-base text-foreground font-medium">{b}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Right — Mosaic cards */}
            <Reveal delay={0.15}>
              <div className="relative">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    { icon: Share2, title: "Easy Sharing", desc: "Invite with a code", color: "text-primary" },
                    { icon: UserPlus, title: "Guest Members", desc: "No app needed", color: "text-success" },
                    { icon: History, title: "Payment History", desc: "Track settlements", color: "text-warning" },
                    { icon: PieChart, title: "Analytics", desc: "Spending breakdown", color: "text-destructive" },
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08 }}
                      className={i % 2 === 1 ? "mt-6 sm:mt-8" : ""}
                    >
                      <div className="rounded-2xl border border-border bg-card shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-5 text-center">
                        <card.icon className={`h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 sm:mb-3 ${card.color}`} />
                        <h4 className="font-bold text-foreground text-sm sm:text-base mb-0.5">{card.title}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">{card.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-primary/8 via-transparent to-accent/8 rounded-3xl blur-2xl" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="text-center mb-10 sm:mb-14">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-warning/10 border border-warning/20 mb-4 sm:mb-6">
                <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-warning" />
                <span className="text-xs sm:text-sm font-semibold text-warning">Loved by Travelers</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
                What Our Users Say
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="h-full rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 sm:p-7 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex gap-0.5 mb-3 sm:mb-4">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed mb-5 text-sm sm:text-base">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-lg sm:text-xl">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-foreground text-sm">{t.author}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-14 sm:py-20 md:py-28 px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-7 sm:p-10 md:p-14 lg:p-16 text-center overflow-hidden">
              {/* Pattern */}
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                backgroundSize: "20px 20px",
              }} />
              <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-white/10 rounded-full blur-[80px]" />

              <div className="relative z-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-3 sm:mb-5">
                  Ready to Simplify Your Trip?
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-primary-foreground/85 max-w-md sm:max-w-xl mx-auto mb-6 sm:mb-8">
                  Join thousands of travelers who've ditched the spreadsheets.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-6 sm:px-8 py-5 sm:py-6 bg-white text-primary hover:bg-white/90 shadow-xl font-bold rounded-xl">
                    <Link to="/auth?tab=signup">
                      Create Free Account <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-sm sm:text-base md:text-lg px-6 sm:px-8 py-5 sm:py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-xl">
                    <Link to="/auth?tab=login">
                      Sign In <ChevronRight className="ml-1 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ─── Footer ─── */}
      <footer className="py-8 sm:py-12 md:py-16 border-t border-border px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center gap-4 sm:gap-6 md:flex-row md:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <Plane className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground">TripSplit</span>
            </div>
            <p className="text-muted-foreground text-center text-xs sm:text-sm">
              © {new Date().getFullYear()} TripSplit. Developed by Prince Ramoliya ❤️ for travelers everywhere.
            </p>
            <div className="flex items-center gap-2">
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

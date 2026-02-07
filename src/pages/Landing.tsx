import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plane, Users, Receipt, Calculator, MessageCircle, Shield,
  Smartphone, Globe, ChevronRight, Check, ArrowRight, Sparkles,
  TrendingUp, Clock, Share2, CreditCard, PieChart, UserPlus,
  QrCode, History, Zap, Heart, Star, ArrowDown,
} from "lucide-react";

/* ─── Data ─── */
const features = [
  { icon: Plane, title: "Trip Management", desc: "Create, edit & manage every adventure.", gradient: "from-blue-500 to-cyan-500" },
  { icon: Receipt, title: "Smart Expenses", desc: "6 categories. Precise splits.", gradient: "from-purple-500 to-pink-500" },
  { icon: Calculator, title: "Settlement Engine", desc: "Minimum transactions to settle.", gradient: "from-orange-500 to-red-500" },
  { icon: Users, title: "Flexible Members", desc: "Registered or guest — everyone fits.", gradient: "from-green-500 to-emerald-500" },
  { icon: QrCode, title: "Invite System", desc: "Share codes, join instantly.", gradient: "from-indigo-500 to-violet-500" },
  { icon: CreditCard, title: "Payment Tracking", desc: "Record, track & settle in real-time.", gradient: "from-teal-500 to-cyan-500" },
  { icon: PieChart, title: "Visual Analytics", desc: "Category breakdown at a glance.", gradient: "from-rose-500 to-pink-500" },
  { icon: MessageCircle, title: "WhatsApp Share", desc: "Send summaries with one tap.", gradient: "from-green-500 to-lime-500" },
  { icon: Shield, title: "Role Permissions", desc: "Admins control, creators own.", gradient: "from-slate-500 to-gray-500" },
  { icon: Smartphone, title: "Mobile-First", desc: "Touch-friendly, everywhere.", gradient: "from-amber-500 to-orange-500" },
  { icon: Globe, title: "Real-Time Sync", desc: "Instant updates across devices.", gradient: "from-blue-500 to-indigo-500" },
  { icon: TrendingUp, title: "Trip Stats", desc: "Total spend, averages & more.", gradient: "from-violet-500 to-purple-500" },
];

const steps = [
  { num: "01", title: "Create Trip", desc: "Set destination, dates & invite friends.", icon: Plane },
  { num: "02", title: "Log Expenses", desc: "Add amounts, categories & participants.", icon: Receipt },
  { num: "03", title: "Track Balances", desc: "See who owes whom in real-time.", icon: Calculator },
  { num: "04", title: "Settle Up", desc: "Minimal transactions. Share via WhatsApp.", icon: Check },
];

const testimonials = [
  { quote: "TripSplit made our Europe trip so much easier. No more awkward money conversations!", author: "Priya M.", role: "Adventure Traveler", avatar: "🌍" },
  { quote: "The settlement algorithm is genius. What took hours now takes seconds.", author: "Rahul K.", role: "Group Trip Organizer", avatar: "✈️" },
  { quote: "Love how I can add friends without the app. WhatsApp sharing is a game-changer.", author: "Sneha P.", role: "Weekend Getaway Enthusiast", avatar: "🏖️" },
];

const stats = [
  { value: "10K+", label: "Trips Created" },
  { value: "₹5Cr+", label: "Expenses Tracked" },
  { value: "50K+", label: "Settlements" },
  { value: "4.9★", label: "User Rating" },
];

const benefits = [
  "Instant calculations with smart algorithms",
  "Works offline — sync when back online",
  "No registration required for guests",
  "Share summaries via WhatsApp",
  "Role-based access & security",
  "Beautiful mobile-first interface",
];

const categories = [
  { name: "Food", emoji: "🍽️", color: "from-orange-500 to-amber-500" },
  { name: "Stay", emoji: "🏨", color: "from-blue-500 to-cyan-500" },
  { name: "Travel", emoji: "🚗", color: "from-green-500 to-emerald-500" },
  { name: "Shopping", emoji: "🛍️", color: "from-pink-500 to-rose-500" },
  { name: "Activities", emoji: "🎯", color: "from-purple-500 to-violet-500" },
  { name: "Other", emoji: "📦", color: "from-gray-500 to-slate-500" },
];

/* ─── Animated Section Wrapper ─── */
function Section({ children, className = "", id }: { children: React.ReactNode; className?: string; id?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      id={id}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

/* ─── Main Component ─── */
export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ─── Navbar ─── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
              <Plane className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-foreground">TripSplit</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" asChild className="font-medium">
              <Link to="/auth?tab=login">Sign In</Link>
            </Button>
            <Button asChild className="shadow-lg">
              <Link to="/auth?tab=signup">
                Sign Up <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Hero ─── */}
      <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
        {/* Animated background mesh */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[10%] left-[5%] w-[500px] h-[500px] rounded-full bg-primary/8 blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] rounded-full bg-accent/15 blur-[120px]" />
          <div className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[900px] h-[400px] rounded-full bg-primary/5 blur-[100px]" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-8 items-center">
            {/* Left — Copy */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Simplify Group Expenses</span>
              </motion.div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-extrabold text-foreground leading-[1.08] tracking-tight mb-6">
                Split Expenses,{" "}
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Not Friendships
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed mb-8">
                Track expenses, calculate fair splits, and settle up with friends effortlessly. 
                TripSplit handles the math so you can focus on making memories.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10">
                <Button size="lg" asChild className="text-base sm:text-lg px-8 py-6 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all">
                  <Link to="/auth?tab=signup">
                    Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base sm:text-lg px-8 py-6">
                  <a href="#features">
                    Explore Features <ChevronRight className="ml-1 h-5 w-5" />
                  </a>
                </Button>
              </div>

              {/* Trust badges */}
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-success" /> 100% Free</span>
                <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-primary" /> No Ads</span>
                <span className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-warning" /> Open Source</span>
              </div>
            </motion.div>

            {/* Right — Bento Stats Grid */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className={`rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-8 text-center ${
                      i === 0 ? "col-span-2" : ""
                    }`}
                  >
                    <div className={`font-extrabold text-foreground mb-1 ${i === 0 ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl"}`}>
                      {stat.value}
                    </div>
                    <div className="text-sm sm:text-base text-muted-foreground font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
              {/* Decorative glow */}
              <div className="absolute -inset-4 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl blur-2xl" />
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ArrowDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </section>

      {/* ─── Features Bento Grid ─── */}
      <Section id="features" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Powerful Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Everything for{" "}
              <span className="text-primary">Group Expenses</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              From trip creation to final settlement — transparent, fair, effortless.
            </p>
          </div>

          {/* Bento-style feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className={`group ${i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}
              >
                <div className="h-full rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-6 sm:p-7 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-500 hover:-translate-y-1">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.gradient} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── How It Works — Horizontal Timeline ─── */}
      <Section className="py-20 sm:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 mb-6">
              <Clock className="h-4 w-4 text-success" />
              <span className="text-sm font-semibold text-success">Simple Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              How TripSplit Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Four steps to stress-free expense sharing. Start in under a minute.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[52px] left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6">
              {steps.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                  className="text-center relative"
                >
                  <div className="relative inline-flex mb-6">
                    <div className="h-20 w-20 rounded-2xl bg-card border-2 border-primary/20 flex items-center justify-center shadow-lg">
                      <s.icon className="h-9 w-9 text-primary" />
                    </div>
                    <span className="absolute -top-2.5 -right-2.5 h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-lg ring-4 ring-background">
                      {s.num}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-[240px] mx-auto">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Categories — Pill Strip ─── */}
      <Section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
              Track Every Expense Type
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Six smart categories to organize your spending.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((c, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.06, y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                className="group"
              >
                <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-5 sm:p-6 text-center hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${c.color} text-white text-2xl shadow-lg mb-3 group-hover:rotate-6 transition-transform`}>
                    {c.emoji}
                  </div>
                  <h3 className="font-bold text-foreground">{c.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Why Choose — Split Layout ─── */}
      <Section className="py-20 sm:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left — Text */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                Why Choose TripSplit?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We've thought about every detail to make group expense management as seamless as possible.
              </p>
              <div className="space-y-3.5">
                {benefits.map((b, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-3"
                  >
                    <div className="h-6 w-6 rounded-full bg-success text-success-foreground flex items-center justify-center shrink-0">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-foreground font-medium">{b}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right — Feature Cards Mosaic */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Share2, title: "Easy Sharing", desc: "Invite with a simple code", color: "text-primary" },
                  { icon: UserPlus, title: "Guest Members", desc: "No app needed for everyone", color: "text-success" },
                  { icon: History, title: "Payment History", desc: "Track every settlement", color: "text-warning" },
                  { icon: PieChart, title: "Visual Analytics", desc: "See spending breakdown", color: "text-destructive" },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={i % 2 === 1 ? "mt-8" : ""}
                  >
                    <Card className="border-border bg-card shadow-xl hover:shadow-2xl transition-shadow duration-300">
                      <CardContent className="p-6 text-center">
                        <card.icon className={`h-10 w-10 mx-auto mb-3 ${card.color}`} />
                        <h4 className="font-bold text-foreground mb-1">{card.title}</h4>
                        <p className="text-sm text-muted-foreground">{card.desc}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <div className="absolute -inset-6 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-3xl blur-2xl" />
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Testimonials ─── */}
      <Section className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/20 mb-6">
              <Heart className="h-4 w-4 text-warning" />
              <span className="text-sm font-semibold text-warning">Loved by Travelers</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground">
              What Our Users Say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Card className="h-full border-border bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 sm:p-8">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-foreground leading-relaxed mb-6 text-base sm:text-lg">
                      "{t.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center text-xl">
                        {t.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-foreground text-sm">{t.author}</div>
                        <div className="text-xs text-muted-foreground">{t.role}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── CTA ─── */}
      <Section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[2rem] bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-10 sm:p-14 lg:p-20 text-center overflow-hidden">
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "24px 24px",
            }} />
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/10 rounded-full blur-[100px]" />

            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-5">
                Ready to Simplify Your Trip?
              </h2>
              <p className="text-lg sm:text-xl text-primary-foreground/85 max-w-xl mx-auto mb-8">
                Join thousands of travelers who've said goodbye to expense spreadsheets.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 bg-white text-primary hover:bg-white/90 shadow-xl font-bold">
                  <Link to="/auth?tab=signup">
                    Create Free Account <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-base sm:text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/auth?tab=login">
                    Sign In <ChevronRight className="ml-1 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* ─── Footer ─── */}
      <footer className="py-12 sm:py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <Plane className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-foreground">TripSplit</span>
            </div>
            <p className="text-muted-foreground text-center text-sm">
              © {new Date().getFullYear()} TripSplit. Developed by Prince Ramoliya ❤️ for travelers everywhere.
            </p>
            <div className="flex items-center gap-3">
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

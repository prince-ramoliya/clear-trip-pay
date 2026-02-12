import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Plane, Users, Receipt, Calculator, Shield, Check,
  ArrowRight, Sparkles, CreditCard, PieChart, ArrowDown,
  Zap, MessageCircle, Globe, Share2, UserPlus, Smartphone,
  Clock, TrendingUp, Eye, Split, BadgeCheck, HandCoins,
  X as XIcon, QrCode, History, ChevronDown } from
"lucide-react";

/* ─── Animated counter ─── */
function Counter({ target, suffix = "" }: {target: number;suffix?: string;}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const dur = 1800;
    const inc = target / (dur / 16);
    const t = setInterval(() => {
      start += inc;
      if (start >= target) {setCount(target);clearInterval(t);} else
      setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(t);
  }, [inView, target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Reveal ─── */
function Reveal({ children, className = "", delay = 0 }: {children: React.ReactNode;className?: string;delay?: number;}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 36 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }} className={className}>
      {children}
    </motion.div>);

}

/* ─── Word reveal ─── */
function WordReveal({ text, className = "", delay = 0 }: {text: string;className?: string;delay?: number;}) {
  return (
    <span className={className}>
      {text.split(" ").map((word, i) =>
      <motion.span key={i} initial={{ opacity: 0, y: 24, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: 0.45, delay: delay + i * 0.07, ease: [0.16, 1, 0.3, 1] }} className="inline-block mr-[0.28em]">
          {word}
        </motion.span>
      )}
    </span>);

}

/* ─── Floating Orb ─── */
function FloatingOrb({ size, x, y, color, duration, delayStart = 0 }: {size: number;x: string;y: string;color: string;duration: number;delayStart?: number;}) {
  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{ width: size, height: size, left: x, top: y, background: color }}
      animate={{
        x: [0, 30, -20, 15, 0],
        y: [0, -25, 15, -10, 0],
        scale: [1, 1.15, 0.9, 1.1, 1],
        opacity: [0.4, 0.7, 0.5, 0.65, 0.4]
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay: delayStart }} />);


}

/* ─── Morphing blob ─── */
function MorphBlob({ className, color, duration }: {className: string;color: string;duration: number;}) {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={{ background: color }}
      animate={{
        borderRadius: [
        "40% 60% 70% 30% / 40% 50% 60% 50%",
        "70% 30% 50% 50% / 30% 30% 70% 70%",
        "50% 60% 30% 60% / 60% 40% 60% 40%",
        "40% 60% 70% 30% / 40% 50% 60% 50%"],

        scale: [1, 1.08, 0.95, 1]
      }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }} />);


}

/* ─── Particle ─── */
function Particle({ delay, x, y }: {delay: number;x: string;y: string;}) {
  return (
    <motion.div
      className="absolute w-1 h-1 rounded-full pointer-events-none"
      style={{ left: x, top: y, background: "hsl(var(--primary) / 0.4)" }}
      animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0], y: [0, -40, -80] }}
      transition={{ duration: 3, repeat: Infinity, delay, ease: "easeOut" }} />);


}

/* ═══ DATA ═══ */
const problems = [
"Awkward 'you owe me' conversations after every meal",
"Messy spreadsheets that nobody updates properly",
"Unfair splits causing resentment between friends",
"Lost receipts and forgotten who paid what",
"Hours wasted calculating who owes whom"];


const solutions = [
"Auto-calculated fair splits — zero manual math",
"Real-time expense tracking everyone can see",
"Smart settlement with minimum transactions",
"WhatsApp sharing for instant group updates",
"Works for guests too — no account needed"];


const whyReasons = [
{ icon: Clock, title: "Save Hours", desc: "Stop calculating manually. Our algorithm does it in seconds.", accent: "bg-primary/10 text-primary" },
{ icon: HandCoins, title: "Fair Splits", desc: "Choose who's in each expense. Only pay your actual share.", accent: "bg-success/10 text-success" },
{ icon: Eye, title: "Full Transparency", desc: "Everyone sees every expense. No hidden costs or surprises.", accent: "bg-warning/10 text-warning" },
{ icon: Users, title: "No Friction", desc: "Invite via link. Friends join without creating an account.", accent: "bg-primary/10 text-primary" },
{ icon: Shield, title: "Private & Secure", desc: "Your financial data stays protected with role-based access.", accent: "bg-destructive/10 text-destructive" },
{ icon: Smartphone, title: "Mobile First", desc: "Designed for phones. Track expenses on the go, anytime.", accent: "bg-success/10 text-success" }];


const features = [
{ icon: Plane, title: "Trip Management", desc: "Create trips with dates, destinations & invite companions instantly." },
{ icon: Receipt, title: "Smart Expenses", desc: "6 categories: Food, Stay, Travel, Shopping, Activities, Other." },
{ icon: Calculator, title: "Settlement Engine", desc: "Minimum-transactions algorithm settles complex debts in seconds." },
{ icon: Users, title: "Flexible Members", desc: "Add registered users or guests — everyone participates seamlessly." },
{ icon: QrCode, title: "Invite Links", desc: "Share a unique link. One click to join any trip instantly." },
{ icon: CreditCard, title: "Payment Tracking", desc: "Record settlements with real-time balance updates." },
{ icon: PieChart, title: "Visual Analytics", desc: "Category breakdowns with progress bars at a glance." },
{ icon: History, title: "Payment History", desc: "Full audit trail of every settlement and transaction." },
{ icon: Globe, title: "Real-Time Sync", desc: "Instant updates across all devices — no refresh needed." }];


const steps = [
{ num: "01", title: "Create a Trip", desc: "Set destination, dates & member mode in 30 seconds.", emoji: "✈️" },
{ num: "02", title: "Add Expenses", desc: "Log amounts, pick a category, select who's splitting.", emoji: "📝" },
{ num: "03", title: "See Balances", desc: "Real-time view of who owes whom — always accurate.", emoji: "📊" },
{ num: "04", title: "Settle & Share", desc: "One-tap settlement. Share summary on WhatsApp.", emoji: "🤝" }];


const testimonials = [
{ quote: "TripSplit eliminated every awkward money moment on our Europe trip. It just works.", author: "Priya M.", role: "Adventure Traveler", avatar: "🌍" },
{ quote: "The settlement algorithm is brilliant. Complex group expenses resolved in seconds.", author: "Rahul K.", role: "Group Organizer", avatar: "✈️" },
{ quote: "WhatsApp sharing is genius. Friends who don't have the app can still participate.", author: "Sneha P.", role: "Weekend Explorer", avatar: "🏖️" }];


const faqs = [
{ q: "Is TripSplit really free?", a: "Yes, 100% free forever. No hidden charges, no premium plans, no ads." },
{ q: "Do all members need an account?", a: "No! Trip creators can add guest members who don't need to sign up. They can still be part of expense tracking." },
{ q: "How does the settlement work?", a: "Our algorithm calculates the minimum number of transactions needed to settle all debts. One person pays one other person — no chain of payments." },
{ q: "Can I share expenses on WhatsApp?", a: "Absolutely! You can share trip summaries, settlement details, and invite links directly via WhatsApp with one tap." },
{ q: "Is my financial data secure?", a: "Yes. We use role-based access control. Only trip members can see trip data, and creators have admin control." }];


/* ═══ COMPONENT ═══ */
export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.35], [0, -60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  useEffect(() => {
    const h = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden font-sans">

      {/* ══════ 1. NAVBAR ══════ */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${isScrolled ? "bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-3 sm:px-6 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
              <Plane className="h-4 w-4" />
            </div>
            <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">TripSplit</span>
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button variant="ghost" size="sm" asChild className="font-medium text-xs sm:text-sm h-8 sm:h-9 px-2.5 sm:px-4">
              <Link to="/auth?tab=login">Sign In</Link>
            </Button>
            <Button size="sm" asChild className="rounded-full text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-5 shadow-lg shadow-primary/20">
              <Link to="/auth?tab=signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ══════ 2. HERO — cinematic immersive ══════ */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden">
        {/* ── Background: aurora waves + noise ── */}
        <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
          {/* Aurora gradient waves */}
          <motion.div
            className="absolute -top-[40%] -left-[20%] w-[140%] h-[80%] rounded-[50%] opacity-60 blur-[120px]"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.18), hsl(var(--success) / 0.12), hsl(var(--primary) / 0.08))" }}
            animate={{ rotate: [0, 8, -5, 0], scale: [1, 1.05, 0.97, 1], x: [0, 30, -20, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }} />

          <motion.div
            className="absolute -bottom-[30%] -right-[15%] w-[120%] h-[70%] rounded-[50%] opacity-50 blur-[100px]"
            style={{ background: "linear-gradient(225deg, hsl(var(--primary) / 0.15), hsl(var(--warning) / 0.08), transparent)" }}
            animate={{ rotate: [0, -6, 4, 0], scale: [1, 0.96, 1.04, 1], y: [0, -20, 15, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 3 }} />

          <motion.div
            className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[60%] h-[40%] rounded-[50%] opacity-30 blur-[80px]"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.12), transparent 70%)" }}
            animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />


          {/* Dot matrix pattern */}
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

          {/* Orbital rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[700px] sm:h-[700px]">
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/[0.06]"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}>

              <div className="absolute -top-1 left-1/2 w-2 h-2 rounded-full bg-primary/20" />
            </motion.div>
            <motion.div
              className="absolute inset-[15%] rounded-full border border-primary/[0.04]"
              animate={{ rotate: -360 }}
              transition={{ duration: 45, repeat: Infinity, ease: "linear" }}>

              <div className="absolute -bottom-1 right-[20%] w-1.5 h-1.5 rounded-full bg-success/25" />
            </motion.div>
            <motion.div
              className="absolute inset-[30%] rounded-full border border-primary/[0.03]"
              animate={{ rotate: 360 }}
              transition={{ duration: 35, repeat: Infinity, ease: "linear" }}>

              <div className="absolute top-[10%] -left-1 w-1.5 h-1.5 rounded-full bg-warning/20" />
            </motion.div>
          </div>

          {/* Floating currency symbols */}
          {[
          { char: "₹", x: "12%", y: "20%", dur: 14, size: "text-2xl sm:text-4xl" },
          { char: "$", x: "82%", y: "25%", dur: 18, size: "text-xl sm:text-3xl" },
          { char: "€", x: "75%", y: "70%", dur: 16, size: "text-lg sm:text-2xl" },
          { char: "£", x: "8%", y: "72%", dur: 20, size: "text-xl sm:text-3xl" },
          { char: "¥", x: "88%", y: "50%", dur: 15, size: "text-lg sm:text-2xl" }].
          map((c, i) =>
          <motion.span
            key={i}
            className={`absolute ${c.size} font-black pointer-events-none select-none`}
            style={{ left: c.x, top: c.y, color: "hsl(var(--primary) / 0.06)" }}
            animate={{ y: [-20, 20, -20], rotate: [-10, 10, -10], opacity: [0.04, 0.1, 0.04] }}
            transition={{ duration: c.dur, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}>

              {c.char}
            </motion.span>
          )}

          {/* Floating emojis */}
          {[
          { emoji: "✈️", x: "20%", y: "35%", dur: 22 },
          { emoji: "🏖️", x: "78%", y: "40%", dur: 19 },
          { emoji: "🗺️", x: "65%", y: "18%", dur: 24 },
          { emoji: "🧳", x: "30%", y: "75%", dur: 17 }].
          map((e, i) =>
          <motion.span
            key={i}
            className="absolute text-xl sm:text-2xl pointer-events-none select-none opacity-[0.07]"
            style={{ left: e.x, top: e.y }}
            animate={{ y: [-15, 15, -15], x: [-8, 8, -8], rotate: [-15, 15, -15] }}
            transition={{ duration: e.dur, repeat: Infinity, ease: "easeInOut", delay: i * 2 }}>

              {e.emoji}
            </motion.span>
          )}

          {/* Glowing accent lines */}
          <motion.div
            className="absolute top-[25%] left-0 w-full h-px"
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.08), transparent)" }}
            animate={{ opacity: [0, 0.6, 0], x: ["-100%", "0%", "100%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />

          <motion.div
            className="absolute bottom-[30%] left-0 w-full h-px"
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--success) / 0.06), transparent)" }}
            animate={{ opacity: [0, 0.5, 0], x: ["100%", "0%", "-100%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 4 }} />

        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 pt-20 sm:pt-14">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.85 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="mb-5 sm:mb-7">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/70 border border-border/60 shadow-xl backdrop-blur-md">
                <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-success" /></span>
                <span className="text-[11px] sm:text-sm font-semibold text-foreground tracking-wide">100% Free · No Ads · Open for Everyone</span>
              </div>
            </motion.div>

            {/* Headline with character stagger */}
            <h1 className="text-[2.6rem] leading-[1.02] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black text-foreground tracking-tight mb-4 sm:mb-6 max-w-4xl">
              <WordReveal text="Split Expenses," delay={0.25} />
              <br />
              <span className="relative inline-block mt-1 sm:mt-2">
                <WordReveal text="Not Friendships." delay={0.6} className="bg-gradient-to-r from-primary via-primary/90 to-primary/60 bg-clip-text text-transparent" />
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-1 sm:h-1.5 rounded-full origin-left overflow-hidden">

                  <div className="w-full h-full bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
                </motion.div>
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-sm sm:max-w-lg leading-relaxed mb-7 sm:mb-9">

              Track, split & settle group travel expenses effortlessly. 
              <span className="hidden sm:inline"> You make the memories — we handle the math.</span>
              <span className="sm:hidden"> We handle the math.</span>
            </motion.p>

            {/* CTA buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }} className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-10 sm:mb-12">
              <Button size="lg" asChild className="w-full sm:w-auto text-sm sm:text-base px-8 py-5 sm:py-6 shadow-2xl shadow-primary/30 hover:shadow-primary/40 transition-all duration-300 rounded-full font-bold group">
                <Link to="/auth?tab=signup">
                  Start Splitting Free 
                  <motion.span className="ml-2 inline-block" animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-sm sm:text-base px-8 py-5 sm:py-6 rounded-full font-semibold border-2 backdrop-blur-sm hover:bg-accent/50 transition-all duration-300">
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </motion.div>

            {/* Floating mini app preview cards */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="relative w-full max-w-lg sm:max-w-2xl">

              {/* Glass card — app mock */}
              <div className="relative rounded-2xl sm:rounded-3xl border border-border/60 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden p-4 sm:p-6">
                {/* Card inner glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-success/[0.02] pointer-events-none" />
                
                <div className="relative grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                  {/* Mini stat cards */}
                  {[
                  { label: "Total Spent", value: "₹45,200", icon: "💰", color: "from-primary/10 to-primary/5" },
                  { label: "Members", value: "4", icon: "👥", color: "from-success/10 to-success/5" },
                  { label: "Settlements", value: "2 left", icon: "🤝", color: "from-warning/10 to-warning/5" }].
                  map((card, i) =>
                  <motion.div
                    key={i}
                    className={`rounded-xl border border-border/50 bg-gradient-to-br ${card.color} p-2.5 sm:p-3`}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.9 + i * 0.15 }}>

                      <div className="text-base sm:text-lg mb-0.5">{card.icon}</div>
                      <div className="text-xs sm:text-sm font-bold text-foreground">{card.value}</div>
                      <div className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">{card.label}</div>
                    </motion.div>
                  )}
                </div>

                {/* Mini expense rows */}
                <div className="space-y-1.5 sm:space-y-2">
                  {[
                  { title: "Dinner at Beach Shack", amount: "₹2,400", by: "Priya", cat: "🍕" },
                  { title: "Taxi to Airport", amount: "₹1,800", by: "Rahul", cat: "🚕" },
                  { title: "Hotel Stay — 2 nights", amount: "₹8,500", by: "Amit", cat: "🏨" }].
                  map((exp, i) =>
                  <motion.div
                    key={i}
                    className="flex items-center gap-2.5 sm:gap-3 rounded-lg sm:rounded-xl bg-background/60 border border-border/30 p-2 sm:p-2.5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.3 + i * 0.12 }}>

                      <div className="text-sm sm:text-base">{exp.cat}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] sm:text-xs font-semibold text-foreground truncate">{exp.title}</div>
                        <div className="text-[9px] sm:text-[10px] text-muted-foreground">Paid by {exp.by}</div>
                      </div>
                      <div className="text-[11px] sm:text-xs font-bold text-foreground">{exp.amount}</div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Decorative floating badges around the card */}
              <motion.div
                className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-success text-success-foreground text-[9px] sm:text-[10px] font-bold shadow-lg"
                animate={{ y: [-3, 3, -3], rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>

                Real-time sync ⚡
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-primary text-primary-foreground text-[9px] sm:text-[10px] font-bold shadow-lg"
                animate={{ y: [3, -3, 3], rotate: [2, -2, 2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>

                Smart splits ✨
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1" animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
          <span className="text-[9px] text-muted-foreground/50 font-medium tracking-widest uppercase">Scroll</span>
          <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/30" />
        </motion.div>
      </section>

      {/* ══════ 3. THE PROBLEM WE SOLVE ══════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 mb-3">
                <XIcon className="h-3.5 w-3.5 text-destructive" />
                <span className="text-[11px] sm:text-xs font-bold text-destructive uppercase tracking-wider">The Problem</span>
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-foreground">
                Group trips shouldn't cause money drama
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {problems.map((p, i) =>
            <Reveal key={i} delay={i * 0.05}>
                <div className="flex items-start gap-3 rounded-xl border border-destructive/15 bg-destructive/5 p-4">
                  <XIcon className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{p}</span>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ══════ 4. OUR SOLUTION ══════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 mb-3">
                <Check className="h-3.5 w-3.5 text-success" />
                <span className="text-[11px] sm:text-xs font-bold text-success uppercase tracking-wider">The Solution</span>
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-foreground">
                TripSplit handles it all — automatically
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {solutions.map((s, i) =>
            <Reveal key={i} delay={i * 0.05}>
                <div className="flex items-start gap-3 rounded-xl border border-success/15 bg-success/5 p-4">
                  <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{s}</span>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ══════ 5. WHY USE TRIPSPLIT ══════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] sm:text-xs font-bold text-primary uppercase tracking-wider">Why TripSplit</span>
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-foreground">
                Why should you use this app?
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {whyReasons.map((r, i) =>
            <Reveal key={i} delay={i * 0.05}>
                <div className="group h-full rounded-2xl border border-border bg-card p-4 sm:p-5 hover:border-primary/20 hover:shadow-lg transition-all duration-400">
                  <div className={`h-10 w-10 rounded-xl ${r.accent} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <r.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground mb-1">{r.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ══════ 6. HOW IT WORKS ══════ */}
      <section id="how-it-works" className="py-12 sm:py-16 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] sm:text-xs font-bold text-primary uppercase tracking-wider">4 Simple Steps</span>
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-foreground">
                Get started in under a minute
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {steps.map((s, i) =>
            <Reveal key={i} delay={i * 0.08}>
                <div className="relative rounded-2xl border border-border bg-card p-4 sm:p-5 text-center hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-5 px-2.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow-md ring-2 ring-background">
                    {s.num}
                  </div>
                  <div className="mt-2 mb-2 text-3xl sm:text-4xl">{s.emoji}</div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground mb-1">{s.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ══════ 7. FEATURES ══════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] sm:text-xs font-bold text-primary uppercase tracking-wider">Packed with Features</span>
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-foreground">
                Everything you need for group expenses
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((f, i) =>
            <Reveal key={i} delay={i * 0.04}>
                <div className="group flex items-start gap-3.5 rounded-xl border border-border bg-card p-4 hover:border-primary/20 hover:shadow-lg transition-all duration-400">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <f.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-foreground mb-0.5">{f.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ══════ 8. WHATSAPP SHARING HIGHLIGHT ══════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="rounded-2xl sm:rounded-3xl border border-border bg-card overflow-hidden">
              <div className="grid md:grid-cols-2 items-center">
                <div className="p-6 sm:p-8 md:p-10">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 border border-success/20 mb-4">
                    <MessageCircle className="h-3.5 w-3.5 text-success" />
                    <span className="text-[11px] sm:text-xs font-bold text-success uppercase tracking-wider">WhatsApp Integration</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground mb-3">
                    Share settlements on WhatsApp — instantly
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                    Generate a beautifully formatted trip summary with expenses, balances, and "who pays whom" — then share it to your group chat with one tap.
                  </p>
                  <ul className="space-y-2">
                    {[
                    "Complete expense breakdown by category",
                    "Clear 'who pays whom' settlement list",
                    "Invite friends via WhatsApp link",
                    "No app download needed to view"].
                    map((item, i) =>
                    <li key={i} className="flex items-center gap-2.5 text-sm text-foreground">
                        <Check className="h-4 w-4 text-success shrink-0" />
                        {item}
                      </li>
                    )}
                  </ul>
                </div>
                <div className="p-6 sm:p-8 md:p-10 flex items-center justify-center bg-gradient-to-br from-success/5 to-success/10">
                  <div className="w-full max-w-[260px] space-y-3">
                    <div className="rounded-2xl bg-card border border-border p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                          <MessageCircle className="h-4 w-4 text-success" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-foreground">TripSplit Summary</div>
                          <div className="text-[10px] text-muted-foreground">Goa Trip 2026</div>
                        </div>
                      </div>
                      <div className="space-y-1.5 text-[11px] text-muted-foreground">
                        <div>💰 Total: ₹45,200</div>
                        <div>👥 Members: 4</div>
                        <div className="pt-1 border-t border-border mt-1.5">
                          <div>→ Rahul pays Priya: ₹3,200</div>
                          <div>→ Sneha pays Amit: ₹1,800</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-success text-success-foreground text-sm font-bold shadow-lg">
                      <Share2 className="h-4 w-4" />
                      Share on WhatsApp
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════ 9. TESTIMONIALS ══════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-foreground">
                Loved by 10,000+ travelers
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {testimonials.map((t, i) =>
            <Reveal key={i} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-card p-5 flex flex-col">
                  <div className="flex gap-0.5 mb-3 text-warning text-sm">★★★★★</div>
                  <p className="text-foreground leading-relaxed text-sm flex-1 mb-4">"{t.quote}"</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-base">{t.avatar}</div>
                    <div>
                      <div className="font-bold text-foreground text-sm">{t.author}</div>
                      <div className="text-xs text-muted-foreground">{t.role}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ══════ 10. FAQ ══════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="text-center mb-8 sm:mb-10">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-foreground">
                Frequently asked questions
              </h2>
            </div>
          </Reveal>
          <div className="space-y-2">
            {faqs.map((faq, i) =>
            <Reveal key={i} delay={i * 0.05}>
                <div className="rounded-xl border border-border bg-card overflow-hidden">
                  <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left">

                    <span className="text-sm sm:text-base font-bold text-foreground pr-4">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  <motion.div
                  initial={false}
                  animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden">

                    <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>

      {/* ══════ CTA BANNER ══════ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6">
        <Reveal>
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`, backgroundSize: "20px 20px" }} />
              <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 rounded-l-full blur-3xl" />
              <div className="relative z-10 p-7 sm:p-10 md:p-14 text-center">
                <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-primary-foreground mb-3 sm:mb-4">
                  Ready to split smarter?
                </h2>
                <p className="text-xs sm:text-sm text-primary-foreground/80 max-w-md mx-auto mb-6">
                  Join thousands of travelers who ditched the spreadsheets. Free forever.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                  <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto text-sm sm:text-base px-7 py-5 sm:py-6 bg-white text-primary hover:bg-white/90 shadow-xl font-bold rounded-full">
                    <Link to="/auth?tab=signup">Create Free Account <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-sm sm:text-base px-7 py-5 sm:py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-full">
                    <Link to="/auth?tab=login" className="text-primary-foreground">Sign In</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="py-6 sm:py-10 border-t border-border px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <Plane className="h-3.5 w-3.5" />
              </div>
              <span className="text-base font-bold text-foreground">TripSplit</span>
            </div>
            <p className="text-muted-foreground text-center text-xs">
              © {new Date().getFullYear()} TripSplit. Developed by Prince Ramoliya ❤️ for travelers everywhere.
            </p>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="sm" asChild className="text-xs h-8">
                <Link to="/auth?tab=login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full text-xs h-8">
                <Link to="/auth?tab=signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>);

}
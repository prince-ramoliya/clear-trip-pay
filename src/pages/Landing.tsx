import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Plane, Users, Receipt, Calculator, Shield, Check,
  ArrowRight, Sparkles, CreditCard, PieChart, ArrowDown,
  Zap, MessageCircle, Globe, Share2, UserPlus, Smartphone,
  Clock, TrendingUp, Eye, Split, BadgeCheck, HandCoins,
  X as XIcon, QrCode, History, ChevronDown, Wallet, Banknote,
  CircleDollarSign, HandshakeIcon, Coins, TrendingDown,
  ArrowLeftRight, Landmark } from
"lucide-react";

/* ─── Floating expense icon ─── */
const HERO_ICONS = [
  { Icon: Receipt, x: "8%", y: "15%", size: 28, delay: 0, dur: 18, rotate: 12 },
  { Icon: CreditCard, x: "85%", y: "12%", size: 26, delay: 1.2, dur: 22, rotate: -15 },
  { Icon: Wallet, x: "78%", y: "65%", size: 24, delay: 0.6, dur: 20, rotate: 8 },
  { Icon: Banknote, x: "5%", y: "70%", size: 30, delay: 2, dur: 16, rotate: -10 },
  { Icon: Calculator, x: "92%", y: "40%", size: 22, delay: 0.8, dur: 24, rotate: 20 },
  { Icon: CircleDollarSign, x: "15%", y: "45%", size: 20, delay: 1.5, dur: 19, rotate: -18 },
  { Icon: Coins, x: "72%", y: "82%", size: 22, delay: 3, dur: 21, rotate: 14 },
  { Icon: PieChart, x: "25%", y: "80%", size: 20, delay: 2.5, dur: 17, rotate: -12 },
  { Icon: HandCoins, x: "60%", y: "10%", size: 24, delay: 0.4, dur: 23, rotate: 16 },
  { Icon: ArrowLeftRight, x: "40%", y: "85%", size: 18, delay: 1.8, dur: 15, rotate: -8 },
  { Icon: Users, x: "88%", y: "78%", size: 20, delay: 3.2, dur: 18, rotate: 10 },
  { Icon: Plane, x: "35%", y: "8%", size: 22, delay: 0.2, dur: 26, rotate: -22 },
];

function FloatingIcon({ Icon, x, y, size, delay, dur, rotate }: typeof HERO_ICONS[0]) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.12, 0.08, 0.12, 0],
        scale: [0.6, 1, 0.9, 1.05, 0.6],
        y: [0, -20, 10, -15, 0],
        x: [0, 10, -8, 12, 0],
        rotate: [0, rotate, -rotate / 2, rotate / 3, 0],
      }}
      transition={{ duration: dur, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <Icon size={size} className="text-primary/[0.15]" strokeWidth={1.5} />
    </motion.div>
  );
}

/* ─── Glowing connection line between icons ─── */
function ConnectionLine({ delay, fromX, fromY, toX, toY }: { delay: number; fromX: string; fromY: string; toX: string; toY: string }) {
  return (
    <motion.svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.06, 0] }}
      transition={{ duration: 4, repeat: Infinity, delay, ease: "easeInOut" }}
    >
      <line
        x1={fromX} y1={fromY} x2={toX} y2={toY}
        stroke="hsl(var(--primary))"
        strokeWidth="1"
        strokeDasharray="6 4"
      />
    </motion.svg>
  );
}

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
{ quote: "Cleartrippay eliminated every awkward money moment on our Europe trip. It just works.", author: "Priya M.", role: "Adventure Traveler", avatar: "🌍" },
{ quote: "The settlement algorithm is brilliant. Complex group expenses resolved in seconds.", author: "Rahul K.", role: "Group Organizer", avatar: "✈️" },
{ quote: "WhatsApp sharing is genius. Friends who don't have the app can still participate.", author: "Sneha P.", role: "Weekend Explorer", avatar: "🏖️" }];


const faqs = [
{ q: "Is Cleartrippay really free?", a: "Yes, 100% free forever. No hidden charges, no premium plans, no ads." },
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
            <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">Cleartrippay</span>
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

      {/* ══════ 2. HERO — immersive expense constellation ══════ */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden">
        {/* ── Background layers ── */}
        <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
          {/* Deep gradient mesh */}
          <div className="absolute inset-0" style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 30%, hsl(var(--primary) / 0.08) 0%, transparent 70%),
              radial-gradient(ellipse 60% 60% at 80% 70%, hsl(var(--success) / 0.06) 0%, transparent 70%),
              radial-gradient(ellipse 50% 40% at 50% 50%, hsl(var(--primary) / 0.04) 0%, transparent 60%)
            `
          }} />

          {/* Animated gradient orb - top */}
          <motion.div
            className="absolute -top-[30%] left-[10%] w-[80%] h-[60%] rounded-full blur-[120px]"
            style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--success) / 0.06))" }}
            animate={{ x: [0, 40, -20, 0], scale: [1, 1.1, 0.95, 1], opacity: [0.5, 0.7, 0.4, 0.5] }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Animated gradient orb - bottom */}
          <motion.div
            className="absolute -bottom-[20%] right-[5%] w-[70%] h-[50%] rounded-full blur-[100px]"
            style={{ background: "linear-gradient(225deg, hsl(var(--primary) / 0.1), hsl(var(--warning) / 0.05))" }}
            animate={{ x: [0, -30, 20, 0], y: [0, -15, 10, 0], opacity: [0.4, 0.6, 0.35, 0.4] }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          />

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px"
          }} />

          {/* Floating expense icons constellation */}
          {HERO_ICONS.map((icon, i) => (
            <FloatingIcon key={i} {...icon} />
          ))}

          {/* Connection lines between icons */}
          <ConnectionLine delay={0} fromX="8%" fromY="15%" toX="35%" toY="8%" />
          <ConnectionLine delay={2} fromX="85%" fromY="12%" toX="60%" toY="10%" />
          <ConnectionLine delay={4} fromX="78%" fromY="65%" toX="92%" toY="40%" />
          <ConnectionLine delay={1} fromX="5%" fromY="70%" toX="25%" toY="80%" />
          <ConnectionLine delay={3} fromX="15%" fromY="45%" toX="40%" toY="85%" />

          {/* Large decorative ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px]">
            <motion.div
              className="absolute inset-0 rounded-full border border-primary/[0.04]"
              animate={{ rotate: 360 }}
              transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className="absolute -top-1.5 left-1/2 w-3 h-3 rounded-full"
                style={{ background: "hsl(var(--primary) / 0.15)" }}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
            <motion.div
              className="absolute inset-[20%] rounded-full border border-dashed border-primary/[0.03]"
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                className="absolute -bottom-1 right-[20%] w-2 h-2 rounded-full"
                style={{ background: "hsl(var(--success) / 0.2)" }}
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
              />
            </motion.div>
          </div>

          {/* Scanning line effect */}
          <motion.div
            className="absolute left-0 w-full h-[1px]"
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.1), transparent)" }}
            animate={{ top: ["-10%", "110%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
          />
        </div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 pt-20 sm:pt-14">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mb-5 sm:mb-7"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 border border-border/50 shadow-xl backdrop-blur-xl">
                <motion.div
                  className="flex items-center justify-center w-5 h-5 rounded-full bg-success/20"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                  </span>
                </motion.div>
                <span className="text-[11px] sm:text-sm font-semibold text-foreground tracking-wide">100% Free · No Ads · Open for Everyone</span>
              </div>
            </motion.div>

            {/* Headline — staggered word reveal */}
            <h1 className="text-[2.5rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-[4.5rem] font-black text-foreground tracking-tight mb-5 sm:mb-7 max-w-4xl">
              <WordReveal text="Split Expenses," delay={0.3} />
              <br />
              <span className="relative inline-block mt-1 sm:mt-2">
                <WordReveal text="Not" delay={0.65} />
                {" "}
                <motion.span
                  className="relative inline-block"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="relative z-10 bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                    Friendships.
                  </span>
                  {/* Animated underline */}
                  <motion.span
                    className="absolute -bottom-1 sm:-bottom-2 left-0 h-[3px] sm:h-1 rounded-full bg-gradient-to-r from-primary via-primary/80 to-transparent"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  />
                  {/* Sparkle accent */}
                  <motion.div
                    className="absolute -top-2 -right-4 sm:-top-3 sm:-right-6"
                    initial={{ opacity: 0, rotate: -30, scale: 0 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    transition={{ delay: 1.5, duration: 0.4, type: "spring" }}
                  >
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary/60" />
                  </motion.div>
                </motion.span>
              </span>
            </h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-sm sm:max-w-lg leading-relaxed mb-8 sm:mb-10"
            >
              Track, split & settle group travel expenses effortlessly.
              <span className="hidden sm:inline"> You make the memories — we handle the math.</span>
              <span className="sm:hidden"> We handle the math.</span>
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-12 sm:mb-14"
            >
              <Button size="lg" asChild className="w-full sm:w-auto text-sm sm:text-base px-8 py-5 sm:py-6 shadow-2xl shadow-primary/25 hover:shadow-primary/40 transition-all duration-300 rounded-full font-bold group relative overflow-hidden">
                <Link to="/auth?tab=signup">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                    animate={{ translateX: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  />
                  <span className="relative z-10 flex items-center gap-2">
                    Start Splitting Free
                    <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}>
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.span>
                  </span>
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-sm sm:text-base px-8 py-5 sm:py-6 rounded-full font-semibold border-2 backdrop-blur-sm hover:bg-accent/50 transition-all duration-300">
                <a href="#how-it-works">See How It Works</a>
              </Button>
            </motion.div>

            {/* ── Interactive expense card showcase ── */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-lg sm:max-w-2xl p-4 sm:p-6"
            >
              {/* Glow behind card */}
              <div className="absolute inset-0 -z-10 rounded-3xl blur-3xl opacity-20" style={{ background: "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.3), transparent 70%)" }} />

              {/* Main glass card */}
              <div className="relative rounded-2xl sm:rounded-3xl border border-border/50 bg-card/40 backdrop-blur-2xl shadow-2xl overflow-hidden">
                {/* Card header gradient */}
                <div className="relative px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-border/30">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/[0.04] via-transparent to-success/[0.03]" />
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <motion.div
                        className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-primary/10 flex items-center justify-center"
                        animate={{ rotate: [0, -5, 5, 0] }}
                        transition={{ duration: 6, repeat: Infinity }}
                      >
                        <Plane className="h-4 w-4 text-primary" />
                      </motion.div>
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-foreground">Goa Beach Trip</div>
                        <div className="text-[9px] sm:text-[10px] text-muted-foreground">4 members · 3 days</div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {["🇮🇳", "🏖️", "🌴"].map((e, i) => (
                        <motion.span
                          key={i}
                          className="text-sm sm:text-base"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 2 + i * 0.15, type: "spring" }}
                        >
                          {e}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 p-4 sm:p-5">
                  {[
                    { label: "Total Spent", value: "₹45,200", icon: Wallet, color: "from-primary/10 to-primary/5", iconColor: "text-primary" },
                    { label: "Your Share", value: "₹11,300", icon: CircleDollarSign, color: "from-success/10 to-success/5", iconColor: "text-success" },
                    { label: "To Settle", value: "₹2,100", icon: ArrowLeftRight, color: "from-warning/10 to-warning/5", iconColor: "text-warning" },
                  ].map((card, i) => (
                    <motion.div
                      key={i}
                      className={`rounded-xl border border-border/40 bg-gradient-to-br ${card.color} p-2.5 sm:p-3`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.9 + i * 0.15 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                    >
                      <card.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${card.iconColor} mb-1`} />
                      <div className="text-xs sm:text-sm font-bold text-foreground">{card.value}</div>
                      <div className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">{card.label}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Expense rows */}
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-1.5 sm:space-y-2">
                  {[
                    { title: "Dinner at Beach Shack", amount: "₹2,400", by: "Priya", cat: "🍕", catLabel: "Food" },
                    { title: "Taxi to Airport", amount: "₹1,800", by: "Rahul", cat: "🚕", catLabel: "Travel" },
                    { title: "Hotel Stay — 2 nights", amount: "₹8,500", by: "Amit", cat: "🏨", catLabel: "Stay" },
                  ].map((exp, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-2.5 sm:gap-3 rounded-xl bg-background/50 border border-border/25 p-2.5 sm:p-3 hover:border-border/50 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.3 + i * 0.12 }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-muted/50 text-sm sm:text-base shrink-0">{exp.cat}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] sm:text-xs font-semibold text-foreground truncate">{exp.title}</div>
                        <div className="text-[9px] sm:text-[10px] text-muted-foreground">Paid by {exp.by} · {exp.catLabel}</div>
                      </div>
                      <div className="text-[11px] sm:text-xs font-bold text-foreground whitespace-nowrap">{exp.amount}</div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-success text-success-foreground text-[9px] sm:text-[10px] font-bold shadow-lg flex items-center gap-1"
                animate={{ y: [-3, 3, -3], rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Zap className="h-2.5 w-2.5" /> Real-time sync
              </motion.div>
              <motion.div
                className="absolute -bottom-2 -left-2 sm:-bottom-3 sm:-left-3 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-primary text-primary-foreground text-[9px] sm:text-[10px] font-bold shadow-lg flex items-center gap-1"
                animate={{ y: [3, -3, 3], rotate: [2, -2, 2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <Calculator className="h-2.5 w-2.5" /> Smart splits
              </motion.div>
              <motion.div
                className="absolute top-1/2 -right-3 sm:-right-5 -translate-y-1/2 px-2 py-1 rounded-full bg-card border border-border/50 text-[9px] sm:text-[10px] font-semibold text-foreground shadow-md"
                animate={{ x: [-2, 4, -2], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              >
                ÷ 4 members
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          animate={{ y: [0, 6, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
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
                Cleartrippay handles it all — automatically
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
                <span className="text-[11px] sm:text-xs font-bold text-primary uppercase tracking-wider">Why Cleartrippay</span>
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
                  <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-sm sm:text-base px-7 py-5 sm:py-6 border-white/40 text-white hover:bg-white/10 rounded-full">
                    <Link to="/auth?tab=login">Sign In</Link>
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
              <span className="text-base font-bold text-foreground">Cleartrippay</span>
            </div>
            <p className="text-muted-foreground text-center text-xs">
              © {new Date().getFullYear()} Cleartrippay. Developed by Prince Ramoliya ❤️ for travelers everywhere.
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
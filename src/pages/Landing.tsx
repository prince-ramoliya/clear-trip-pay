import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Plane, Users, Receipt, Calculator, Shield, ChevronRight, Check,
  ArrowRight, Sparkles, CreditCard, PieChart, Menu, X, ArrowDown,
  Zap, MessageCircle, Globe, Share2,
} from "lucide-react";

/* ─── Animated counter ─── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Reveal on scroll ─── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Staggered word reveal ─── */
function WordReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: delay + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ─── Data ─── */
const features = [
  { icon: Plane, title: "Trip Management", desc: "Create adventures with full lifecycle control — dates, destinations, members.", accent: "bg-primary/10 text-primary" },
  { icon: Receipt, title: "Smart Expenses", desc: "6 categories with precise participant-based splitting for every scenario.", accent: "bg-success/10 text-success" },
  { icon: Calculator, title: "Settlement Engine", desc: "Minimum-transactions algorithm settles all debts in seconds.", accent: "bg-warning/10 text-warning" },
  { icon: Users, title: "Flexible Members", desc: "Registered users or guests — everyone participates seamlessly.", accent: "bg-primary/10 text-primary" },
  { icon: MessageCircle, title: "WhatsApp Share", desc: "Generate & share beautiful trip summaries with one tap.", accent: "bg-success/10 text-success" },
  { icon: Shield, title: "Secure & Private", desc: "Role-based access control keeps your financial data safe.", accent: "bg-destructive/10 text-destructive" },
];

const steps = [
  { num: "01", title: "Create", desc: "Set up your trip in seconds", icon: "✈️" },
  { num: "02", title: "Track", desc: "Log expenses as they happen", icon: "📝" },
  { num: "03", title: "Split", desc: "Auto-calculate fair shares", icon: "📊" },
  { num: "04", title: "Settle", desc: "Clear debts, stay friends", icon: "🤝" },
];

const testimonials = [
  { quote: "TripSplit eliminated every awkward money moment on our Europe trip. It just works.", author: "Priya M.", role: "Adventure Traveler", avatar: "🌍" },
  { quote: "The settlement algorithm is brilliant. Complex group expenses resolved in seconds.", author: "Rahul K.", role: "Group Organizer", avatar: "✈️" },
  { quote: "WhatsApp sharing is genius. Friends who don't have the app can still participate.", author: "Sneha P.", role: "Weekend Explorer", avatar: "🏖️" },
];

/* ─── Landing ─── */
export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.4], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${isScrolled ? "bg-background/80 backdrop-blur-2xl border-b border-border/50 shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 sm:h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20">
              <Plane className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold text-foreground tracking-tight">TripSplit</span>
          </Link>

          <div className="hidden sm:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild className="font-medium">
              <Link to="/auth?tab=login">Sign In</Link>
            </Button>
            <Button size="sm" asChild className="rounded-full px-5 shadow-lg shadow-primary/20">
              <Link to="/auth?tab=signup">Get Started <ArrowRight className="ml-1.5 h-3.5 w-3.5" /></Link>
            </Button>
          </div>

          <button
            className="sm:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="sm:hidden bg-background/95 backdrop-blur-xl border-b border-border overflow-hidden"
            >
              <div className="px-4 pb-4 pt-1 space-y-2">
                <Button variant="ghost" asChild className="w-full justify-center" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/auth?tab=login">Sign In</Link>
                </Button>
                <Button asChild className="w-full rounded-full" onClick={() => setMobileMenuOpen(false)}>
                  <Link to="/auth?tab=signup">Get Started Free</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden px-4 sm:px-6">

        {/* ── Background art ── */}
        <div className="absolute inset-0 -z-10">
          {/* Large gradient orbs */}
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 8, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[20%] -right-[15%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)" }}
          />
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, -6, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-[20%] -left-[15%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)" }}
          />
          {/* Floating geometric shapes */}
          <motion.div
            animate={{ y: [-20, 20, -20], rotate: [0, 45, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[18%] right-[8%] w-16 h-16 sm:w-24 sm:h-24 rounded-2xl border-2 border-primary/10 bg-primary/5"
          />
          <motion.div
            animate={{ y: [15, -15, 15], rotate: [45, 0, 45] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[22%] left-[6%] w-12 h-12 sm:w-20 sm:h-20 rounded-full border-2 border-primary/8 bg-primary/3"
          />
          <motion.div
            animate={{ y: [10, -20, 10], x: [-10, 10, -10] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[40%] left-[15%] w-8 h-8 sm:w-14 sm:h-14 rounded-lg border border-primary/10 bg-primary/5 rotate-12"
          />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }} />
        </div>

        <motion.div style={{ y: heroParallax, opacity: heroOpacity }} className="max-w-5xl mx-auto w-full pt-16 sm:pt-20">
          <div className="flex flex-col items-center text-center">

            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6 sm:mb-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-foreground">Free forever · No ads · No BS</span>
              </div>
            </motion.div>

            {/* Headline with word-by-word reveal */}
            <h1 className="text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-foreground tracking-tight mb-5 sm:mb-7 max-w-4xl">
              <WordReveal text="Split Expenses," delay={0.3} />
              <br />
              <span className="relative inline-block">
                <WordReveal
                  text="Not Friendships."
                  delay={0.7}
                  className="bg-gradient-to-r from-primary via-primary to-primary/70 bg-clip-text text-transparent"
                />
                {/* Underline accent */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute -bottom-1 sm:-bottom-2 left-0 right-0 h-1 sm:h-1.5 bg-primary/30 rounded-full origin-left"
                />
              </span>
            </h1>

            {/* Subtitle with fade */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed mb-8 sm:mb-10"
            >
              The smartest way to track, split, and settle group expenses.
              <span className="hidden sm:inline"> You handle the memories — we handle the math.</span>
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-10 sm:mb-12"
            >
              <Button size="lg" asChild className="w-full sm:w-auto text-base px-8 py-6 shadow-xl shadow-primary/25 hover:shadow-2xl hover:shadow-primary/30 transition-all rounded-full font-bold">
                <Link to="/auth?tab=signup">
                  Start Splitting Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-base px-8 py-6 rounded-full font-semibold border-2">
                <a href="#how-it-works">
                  See How It Works
                </a>
              </Button>
            </motion.div>

            {/* Social proof strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.6 }}
              className="w-full max-w-xl"
            >
              <div className="flex items-center justify-center gap-6 sm:gap-10 py-5 px-4 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-black text-foreground">
                    <Counter target={10000} suffix="+" />
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Trips Created</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-black text-foreground">
                    <Counter target={50000} suffix="+" />
                  </div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">Settlements</div>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-black text-foreground">4.9★</div>
                  <div className="text-[10px] sm:text-xs text-muted-foreground font-medium mt-0.5">User Rating</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-5 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-muted-foreground/50 font-medium uppercase tracking-widest">Scroll</span>
            <ArrowDown className="h-4 w-4 text-muted-foreground/40" />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════ PROBLEM → SOLUTION ═══════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
              {/* Problem */}
              <div className="rounded-2xl sm:rounded-3xl border border-destructive/20 bg-destructive/5 p-6 sm:p-8">
                <div className="text-sm font-bold text-destructive uppercase tracking-wider mb-4">The Problem</div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">Group trips = money chaos</h3>
                <ul className="space-y-2.5 text-sm sm:text-base text-muted-foreground">
                  {["Awkward 'you owe me' conversations", "Messy spreadsheets nobody updates", "Unfair splits that breed resentment", "Lost receipts and forgotten payments"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Solution */}
              <div className="rounded-2xl sm:rounded-3xl border border-success/20 bg-success/5 p-6 sm:p-8">
                <div className="text-sm font-bold text-success uppercase tracking-wider mb-4">The Solution</div>
                <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3">TripSplit handles everything</h3>
                <ul className="space-y-2.5 text-sm sm:text-base text-muted-foreground">
                  {["Auto-calculated fair splits in real-time", "One-tap settlements via WhatsApp", "Smart categories for every expense type", "Works for everyone — even without an account"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
                <Zap className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">4 Simple Steps</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground">
                From chaos to clarity
              </h2>
            </div>
          </Reveal>

          <div className="relative">
            {/* Vertical connector line — visible on all sizes */}
            <div className="absolute top-0 bottom-0 left-6 sm:left-8 w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent hidden sm:block" />

            <div className="space-y-4 sm:space-y-6">
              {steps.map((step, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="flex gap-4 sm:gap-6 items-start">
                    {/* Step number circle */}
                    <div className="relative shrink-0">
                      <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-card border-2 border-border flex items-center justify-center shadow-lg">
                        <span className="text-2xl sm:text-3xl">{step.icon}</span>
                      </div>
                      <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-md">
                        {step.num}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="pt-1 sm:pt-3">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">{step.title}</h3>
                      <p className="text-sm sm:text-base text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-12 sm:mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-bold text-primary uppercase tracking-wider">Features</span>
              </div>
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground mb-3">
                Built for real trips
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                Every feature designed from real group travel pain points.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.06}>
                <div className="group h-full rounded-2xl border border-border bg-card p-5 sm:p-6 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                  <div className={`h-11 w-11 rounded-xl ${f.accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <f.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-foreground">
                Loved by travelers
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="h-full rounded-2xl border border-border bg-card p-5 sm:p-7 flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4 text-warning">
                    {"★★★★★".split("").map((s, j) => (
                      <span key={j} className="text-sm">{s}</span>
                    ))}
                  </div>
                  <p className="text-foreground leading-relaxed text-sm sm:text-base flex-1 mb-5">
                    "{t.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-lg">
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

      {/* ═══════════════════ FINAL CTA ═══════════════════ */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <Reveal>
          <div className="max-w-3xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden">
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                backgroundSize: "24px 24px",
              }} />
              <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 rounded-l-full blur-3xl" />

              <div className="relative z-10 p-8 sm:p-12 md:p-16 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-primary-foreground mb-3 sm:mb-5">
                    Ready to split smarter?
                  </h2>
                  <p className="text-sm sm:text-base text-primary-foreground/80 max-w-md mx-auto mb-7 sm:mb-9">
                    Join thousands of travelers who ditched the spreadsheets. It's free, forever.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Button size="lg" variant="secondary" asChild className="w-full sm:w-auto text-base px-8 py-6 bg-white text-primary hover:bg-white/90 shadow-xl font-bold rounded-full">
                      <Link to="/auth?tab=signup">
                        Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-base px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 rounded-full">
                      <Link to="/auth?tab=login">
                        Sign In <ChevronRight className="ml-1 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="py-8 sm:py-12 border-t border-border px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <Plane className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-foreground">TripSplit</span>
            </div>
            <p className="text-muted-foreground text-center text-xs sm:text-sm">
              © {new Date().getFullYear()} TripSplit. Developed by Prince Ramoliya ❤️ for travelers everywhere.
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth?tab=login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="rounded-full">
                <Link to="/auth?tab=signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

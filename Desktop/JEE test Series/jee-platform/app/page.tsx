"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView, useScroll, useTransform, useSpring, Variants } from "framer-motion"
import { useRouter } from "next/navigation"

const easing = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: easing } }),
}
const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number = 0) => ({ opacity: 1, scale: 1, transition: { duration: 0.55, delay: i * 0.08, ease: easing } }),
}

function Reveal({ children, variant = fadeUp, custom = 0, className = "" }: {
  children: React.ReactNode; variant?: Variants; custom?: number; className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-60px" })
  return (
    <motion.div ref={ref} variants={variant} initial="hidden" animate={inView ? "visible" : "hidden"} custom={custom} className={className}>
      {children}
    </motion.div>
  )
}

function useCountdown() {
  const [secs, setSecs] = useState(0)
  useEffect(() => {
    const KEY = "jeet_offer_end"
    let end = parseInt(sessionStorage.getItem(KEY) || "0")
    if (!end || end < Date.now()) { end = Date.now() + 22 * 3600 * 1000; sessionStorage.setItem(KEY, String(end)) }
    const tick = () => setSecs(Math.max(0, Math.floor((end - Date.now()) / 1000)))
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id)
  }, [])
  const h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60
  const pad = (n: number) => String(n).padStart(2, "0")
  return { h: pad(h), m: pad(m), s: pad(s) }
}

function useSeatsLeft() {
  const [seats, setSeats] = useState(47)
  useEffect(() => {
    const KEY = "jeet_seats"
    const stored = sessionStorage.getItem(KEY)
    if (stored) { setSeats(parseInt(stored)); return }
    const n = 41 + Math.floor(Math.random() * 14)
    sessionStorage.setItem(KEY, String(n)); setSeats(n)
  }, [])
  return seats
}

// Hero student image — a focused student studying, facing left (mirrored so they look INTO the content)
function HeroStudentImage() {
  return (
    <div style={{
      position: "absolute",
      right: 0,
      bottom: 0,
      top: 0,
      width: "52%",
      zIndex: 1,
      pointerEvents: "none",
      overflow: "hidden",
    }}>
      {/* Gradient fade on left edge so image blends into content */}
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "38%",
        background: "linear-gradient(to right, #ffffff 0%, transparent 100%)",
        zIndex: 3,
      }} />
      {/* Gradient fade on bottom */}
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "18%",
        background: "linear-gradient(to top, #ffffff 0%, transparent 100%)",
        zIndex: 3,
      }} />
      {/* Actual image — using Unsplash for a focused student */}
      <img
        src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=900&q=85&auto=format&fit=crop"
        alt="Student studying"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center top",
          // Mirror horizontally so student faces LEFT (toward the text content)
          transform: "scaleX(-1)",
          opacity: 0.88,
          filter: "saturate(0.85) brightness(1.05)",
        }}
      />
      {/* Subtle blue tint overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(135deg, rgba(37,99,235,0.06) 0%, transparent 60%)",
        zIndex: 2,
      }} />
    </div>
  )
}


// Elite "Notify Me" card — saves email to Supabase elite_waitlist table
function EliteNotifyCard() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit() {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setErrorMsg("Please enter a valid email."); return
    }
    setStatus("loading"); setErrorMsg("")
    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const { error } = await supabase
        .from("elite_waitlist")
        .insert([{ email: trimmed, created_at: new Date().toISOString() }])
      if (error && error.code !== "23505") throw error
      setStatus("success")
    } catch {
      setStatus("error"); setErrorMsg("Something went wrong. Try again.")
    }
  }

  return (
    <div style={{
      background: "linear-gradient(145deg,#1e1040 0%,#2d1b69 55%,#1a0f38 100%)",
      border: "1.5px solid rgba(167,139,250,0.35)",
      borderRadius: 20,
      padding: "clamp(22px,3vw,32px) clamp(18px,2.5vw,26px)",
      position: "relative",
      display: "flex",
      flexDirection: "column" as const,
      overflow: "hidden",
      boxShadow: "0 8px 40px rgba(124,58,237,0.22)",
    }}>
      <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"radial-gradient(circle,rgba(167,139,250,0.16),transparent 70%)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-40, left:-40, width:160, height:160, borderRadius:"50%", background:"radial-gradient(circle,rgba(124,58,237,0.12),transparent 70%)", pointerEvents:"none" }} />

      <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"rgba(167,139,250,0.15)", border:"1px solid rgba(167,139,250,0.4)", borderRadius:20, padding:"5px 14px", fontSize:11, fontWeight:700, color:"#c4b5fd", marginBottom:14, letterSpacing:".6px", textTransform:"uppercase" as const, width:"fit-content" }}>
        🔄 Coming Soon
      </div>

      <div style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:"#ffffff", marginBottom:6 }}>Elite</div>
      <div style={{ fontSize:"clamp(30px,3.8vw,40px)", fontWeight:700, color:"rgba(255,255,255,0.45)", marginBottom:20, lineHeight:1 }}>
        ₹749 <span style={{ fontSize:14, fontWeight:400, color:"rgba(255,255,255,0.28)" }}>/lifetime</span>
      </div>

      <ul style={{ listStyle:"none", margin:"0 0 22px", flex:1, padding:0 }}>
        {["25 full JEE Main mocks","All PYQs 2019–2024","Premium analytics + mentor review","Priority WhatsApp mentor","Personalised revision strategy"].map(f => (
          <li key={f} style={{ padding:"6px 0", fontSize:"clamp(13px,1.5vw,14px)", color:"rgba(255,255,255,0.5)", display:"flex", alignItems:"flex-start", gap:10, lineHeight:1.5 }}>
            <span style={{ color:"#a78bfa", fontWeight:700, fontSize:12, marginTop:1, flexShrink:0 }}>✓</span> {f}
          </li>
        ))}
      </ul>

      <div style={{ height:1, background:"rgba(167,139,250,0.2)", marginBottom:20 }} />

      {status === "success" ? (
        <div style={{ background:"rgba(167,139,250,0.12)", border:"1px solid rgba(167,139,250,0.35)", borderRadius:12, padding:"20px 18px", textAlign:"center" as const }}>
          <div style={{ fontSize:24, marginBottom:10 }}>🎉</div>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, color:"#c4b5fd", fontSize:15, marginBottom:6 }}>You're on the list!</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.42)", lineHeight:1.7 }}>We'll email you the moment Elite launches — with early-bird pricing locked in for you.</div>
        </div>
      ) : (
        <>
          <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, letterSpacing:"2.5px", textTransform:"uppercase" as const, color:"#a78bfa", marginBottom:12 }}>Get notified at launch</div>
          <input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrorMsg("") }}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            style={{
              width:"100%", padding:"11px 14px", borderRadius:10, marginBottom:8,
              background:"rgba(255,255,255,0.07)", border:`1.5px solid ${errorMsg ? "#f87171" : "rgba(167,139,250,0.3)"}`,
              color:"#ffffff", fontSize:14, fontFamily:"'DM Sans',sans-serif",
              outline:"none", transition:"border-color .2s",
            }}
            onFocus={e => (e.target.style.borderColor = "rgba(167,139,250,0.75)")}
            onBlur={e => (e.target.style.borderColor = errorMsg ? "#f87171" : "rgba(167,139,250,0.3)")}
          />
          {errorMsg && <div style={{ fontSize:12, color:"#fca5a5", marginBottom:8, marginTop:-4 }}>{errorMsg}</div>}
          <button
            onClick={handleSubmit}
            disabled={status === "loading"}
            style={{
              width:"100%", padding:"13px", borderRadius:10,
              background: status === "loading" ? "rgba(124,58,237,0.45)" : "linear-gradient(135deg,#7c3aed,#a78bfa)",
              border:"none", color:"#fff", fontSize:14, fontWeight:700,
              fontFamily:"'DM Sans',sans-serif", cursor: status === "loading" ? "default" : "pointer",
              boxShadow:"0 4px 18px rgba(124,58,237,0.4)", transition:"opacity .15s,transform .15s",
            }}
          >
            {status === "loading" ? "Saving…" : "Notify Me When It Launches →"}
          </button>
          {status === "error" && <div style={{ marginTop:8, fontSize:12, color:"#fca5a5", textAlign:"center" as const }}>{errorMsg}</div>}
          <div style={{ marginTop:10, fontSize:11, color:"rgba(255,255,255,0.28)", fontFamily:"'DM Mono',monospace", textAlign:"center" as const }}>No spam · One email when Elite goes live</div>
        </>
      )}
    </div>
  )
}

export default function JEETLandingPage() {
  const router = useRouter()
  const timer = useCountdown()
  const seats = useSeatsLeft()
  const { scrollYProgress } = useScroll()
  const spring = useSpring(scrollYProgress, { stiffness: 100, damping: 28 })
  const progressWidth = useTransform(spring, [0, 1], ["0%", "100%"])

  const subjects = [
    { name: "Chemistry", percentile: 98.29, rank: "2%" },
    { name: "Physics",   percentile: 94.44, rank: "6%" },
    { name: "Maths",     percentile: 94.43, rank: "6%" },
  ]

  const testimonials = [
    {
      name: "Rahul Sharma",
      percentile: "95th percentile",
      quote: "JEET mocks felt exactly like the real exam. The interface, timing, difficulty — spot on. Went from 89 → 95 percentile in 3 weeks. Analytics helped me crush my Physics weak spots.",
      img: "/images/image1.jpg",
      result: "89 → 95 percentile",
    },
    {
      name: "Priya Singh",
      percentile: "97th percentile",
      quote: "After 10 mocks I finally knew exactly where I lost marks. My Organic Chemistry accuracy went from 40% to 78%. The step-by-step solutions are genuinely different.",
      img: "/images/image2.jpg",
      result: "91 → 97 percentile",
    },
    {
      name: "Arjun Kumar",
      percentile: "AIR 7,000",
      quote: "From AIR 18k → 7k in one month. Better question quality than my coaching test series. Every single rupee was worth it.",
      img: "/images/image3.jpg",
      result: "AIR 18,000 → 7,000",
    },
  ]

  const features = [
    { icon: "⏱", title: "Full JEE Pattern",        desc: "75Q · 3hrs · +4/−1 · Exact NTA pattern" },
    { icon: "📊", title: "Instant Analytics",       desc: "Score breakdown the moment you submit" },
    { icon: "📋", title: "Step-by-step Solutions",  desc: "Concept tag + formula + full explanation" },
    { icon: "📅", title: "PYQ Papers",              desc: "Past year papers in real exam interface" },
    { icon: "📈", title: "Percentile Benchmarking", desc: "See your rank vs every JEET test-taker" },
    { icon: "💬", title: "WhatsApp Mentor",          desc: "Direct access to Nathan for Pro+ plans" },
  ]

  const plans = [
    {
      id: "starter", name: "Starter", price: "₹249", tag: "/lifetime",
      comingSoon: false, featured: false,
      features: ["5 full JEE Main mocks", "5 PYQ papers with solutions", "Basic performance analytics", "Email support"],
      cta: "Get Starter", route: "/signup?plan=starter",
      couponHint: null,
    },
    {
      id: "pro", name: "Pro", price: "₹599", tag: "/lifetime",
      comingSoon: false, featured: true,
      features: ["15 full JEE Main mocks", "10 PYQ papers with video solutions", "Advanced analytics + rank predictor", "WhatsApp mentor access", "Topic-wise practise tests"],
      cta: "Get Pro — Most Popular", route: "/signup?plan=pro",
      couponHint: "Use PRO100 at signup → save ₹100",
    },
    {
      id: "elite", name: "Elite", price: "₹749", tag: "/lifetime",
      comingSoon: true, featured: false,
      features: ["25 full JEE Main mocks", "All PYQs 2019–2024", "Premium analytics + mentor review", "Priority WhatsApp mentor", "Personalised revision strategy"],
      cta: "Notify Me →", route: "/signup?plan=elite",
      couponHint: null,
    },
  ] as const

  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=Syne:wght@600;700;800&family=DM+Mono:wght@400;500&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
    body { font-family: 'DM Sans', sans-serif; background: #ffffff; color: #0f1733; -webkit-font-smoothing: antialiased; }
    ::selection { background: rgba(37,99,235,0.12); }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #c8d0e8; border-radius: 2px; }

    .progress-bar { position: fixed; top: 0; left: 0; height: 2.5px; background: linear-gradient(90deg,#1d4ed8,#60a5fa); z-index: 400; }

    /* NAV */
    .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 300; height: 58px; background: rgba(255,255,255,0.97); backdrop-filter: blur(24px); border-bottom: 1px solid #e2e6f3; display: flex; align-items: center; justify-content: space-between; padding: 0 clamp(16px,4vw,40px); }
    .nav-brand { display: flex; align-items: center; gap: 10px; cursor: pointer; background: none; border: none; }
    .nav-logo { width: 32px; height: 32px; background: linear-gradient(135deg,#1d4ed8,#3b82f6); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-family:'Syne',sans-serif; font-size: 13px; font-weight: 800; color: #fff; box-shadow: 0 2px 12px rgba(37,99,235,0.25); flex-shrink: 0; }
    .nav-wordmark { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 800; color: #0f1733; }
    .nav-wordmark span { color: #2563eb; }
    .nav-right { display: flex; align-items: center; gap: 6px; }
    .nav-link { padding: 7px 12px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #4a5580; cursor: pointer; border: none; background: transparent; font-family: 'DM Sans',sans-serif; transition: all .15s; white-space: nowrap; }
    .nav-link:hover { color: #0f1733; background: #f7f8fc; }
    .nav-cta { padding: 8px 16px; border-radius: 8px; background: linear-gradient(135deg,#1d4ed8,#3b82f6); border: none; font-family: 'DM Sans',sans-serif; font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; transition: all .15s; box-shadow: 0 4px 14px rgba(37,99,235,0.25); white-space: nowrap; }
    .nav-cta:hover { opacity: .88; transform: translateY(-1px); }
    .nav-register { padding: 8px 18px; border-radius: 8px; background: linear-gradient(135deg,#d97706,#f59e0b); border: none; font-family: 'DM Sans',sans-serif; font-size: 13px; font-weight: 700; color: #000; cursor: pointer; transition: all .15s; box-shadow: 0 4px 14px rgba(217,119,6,0.3); white-space: nowrap; }
    .nav-register:hover { opacity: .88; transform: translateY(-1px); }

    /* URGENCY BAR */
    .urgency-bar { background: linear-gradient(90deg,#1e3a8a,#1d4ed8); padding: 10px clamp(16px,4vw,40px); display: flex; align-items: center; justify-content: center; gap: clamp(8px,2vw,20px); flex-wrap: wrap; margin-top: 58px; }
    .urgency-bar-text { font-size: clamp(12px,1.5vw,13px); color: rgba(255,255,255,0.85); font-weight: 500; text-align: center; }
    .urgency-bar-timer { font-family: 'DM Mono',monospace; font-size: clamp(12px,1.5vw,14px); font-weight: 600; color: #fbbf24; background: rgba(251,191,36,0.15); border: 1px solid rgba(251,191,36,0.3); padding: 4px 12px; border-radius: 100px; white-space: nowrap; }
    .urgency-bar-wa { display: inline-flex; align-items: center; gap: 5px; background: #25D366; color: #fff; font-size: 12px; font-weight: 700; padding: 5px 12px; border-radius: 100px; text-decoration: none; transition: opacity .15s; white-space: nowrap; }
    .urgency-bar-wa:hover { opacity: .88; }

    /* ── HERO ── */
    .hero {
      position: relative;
      min-height: 100vh;
      display: flex;
      align-items: center;
      overflow: hidden;
      background: #ffffff;
    }
    .hero-inner {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      padding: clamp(90px,12vw,130px) clamp(16px,4vw,52px) 80px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 0;
    }
    .hero-left { max-width: 600px; }
    .hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 100px; padding: 7px 16px; font-family: 'DM Sans',sans-serif; font-size: clamp(12px,1.4vw,14px); font-weight: 600; color: #2563eb; margin-bottom: 24px; }
    .eyebrow-dot { width: 7px; height: 7px; border-radius: 50%; background: #2563eb; animation: blink 2s infinite; flex-shrink: 0; }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }

    .hero-h1 {
      font-family: 'Cormorant Garamond',serif;
      font-size: clamp(46px,7.5vw,88px);
      font-weight: 600;
      line-height: 0.96;
      letter-spacing: -2.5px;
      color: #0f1733;
      margin-bottom: 22px;
    }
    .hero-h1 em {
      font-style: italic;
      background: linear-gradient(135deg,#1d4ed8,#3b82f6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hero-sub {
      font-size: clamp(16px,1.9vw,19px);
      line-height: 1.75;
      color: #4a5580;
      max-width: 480px;
      margin-bottom: 32px;
      font-weight: 400;
    }
    .hero-sub strong { color: #0f1733; font-weight: 600; }

    .sproof { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; flex-wrap: wrap; }
    .sp-ava { display: flex; }
    .sp-av { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; border: 2.5px solid #fff; margin-left: -9px; flex-shrink: 0; box-shadow: 0 1px 4px rgba(0,0,0,0.12); }
    .sp-av:first-child { margin-left: 0; }
    .sp-av img { width: 100%; height: 100%; object-fit: cover; }
    .sp-text { font-size: clamp(12px,1.4vw,14px); color: #4a5580; }
    .sp-text strong { color: #0f1733; font-weight: 700; }

    .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
    .btn-primary { padding: clamp(13px,2vw,16px) clamp(20px,3vw,30px); border-radius: 10px; background: linear-gradient(135deg,#1d4ed8,#3b82f6); border: none; font-family: 'DM Sans',sans-serif; font-size: clamp(14px,1.6vw,16px); font-weight: 700; color: #fff; cursor: pointer; transition: transform .2s,opacity .2s; box-shadow: 0 6px 22px rgba(37,99,235,0.3); white-space: nowrap; }
    .btn-primary:hover { opacity: .88; transform: translateY(-2px); }
    .btn-secondary { padding: clamp(13px,2vw,16px) clamp(18px,2.5vw,24px); border-radius: 10px; background: transparent; border: 1.5px solid #c8d0e8; font-family: 'DM Sans',sans-serif; font-size: clamp(14px,1.6vw,16px); font-weight: 500; color: #4a5580; cursor: pointer; transition: all .2s; white-space: nowrap; }
    .btn-secondary:hover { color: #0f1733; border-color: #2563eb; transform: translateY(-2px); }

    /* ── SECTIONS ── */
    .page-body { background: #ffffff; }
    .section { max-width: 1060px; margin: 0 auto; padding: clamp(52px,7vw,84px) clamp(16px,4vw,40px); }
    .section-divider { max-width: 1060px; margin: 0 auto; padding: 0 clamp(16px,4vw,40px); }
    .divider-line { height: 1px; background: #e2e6f3; }
    .sec-label { font-family: 'DM Mono',monospace; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 2.5px; color: #2563eb; margin-bottom: 10px; }
    .sec-title { font-family: 'Cormorant Garamond',serif; font-size: clamp(30px,4.2vw,50px); font-weight: 600; color: #0f1733; letter-spacing: -1.2px; line-height: 1.08; margin-bottom: 36px; }
    .sec-title em { font-style: italic; background: linear-gradient(135deg,#1d4ed8,#3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }

    /* WHY NOW BLOCK */
    .urgency-block { background: #f0f5ff; border: 1.5px solid #bfdbfe; border-radius: 20px; padding: clamp(24px,4vw,52px); display: grid; grid-template-columns: 1fr 1fr; gap: clamp(20px,4vw,52px); align-items: start; position: relative; overflow: hidden; }
    .urgency-block::before { content:''; position:absolute; top:-80px; right:-80px; width:320px; height:320px; border-radius:50%; background:radial-gradient(circle,rgba(37,99,235,0.06),transparent 70%); pointer-events:none; }
    .ub-left-label { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:2.5px; text-transform:uppercase; color:#2563eb; margin-bottom:14px; }
    .ub-title { font-family:'Cormorant Garamond',serif; font-size:clamp(26px,3.2vw,42px); font-weight:600; color:#0f1733; line-height:1.07; letter-spacing:-1px; margin-bottom:16px; }
    .ub-title em { font-style:italic; background:linear-gradient(135deg,#1d4ed8,#3b82f6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .ub-body { font-size:clamp(14px,1.6vw,16px); color:#4a5580; line-height:1.85; }
    .ub-body strong { color:#0f1733; font-weight:600; }
    .ub-right { display:flex; flex-direction:column; gap:12px; }
    .ub-point { display:flex; align-items:flex-start; gap:14px; padding:16px 18px; background:#fff; border:1px solid #e2e6f3; border-radius:14px; transition:border-color .2s,transform .2s; }
    .ub-point:hover { border-color:#bfdbfe; transform:translateX(4px); }
    .ub-point-icon { font-size:18px; flex-shrink:0; margin-top:1px; }
    .ub-point-title { font-family:'Syne',sans-serif; font-size:14px; font-weight:700; color:#0f1733; margin-bottom:4px; }
    .ub-point-body { font-size:13px; color:#4a5580; line-height:1.6; }

    /* STATS */
    .stats-row { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:#e2e6f3; border:1px solid #e2e6f3; border-radius:14px; overflow:hidden; }
    .stat-cell { background:#f7f8fc; padding:clamp(20px,2.8vw,32px) clamp(14px,2vw,24px); transition:background .2s; }
    .stat-cell:hover { background:#eef1f9; }
    .stat-n { font-family:'DM Mono',monospace; font-size:clamp(22px,2.8vw,30px); color:#2563eb; line-height:1; margin-bottom:8px; }
    .stat-sfx { font-size:13px; color:#8892b8; }
    .stat-lbl { font-size:clamp(12px,1.3vw,14px); color:#4a5580; line-height:1.5; }

    /* SCORECARD */
    .scorecard { border:1px solid #e2e6f3; border-radius:18px; overflow:hidden; background:#f7f8fc; }
    .scorecard-header { padding:clamp(22px,3vw,42px) clamp(18px,3vw,46px); border-bottom:1px solid #e2e6f3; display:flex; align-items:flex-start; justify-content:space-between; gap:24px; flex-wrap:wrap; }
    .score-lbl { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#8892b8; margin-bottom:14px; }
    .score-main { font-family:'DM Mono',monospace; font-size:clamp(52px,7.5vw,78px); font-weight:300; color:#0f1733; line-height:1; letter-spacing:-3px; }
    .score-main .dec { font-size:clamp(30px,4.5vw,42px); }
    .score-main .sfx { font-size:clamp(15px,2vw,20px); color:#8892b8; letter-spacing:0; }
    .score-badge { display:inline-flex; align-items:center; gap:6px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:8px 14px; font-size:13px; font-weight:600; color:#2563eb; margin-top:16px; }
    .score-right-text { font-family:'Cormorant Garamond',serif; font-size:clamp(20px,2.8vw,26px); font-weight:500; color:#0f1733; line-height:1.42; max-width:240px; }
    .score-right-sub { font-size:13px; color:#4a5580; margin-top:10px; line-height:1.65; }
    .subj-row { display:grid; grid-template-columns:repeat(3,1fr); }
    .subj-cell { padding:clamp(18px,2.5vw,30px) clamp(16px,2.5vw,36px); border-right:1px solid #e2e6f3; transition:background .2s; }
    .subj-cell:last-child { border-right:none; }
    .subj-cell:hover { background:#eef1f9; }
    .subj-name { font-family:'DM Mono',monospace; font-size:10px; letter-spacing:2px; text-transform:uppercase; color:#8892b8; margin-bottom:12px; }
    .subj-pct { font-family:'DM Mono',monospace; font-size:clamp(26px,3.2vw,38px); font-weight:300; color:#2563eb; line-height:1; margin-bottom:12px; }
    .subj-bar-bg { height:3px; background:#c8d0e8; border-radius:2px; overflow:hidden; }
    .subj-bar-fill { height:100%; border-radius:2px; background:linear-gradient(90deg,#1d4ed8,#3b82f6); transform-origin:left; }
    .subj-rank { font-size:12px; color:#4a5580; margin-top:8px; font-family:'DM Mono',monospace; }

    /* ── TESTIMONIALS (bigger, photo-forward) ── */
    .tgrid { display:grid; grid-template-columns:repeat(3,1fr); gap:22px; margin-top:28px; }
    .tcard {
      background: #ffffff;
      border: 1.5px solid #e2e6f3;
      border-radius: 20px;
      padding: clamp(22px,2.8vw,32px);
      transition: all .25s;
      display: flex;
      flex-direction: column;
      gap: 0;
      position: relative;
      overflow: hidden;
    }
    .tcard::before {
      content: '"';
      position: absolute;
      top: 14px;
      right: 20px;
      font-family: 'Cormorant Garamond', serif;
      font-size: 100px;
      color: rgba(37,99,235,0.07);
      line-height: 1;
      font-weight: 700;
      pointer-events: none;
    }
    .tcard:hover {
      border-color: #bfdbfe;
      transform: translateY(-5px);
      box-shadow: 0 16px 36px -8px rgba(37,99,235,0.12);
    }
    /* Photo + name header */
    .tcard-head {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 18px;
    }
    .tcard-photo {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid #bfdbfe;
      flex-shrink: 0;
      box-shadow: 0 2px 10px rgba(37,99,235,0.15);
    }
    .tcard-name { font-family: 'Syne', sans-serif; font-weight: 700; color: #0f1733; font-size: 15px; margin-bottom: 2px; }
    .tcard-school { font-size: 12px; color: #8892b8; }
    /* Big quote */
    .tcard-quote {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(17px,2vw,21px);
      font-weight: 500;
      font-style: italic;
      color: #1e2a4a;
      line-height: 1.55;
      margin-bottom: 20px;
      flex: 1;
      position: relative;
      z-index: 1;
    }
    .tcard-result {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #f0fdf4;
      border: 1px solid #86efac;
      border-radius: 100px;
      padding: 6px 14px;
      font-family: 'DM Mono', monospace;
      font-size: 13px;
      font-weight: 600;
      color: #15803d;
    }
    .tcard-result::before { content: "↑"; font-size: 14px; }

    /* FEATURES */
    .features-grid { display:grid; grid-template-columns:1fr 1fr 1fr; gap:1px; background:#e2e6f3; border:1px solid #e2e6f3; border-radius:14px; overflow:hidden; }
    .feat-cell { background:#f7f8fc; padding:clamp(20px,2.5vw,28px) clamp(16px,2vw,26px); transition:background .2s; }
    .feat-cell:hover { background:#eef1f9; }
    .feat-icon { font-size:20px; margin-bottom:12px; }
    .feat-title { font-family:'Syne',sans-serif; font-size:clamp(14px,1.6vw,15px); font-weight:700; color:#0f1733; margin-bottom:8px; }
    .feat-desc { font-size:clamp(12px,1.4vw,14px); color:#4a5580; line-height:1.65; }

    /* COMPARISON */
    .compare-scroll { overflow-x:auto; -webkit-overflow-scrolling:touch; }
    .compare-table { width:100%; border-collapse:collapse; border:1px solid #e2e6f3; border-radius:14px; overflow:hidden; min-width:520px; }
    .compare-table th { background:#f7f8fc; padding:14px 18px; font-family:'DM Mono',monospace; font-size:10px; font-weight:500; text-transform:uppercase; letter-spacing:1.5px; color:#8892b8; border-bottom:1px solid #e2e6f3; text-align:left; }
    .compare-table th:not(:first-child) { text-align:center; }
    .compare-table td { padding:12px 18px; font-size:14px; color:#4a5580; border-bottom:1px solid #e2e6f3; background:#f7f8fc; }
    .compare-table tr:last-child td { border-bottom:none; }
    .compare-table tr:hover td { background:#eef1f9; }
    .compare-table td:not(:first-child) { text-align:center; }
    .td-check { color:#2e7d32; font-weight:700; font-size:15px; }
    .td-x { color:#dc2626; font-weight:700; }
    .td-val { font-family:'DM Mono',monospace; font-size:12px; color:#0f1733; }
    .td-hl { background:rgba(37,99,235,0.04) !important; }
    .compare-table tr:hover .td-hl { background:rgba(37,99,235,0.07) !important; }

    /* PRICING */
    .pricing-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:32px; }
    .pcard { background:#ffffff; border:1.5px solid #e2e6f3; border-radius:20px; padding:clamp(22px,3vw,32px) clamp(18px,2.5vw,26px); transition:all .2s; position:relative; display:flex; flex-direction:column; }
    .pcard:hover { border-color:#bfdbfe; transform:translateY(-5px); box-shadow:0 16px 36px -8px rgba(37,99,235,0.15); }
    .pcard.pop { border:2px solid #2563eb; background:#f0f5ff; }
    .pop-badge { position:absolute; top:-13px; left:50%; transform:translateX(-50%); background:linear-gradient(135deg,#1d4ed8,#3b82f6); color:#fff; font-size:11px; font-weight:700; padding:5px 16px; border-radius:30px; white-space:nowrap; letter-spacing:.4px; }
    .seats-badge { position:absolute; top:-13px; right:16px; background:#dc2626; color:#fff; font-size:10px; font-weight:700; padding:4px 11px; border-radius:20px; white-space:nowrap; animation:seatsFlash 2.5s ease-in-out infinite; }
    @keyframes seatsFlash { 0%,100%{opacity:1} 50%{opacity:.65} }
    .pname { font-family:'Syne',sans-serif; font-size:20px; font-weight:700; color:#0f1733; margin-bottom:8px; }
    .pprice { font-size:clamp(30px,3.8vw,40px); font-weight:700; color:#0f1733; margin-bottom:20px; line-height:1; }
    .pprice span { font-size:14px; font-weight:400; color:#8892b8; }
    .pfeats { list-style:none; margin:20px 0 26px; flex:1; }
    .pfeats li { padding:7px 0; font-size:clamp(13px,1.5vw,14px); color:#4a5580; display:flex; align-items:flex-start; gap:10px; line-height:1.5; }
    .pfeats li::before { content:"✓"; color:#2563eb; font-weight:700; font-size:12px; flex-shrink:0; margin-top:1px; }
    .pbtn { width:100%; padding:13px; border-radius:11px; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:all .15s; }
    .pbtn-outline { background:transparent; border:1.5px solid #2563eb; color:#2563eb; }
    .pbtn-outline:hover { background:#2563eb; color:#fff; }
    .pbtn-solid { background:linear-gradient(135deg,#1d4ed8,#3b82f6); border:none; color:#fff; box-shadow:0 6px 20px rgba(37,99,235,0.3); }
    .pbtn-solid:hover { opacity:.88; transform:translateY(-1px); }
    .pbtn-coming { background:rgba(124,58,237,0.08); border:1.5px dashed rgba(124,58,237,0.35); color:#7c3aed; cursor:default; opacity:.7; }

    /* TRUST BAR */
    .trust-bar { display:flex; gap:10px; flex-wrap:wrap; justify-content:center; margin-top:28px; }
    .tbadge { display:inline-flex; align-items:center; gap:7px; background:#f7f8fc; border:1px solid #e2e6f3; border-radius:100px; padding:8px 16px; font-size:clamp(12px,1.4vw,14px); font-weight:500; color:#4a5580; }

    /* SEATS URGENCY */
    .seats-urgency { display:inline-flex; align-items:center; gap:8px; background:#fff5f5; border:1px solid #fecaca; border-radius:100px; padding:7px 16px; font-size:13px; font-weight:600; color:#dc2626; margin-bottom:24px; animation:seatsFlash 2.5s ease-in-out infinite; }
    .su-dot { width:6px; height:6px; background:#dc2626; border-radius:50%; flex-shrink:0; animation:blink 1.5s infinite; }

    /* CONTACT */
    .contact-row { display:flex; gap:14px; flex-wrap:wrap; }
    .contact-chip { display:inline-flex; align-items:center; gap:9px; background:#f7f8fc; border:1px solid #e2e6f3; border-radius:11px; padding:14px 20px; font-family:'DM Sans',sans-serif; font-size:15px; font-weight:500; color:#0f1733; text-decoration:none; transition:all .2s; cursor:pointer; }
    .contact-chip:hover { border-color:#2563eb; color:#2563eb; background:#eff6ff; transform:translateY(-2px); box-shadow:0 4px 14px rgba(37,99,235,0.1); }
    .wa-chip { background:#f0fdf4; border-color:#bbf7d0; color:#166534; }
    .wa-chip:hover { background:#dcfce7; border-color:#86efac; color:#166534; }

    /* MANIFESTO */
    .manifesto { background:linear-gradient(135deg,#1e3a8a,#1d4ed8,#2563eb); border-radius:22px; padding:clamp(40px,5.5vw,68px) clamp(28px,5vw,64px); position:relative; overflow:hidden; }
    .manifesto::after { content:''; position:absolute; bottom:-60px; left:-60px; width:300px; height:300px; border-radius:50%; background:radial-gradient(circle,rgba(255,255,255,0.07),transparent 70%); pointer-events:none; }
    .manifesto-body { font-family:'Cormorant Garamond',serif; font-size:clamp(22px,3.2vw,36px); font-weight:500; color:#ffffff; line-height:1.48; letter-spacing:-.4px; max-width:700px; margin-bottom:22px; position:relative; z-index:1; }
    .manifesto-body em { font-style:italic; color:#bfdbfe; }
    .manifesto-attr { font-family:'DM Sans',sans-serif; font-size:14px; color:rgba(255,255,255,0.55); position:relative; z-index:1; }

    /* CTA */
    .cta-section { text-align:center; padding:clamp(64px,8vw,96px) clamp(16px,4vw,40px) clamp(80px,10vw,110px); }
    .cta-eyebrow { font-family:'DM Mono',monospace; font-size:11px; letter-spacing:2.5px; text-transform:uppercase; color:#8892b8; margin-bottom:20px; }
    .cta-title { font-family:'Cormorant Garamond',serif; font-size:clamp(34px,5.5vw,60px); font-weight:600; color:#0f1733; letter-spacing:-2px; line-height:1.06; margin-bottom:16px; }
    .cta-title em { font-style:italic; background:linear-gradient(135deg,#1d4ed8,#3b82f6); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .cta-sub { font-size:clamp(15px,1.8vw,18px); color:#4a5580; margin-bottom:30px; }
    .cta-btns { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
    .cta-note { margin-top:20px; font-size:12px; color:#8892b8; font-family:'DM Mono',monospace; }

    /* PROOF FRAME */
    .proof-wrap { border:1px solid #e2e6f3; border-radius:18px; overflow:hidden; background:#f7f8fc; }
    .proof-header { padding:18px 22px; border-bottom:1px solid #e2e6f3; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px; }
    .proof-badge { display:inline-flex; align-items:center; gap:7px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:6px 12px; font-family:'DM Mono',monospace; font-size:11px; color:#2563eb; }
    .proof-dot { width:7px; height:7px; border-radius:50%; background:#2563eb; }
    .proof-frame { position:relative; width:100%; height:clamp(280px,50vw,500px); background:#eef1f9; }
    .proof-frame iframe { width:100%; height:100%; border:none; }
    .proof-corner { position:absolute; bottom:14px; right:14px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:8px 14px; font-family:'DM Mono',monospace; font-size:11px; color:#2563eb; pointer-events:none; }

    /* FOOTER */
    .footer { border-top:1px solid #e2e6f3; padding:clamp(22px,3vw,30px) clamp(16px,4vw,40px); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:14px; }
    .footer-brand { font-family:'Syne',sans-serif; font-size:16px; font-weight:800; color:#0f1733; background:none; border:none; cursor:pointer; }
    .footer-brand span { color:#2563eb; }
    .footer-links { display:flex; align-items:center; gap:16px; flex-wrap:wrap; }
    .footer-link { color:#4a5580; text-decoration:none; cursor:pointer; background:none; border:none; font-family:'DM Sans',sans-serif; font-size:14px; transition:color .2s; }
    .footer-link:hover { color:#2563eb; }
    .footer-r { font-family:'DM Sans',sans-serif; font-size:13px; color:#8892b8; }

    /* RESPONSIVE */
    @media(max-width:1000px) {
      .hero-inner { grid-template-columns: 1fr; }
    }
    @media(max-width:900px) {
      .urgency-block { grid-template-columns:1fr; }
      .stats-row { grid-template-columns:1fr 1fr; }
      .tgrid { grid-template-columns:1fr; }
      .pricing-grid { grid-template-columns:1fr; }
      .features-grid { grid-template-columns:1fr 1fr; }
      .subj-row { grid-template-columns:1fr; }
      .subj-cell { border-right:none; border-bottom:1px solid #e2e6f3; }
      .subj-cell:last-child { border-bottom:none; }
      .scorecard-header { flex-direction:column; }
    }
    @media(max-width:600px) {
      .nav-link { display:none; }
      .nav-register { display:none; }
      .features-grid { grid-template-columns:1fr; }
      .hero-btns { flex-direction:column; align-items:stretch; }
      .btn-primary,.btn-secondary { text-align:center; }
      .footer { flex-direction:column; text-align:center; }
      .footer-links { justify-content:center; }
      .cta-btns { flex-direction:column; align-items:stretch; }
    }
  `

  // Social proof avatar images — local public folder
  const spAvatars = [
    "/images/image1.jpg",
    "/images/image2.jpg",
    "/images/image3.jpg",
    "/images/image1.jpg",
  ]

  return (
    <>
      <style>{CSS}</style>
      <motion.div className="progress-bar" style={{ width: progressWidth }} />

      {/* NAV */}
      <motion.nav className="nav" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5, ease: easing }}>
        <button className="nav-brand" onClick={() => router.push("/")}>
          <div className="nav-logo">J</div>
          <span className="nav-wordmark">JEET<span>.</span></span>
        </button>
        <div className="nav-right">
          <button className="nav-link" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>Pricing</button>
          <button className="nav-link" onClick={() => router.push("/login")}>Sign In</button>
          <button className="nav-register" onClick={() => router.push("/signup")}>Register Now →</button>
          <button className="nav-cta" onClick={() => router.push("/practise")}>Start Free Test</button>
        </div>
      </motion.nav>

      {/* URGENCY BAR */}
      <motion.div className="urgency-bar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <span className="urgency-bar-text">⚡ Only <strong style={{ color: "#fff" }}>{seats} seats</strong> left at current prices — offer ends in</span>
        <span className="urgency-bar-timer">{timer.h}:{timer.m}:{timer.s}</span>
        <a className="urgency-bar-wa" href="https://wa.me/919175045769?text=Hi%20Nathan%2C%20I%20have%20a%20question%20about%20JEET" target="_blank" rel="noopener noreferrer">
          💬 WhatsApp Us
        </a>
      </motion.div>

      {/* ── HERO ── */}
      <section className="hero">
        {/* Student image on the right, mirrored to face left (toward content) */}
        <HeroStudentImage />

        {/* Subtle particle bg via CSS */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 70% at 20% 55%, rgba(219,234,254,0.35) 0%, transparent 70%)", zIndex: 0, pointerEvents: "none" }} />

        <div className="hero-inner">
          <div className="hero-left">
            <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
              <div className="hero-eyebrow"><span className="eyebrow-dot" />Built by a 96.93%ile JEE scorer</div>
            </motion.div>

            <motion.h1 className="hero-h1" variants={fadeUp} initial="hidden" animate="visible" custom={1}>
              Improve your JEE<br />percentile in the<br /><em>final 2 weeks.</em>
            </motion.h1>

            <motion.p className="hero-sub" variants={fadeUp} initial="hidden" animate="visible" custom={2}>
              Full-length mocks that feel exactly like the real exam —{" "}
              <strong>same interface, same pressure, same pattern.</strong>{" "}
              Built by someone who's been where you are.
            </motion.p>

            {/* Social proof with real photos */}
            <motion.div className="sproof" variants={fadeUp} initial="hidden" animate="visible" custom={2.5}>
              <div className="sp-ava">
                {spAvatars.map((src, i) => (
                  <div key={i} className="sp-av">
                    <img src={src} alt="" />
                  </div>
                ))}
              </div>
              <span className="sp-text"><strong>1,200+</strong> JEE aspirants have taken mocks on JEET</span>
            </motion.div>

            <motion.div className="hero-btns" variants={fadeUp} initial="hidden" animate="visible" custom={3}>
              <button className="btn-primary" onClick={() => router.push("/practise")}>Start Free Mock Test →</button>
              <button className="btn-secondary" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>See Plans</button>
            </motion.div>
          </div>

          {/* Right col is empty — HeroStudentImage fills it absolutely */}
          <div />
        </div>
      </section>

      <div className="page-body">

        {/* WHY NOW */}
        <div className="section">
          <Reveal variant={scaleIn}>
            <div className="urgency-block">
              <div>
                <div className="ub-left-label">Why the last 2 weeks</div>
                <div className="ub-title">Theory won't move<br />your rank. <em>Mocks will.</em></div>
                <div className="ub-body">
                  Students who complete <strong>6–10 full mocks in the final fortnight</strong> consistently outperform those who spend the same time on revision. You already know the content. What shifts your percentile now is exam conditioning — speed, calm under pressure, and knowing exactly where marks are slipping.<br /><br />
                  That's what JEET is built for. <strong>Starting at ₹249.</strong>
                </div>
              </div>
              <div className="ub-right">
                {[
                  { icon: "⚡", title: "Know your weak spots immediately", body: "After every mock, see exactly where you're losing marks by subject, topic and question type." },
                  { icon: "📊", title: "Track your live percentile",        body: "See how you rank against every JEET test-taker after each paper — not just your raw score." },
                  { icon: "🎯", title: "Calibrated to NTA difficulty",       body: "The exact difficulty spread you'll face on exam day — not easier, not harder." },
                  { icon: "💸", title: "₹249 for 5 mocks + 5 PYQs",         body: "Less than a single coaching session. No subscriptions. No compromises." },
                ].map((p, i) => (
                  <motion.div className="ub-point" key={p.title} initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1, duration: 0.5, ease: easing }} viewport={{ once: true }}>
                    <span className="ub-point-icon">{p.icon}</span>
                    <div>
                      <div className="ub-point-title">{p.title}</div>
                      <div className="ub-point-body">{p.body}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="section-divider"><div className="divider-line" /></div>

        {/* STATS */}
        <div className="section">
          <Reveal>
            <div className="stats-row">
              {[
                { n: "96.93", sfx: "%ile", lbl: "Founder Percentile" },
                { n: "Top 3%", sfx: "",    lbl: "of all JEE candidates" },
                { n: "₹249",   sfx: "",    lbl: "Starter — 5 mocks + PYQs" },
                { n: "2 wks",  sfx: "",    lbl: "to shift your percentile" },
              ].map((s, i) => (
                <motion.div key={s.lbl} className="stat-cell" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
                  <div className="stat-n">{s.n}<span className="stat-sfx">{s.sfx}</span></div>
                  <div className="stat-lbl">{s.lbl}</div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="section-divider"><div className="divider-line" /></div>

        {/* SCORECARD */}
        <div className="section">
          <Reveal>
            <div className="sec-label">Founder Credentials</div>
            <div className="sec-title">JEE Main 2024 <em>Scorecard</em></div>
          </Reveal>
          <Reveal variant={scaleIn} custom={0.1}>
            <div className="scorecard">
              <div className="scorecard-header">
                <div>
                  <div className="score-lbl">Overall Percentile — JEE Main 2024</div>
                  <div className="score-main">96<span className="dec">.93</span><span className="sfx"> %ile</span></div>
                  <div className="score-badge">🏆 Top 3% of all JEE Main 2024 candidates</div>
                </div>
                <div>
                  <div className="score-right-text">JEET is built by someone who actually cracked JEE.</div>
                  <div className="score-right-sub">Out of 1 million+ JEE Main 2024 candidates. Not theory — real experience.</div>
                </div>
              </div>
              <div className="subj-row">
                {subjects.map((s, i) => (
                  <motion.div key={s.name} className="subj-cell" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.1, duration: 0.5, ease: easing }} viewport={{ once: true }}>
                    <div className="subj-name">{s.name}</div>
                    <div className="subj-pct">{s.percentile}<span style={{ fontSize: 15, color: "#8892b8" }}> %ile</span></div>
                    <div className="subj-bar-bg">
                      <motion.div className="subj-bar-fill" initial={{ scaleX: 0 }} whileInView={{ scaleX: s.percentile / 100 }} transition={{ delay: 0.3 + i * 0.12, duration: 1.2, ease: easing }} viewport={{ once: true }} />
                    </div>
                    <div className="subj-rank">Top {s.rank} nationwide</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <div className="section-divider"><div className="divider-line" /></div>

        {/* PROOF */}
        <div className="section">
          <Reveal>
            <div className="sec-label">Official Document</div>
            <div className="sec-title">NTA <em>Verified</em> Result</div>
          </Reveal>
          <Reveal variant={scaleIn} custom={0.1}>
            <div className="proof-wrap">
              <div className="proof-header">
                <div className="proof-badge"><span className="proof-dot" />Verified by NTA · 12-02-2024</div>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#8892b8" }}>JEE MAIN 2024 · SESSION 1 · OFFICIAL SCORECARD</span>
              </div>
              <div className="proof-frame">
                <iframe src="/jee.pdf" title="NTA JEE Main 2024 Official Scorecard" />
                <div className="proof-corner">NTA SCORE · 96.9383863</div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="section-divider"><div className="divider-line" /></div>

        {/* TESTIMONIALS */}
        <div className="section">
          <Reveal>
            <div className="sec-label">Real Results</div>
            <div className="sec-title">Students who <em>improved</em> with JEET</div>
          </Reveal>
          <div className="tgrid">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} variant={fadeUp} custom={i * 0.1}>
                <div className="tcard">
                  <div className="tcard-head">
                    <img className="tcard-photo" src={t.img} alt={t.name} />
                    <div>
                      <div className="tcard-name">{t.name}</div>
                      <div className="tcard-school">{t.percentile}</div>
                    </div>
                  </div>
                  <p className="tcard-quote">{t.quote}</p>
                  <div className="tcard-result">{t.result}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="section-divider"><div className="divider-line" /></div>

        {/* FEATURES */}
        <div className="section">
          <Reveal>
            <div className="sec-label">The Platform</div>
            <div className="sec-title">Everything you need,<br /><em>nothing you don't.</em></div>
          </Reveal>
          <Reveal variant={scaleIn}>
            <div className="features-grid">
              {features.map((f, i) => (
                <motion.div key={f.title} className="feat-cell" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07, duration: 0.45, ease: easing }} viewport={{ once: true }} whileHover={{ scale: 1.02 }}>
                  <div className="feat-icon">{f.icon}</div>
                  <div className="feat-title">{f.title}</div>
                  <div className="feat-desc">{f.desc}</div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>

        <div className="section-divider"><div className="divider-line" /></div>

        {/* COMPARISON */}
        <div className="section">
          <Reveal>
            <div className="sec-label">Why Choose JEET</div>
            <div className="sec-title">JEET vs <em>Everything Else</em></div>
          </Reveal>
          <Reveal variant={scaleIn}>
            <div className="compare-scroll">
              <table className="compare-table">
                <thead>
                  <tr>
                    <th style={{ width: "40%" }}>Feature</th>
                    <th style={{ color: "#2563eb" }}>JEET ⭐</th>
                    <th>Coaching Series</th>
                    <th>Random Free Tests Online</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Real JEE exam interface",            true,  false, false],
                    ["Instant analytics + rank predictor", true,  false, false],
                    ["NTA-calibrated questions",           true,  true,  false],
                    ["Built by 96.93%ile scorer",          true,  false, false],
                    ["Lifetime access",                    true,  false, true ],
                    ["WhatsApp mentor access",             true,  false, false],
                    ["Price",                              "₹249–₹749", "₹15k–₹50k+", "Free"],
                  ].map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500, color: "#0f1733" }}>{row[0]}</td>
                      {[1, 2, 3].map(ci => {
                        const val = row[ci]; const isJeet = ci === 1
                        const cls = isJeet ? "td-hl" : ""
                        if (val === true)  return <td key={ci} className={cls}><span className="td-check">✓</span></td>
                        if (val === false) return <td key={ci} className={cls}><span className="td-x">✗</span></td>
                        return <td key={ci} className={`td-val ${cls}`}>{val}</td>
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>

        <div className="section-divider"><div className="divider-line" /></div>

        {/* PRICING */}
        <div className="section" id="pricing">
          <Reveal>
            <div className="sec-label">Simple Pricing</div>
            <div className="sec-title">Serious prep.<br /><em>Fair price.</em></div>
            <div className="seats-urgency"><span className="su-dot" />Only {seats} seats left at this price · Offer ends in {timer.h}:{timer.m}:{timer.s}</div>
          </Reveal>
          <div className="pricing-grid">
            {plans.filter(p => !p.comingSoon).map((p, i) => (
              <Reveal key={p.id} variant={scaleIn} custom={i * 0.08}>
                <div className={`pcard ${p.featured ? "pop" : ""}`}>
                  {p.featured && <div className="pop-badge">🔥 Most Popular</div>}
                  {p.featured && <div className="seats-badge">⚡ {seats} seats left</div>}
                  <div className="pname">{p.name}</div>
                  <div className="pprice">{p.price} <span>{p.tag}</span></div>
                  <ul className="pfeats">
                    {p.features.map(f => <li key={f}>{f}</li>)}
                  </ul>
                  {p.couponHint && (
                    <div style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(217,119,6,0.08)", border: "1px solid rgba(217,119,6,0.25)", borderRadius: 10, padding: "9px 14px", marginBottom: 14, fontSize: 13, color: "#b45309", fontFamily: "'DM Mono',monospace", fontWeight: 600 }}>
                      🏷 {p.couponHint}
                    </div>
                  )}
                  <button
                    className={`pbtn ${p.featured ? "pbtn-solid" : "pbtn-outline"}`}
                    onClick={() => router.push(p.route)}
                  >
                    {p.cta}
                  </button>
                </div>
              </Reveal>
            ))}
            {/* Elite — coming soon with waitlist */}
            <Reveal variant={scaleIn} custom={0.16}>
              <EliteNotifyCard />
            </Reveal>
          </div>
          <div className="trust-bar">
            {["🔒 Razorpay Secure", "💳 UPI / Card / Netbanking", "↩ 7-day refund policy", "✓ No subscription, ever"].map(b => (
              <span key={b} className="tbadge">{b}</span>
            ))}
          </div>
        </div>

        <div className="section-divider"><div className="divider-line" /></div>

        {/* CONTACT */}
        <div className="section">
          <Reveal>
            <div className="sec-label">Reach Out</div>
            <div className="sec-title">Questions? <em>We're here.</em></div>
          </Reveal>
          <Reveal custom={0.1}>
            <div className="contact-row">
              <a className="contact-chip" href="mailto:nathan.j.diniz@gmail.com">✉ nathan.j.diniz@gmail.com</a>
              <a className="contact-chip wa-chip" href="https://wa.me/919175045769?text=Hi%20Nathan%2C%20I%20have%20a%20question%20about%20JEET" target="_blank" rel="noopener noreferrer">💬 WhatsApp +91 91750 45769</a>
            </div>
            <p style={{ marginTop: 12, fontSize: 13, color: "#8892b8" }}>↳ WhatsApp opens a pre-filled message — your number stays private until you send</p>
          </Reveal>
        </div>

        <div className="section-divider"><div className="divider-line" /></div>

        {/* MANIFESTO */}
        <div className="section">
          <Reveal variant={scaleIn}>
            <div className="manifesto">
              <div className="manifesto-body">
                The last <em>2 weeks</em> before JEE aren't about learning more — they're about executing better under pressure. Mocks don't just prepare you. Done right, they <em>transform</em> you.
              </div>
              <div className="manifesto-attr">— Nathan Joseph Diniz · Founder, JEET · JEE Main 2024 · 96.93 %ile</div>
            </div>
          </Reveal>
        </div>

        {/* CTA */}
        <div className="cta-section">
          <Reveal>
            <div className="cta-eyebrow">You've got time — use it well</div>
            <div className="cta-title">Your best mocks<br />are <em>ahead of you.</em></div>
            <div className="cta-sub">Start free. No pressure. Upgrade when you're ready.</div>
            <div className="cta-btns">
              <button className="btn-primary" style={{ fontSize: 17, padding: "16px 32px" }} onClick={() => router.push("/practise")}>✦ Start Free Mock Test</button>
              <button className="btn-primary" style={{ fontSize: 17, padding: "16px 32px", background: "linear-gradient(135deg,#d97706,#f59e0b)" }} onClick={() => router.push("/signup?plan=pro")}>Get Pro — ₹599 →</button>
            </div>
            <div className="cta-note">Starter ₹249 · Pro ₹599 · Elite ₹749 · No subscription, ever</div>
          </Reveal>
        </div>
            {/* FEEDBACK */}
<div className="section-divider"><div className="divider-line" /></div>

<div className="section">
  <Reveal>
    <div className="sec-label">Help Us Improve</div>
    <div className="sec-title">Got feedback? <em>We read every response.</em></div>
    <p style={{ fontSize: "clamp(15px,1.7vw,17px)", color: "#4a5580", lineHeight: 1.8, maxWidth: 560, marginBottom: 32 }}>
      Tell us what's working, what's missing, or what would make JEET a no-brainer for you. Takes 2 minutes — genuinely shapes what we build next.
    </p>
  </Reveal>
  <Reveal variant={scaleIn} custom={0.1}>
    <div style={{
      border: "1.5px solid #e2e6f3",
      borderRadius: 20,
      overflow: "hidden",
      background: "#f7f8fc",
    }}>
      <div style={{
        padding: "16px 22px",
        borderBottom: "1px solid #e2e6f3",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap" as const,
        gap: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#2563eb", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 6, padding: "6px 12px" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#2563eb", display: "inline-block" }} />
          Share your thoughts
        </div>
        <span style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: "#8892b8" }}>Anonymous · Takes ~2 min</span>
      </div>
      <div style={{ position: "relative", width: "100%", height: "clamp(520px,70vw,680px)" }}>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfQqc51zPijbxDUFYimXciYw20h0tic2_1xG1A2fyzIkhTD-w/viewform?usp=sharing&ouid=107863737992704627144"
          style={{ width: "100%", height: "100%", border: "none" }}
          title="JEET Feedback Form"
        >
          Loading…
        </iframe>
      </div>
    </div>
  </Reveal>
</div>
        {/* FOOTER */}
        <footer className="footer">
          <button className="footer-brand" onClick={() => router.push("/")}>JEET<span>.</span></button>
          <div className="footer-links">
            <button className="footer-link" onClick={() => router.push("/privacy-policy")}>Privacy</button>
            <button className="footer-link" onClick={() => router.push("/terms-of-use")}>Terms</button>
            <button className="footer-link" onClick={() => router.push("/refund-policy")}>Refund</button>
            <a className="footer-link" href="https://wa.me/919175045769" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
            <span style={{ fontSize: 13, color: "#8892b8" }}>📍 Electronic City, Bangalore 560100</span>
          </div>
          <div className="footer-r">© 2025 JEET</div>
        </footer>
      </div>
    </>
  )
}

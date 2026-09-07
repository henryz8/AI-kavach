import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  Activity, AlertTriangle, ArrowUpRight, Bell, BrainCircuit, Check,
  ChevronDown, CircleHelp, FileWarning, Fingerprint, Globe2, LayoutDashboard,
  LockKeyhole, LogOut, Menu, MessageSquareWarning, Network, Search, Settings,
  ShieldCheck, ShieldAlert, Smartphone, Sparkles, UserRound, UserPlus, Users, X, LogIn, Chrome, Github,
  Zap, ExternalLink
} from "lucide-react";
import {
  AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell
} from "recharts";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import "./index.css";

const purple = "#8049D9";
const data = [
  { name: "00", threats: 18 }, { name: "04", threats: 31 }, { name: "08", threats: 25 },
  { name: "12", threats: 48 }, { name: "16", threats: 39 }, { name: "20", threats: 63 },
  { name: "24", threats: 51 }, { name: "28", threats: 72 }
];
const riskData = [
  { name: "Critical", value: 24, color: "#ff6b81" },
  { name: "High", value: 86, color: "#f4b860" },
  { name: "Medium", value: 214, color: "#a98be8" },
  { name: "Safe", value: 960, color: "#4dd59a" }
];

const threats = [
  { icon: Globe2, title: "Phishing website", source: "login-secure-account.xyz", score: 94, level: "CRITICAL", action: "Block URL" },
  { icon: LockKeyhole, title: "Account takeover", source: "New device + unusual location", score: 87, level: "HIGH", action: "Revoke session" },
  { icon: UserRound, title: "Digital impersonation", source: "Fake executive communication", score: 92, level: "CRITICAL", action: "Alert admin" },
  { icon: FileWarning, title: "Malicious attachment", source: "invoice_2026.zip", score: 76, level: "HIGH", action: "Quarantine" }
];

function Card({ children, className = "", onClick }) {
  return (
    <div onClick={onClick} className={`rounded-[26px] border border-white/[0.07] bg-[#141414] ${className}`}>
      {children}
    </div>
  );
}

function RiskBadge({ level }) {
  const map = {
    CRITICAL: "bg-[#ff6b81]/10 text-[#ff8799]",
    HIGH: "bg-[#f4b860]/10 text-[#f4b860]",
    MEDIUM: "bg-[#a98be8]/10 text-[#b99dec]",
    SAFE: "bg-[#4dd59a]/10 text-[#5fe0a5]"
  };
  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[.12em] ${map[level]}`}>{level}</span>;
}

const demoUser = {
  name: "Security Analyst",
  email: "analyst@cybershield.ai",
  password: "shield2026"
};

function AuthScreen({ onLogin, onEmailAuth, onGoogleLogin, onGithubLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (isSupabaseConfigured) {
      setError("");
      try {
        await onEmailAuth({
          mode,
          name: name.trim(),
          email: normalizedEmail,
          password
        });
      } catch (authError) {
        setError(authError.message || "Authentication failed. Please try again.");
      }
      return;
    }

    const users = JSON.parse(localStorage.getItem("cybershield-users") || "[]");
    const knownUsers = [demoUser, ...users];

    if ((mode === "register" && !name.trim()) || !normalizedEmail || !password) {
      setError(mode === "register" ? "Enter your name, email, and password to continue." : "Enter your email and password to continue.");
      return;
    }

    if (mode === "register") {
      if (password.length < 8) {
        setError("Use a password with at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Your passwords do not match.");
        return;
      }
      if (knownUsers.some(user => user.email === normalizedEmail)) {
        setError("An account with this email already exists. Sign in instead.");
        return;
      }
      localStorage.setItem("cybershield-users", JSON.stringify([...users, { name: name.trim(), email: normalizedEmail, password }]));
    } else if (!knownUsers.some(user => user.email === normalizedEmail && user.password === password)) {
      setError("Those credentials do not match this demo workspace.");
      return;
    }

    localStorage.setItem("cybershield-auth", "true");
    onLogin();
  };

  const switchMode = () => {
    setMode(value => value === "login" ? "register" : "login");
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleOAuth = async (login) => {
    setError("");
    try {
      await login();
    } catch (oauthError) {
      setError(oauthError.message || "Social sign-in could not be started.");
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#090909] px-5 py-10 text-[#ebe6e7]">
      <div className="fixed inset-0 pointer-events-none opacity-40 grid-bg" />
      <div className="relative w-full max-w-[430px]">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#3d2eb1] shadow-[0_0_35px_rgba(61,46,177,.35)]"><ShieldCheck size={22} /></div>
          <div><div className="text-sm font-black tracking-tight">AI KAVACH</div><div className="text-[10px] font-bold tracking-[.28em] text-[#8f8b8d]">THREAT DEFENSE</div></div>
        </div>
        <div className="rounded-[28px] border border-white/[.08] bg-[#141414] p-6 shadow-2xl sm:p-8">
          <div className="mb-7">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#a78ce9]">Secure access</div>
            <h1 className="text-2xl font-semibold tracking-[-.03em]">{mode === "login" ? "Welcome back, Analyst" : "Create your workspace"}</h1>
            <p className="mt-2 text-sm leading-6 text-[#777477]">{mode === "login" ? "Sign in to monitor threats and protect your workspace." : "Register an account to start monitoring your security environment."}</p>
          </div>
          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && <label className="block text-xs font-semibold text-[#aaa6a8]">Full name
              <input value={name} onChange={event => { setName(event.target.value); setError(""); }} type="text" autoComplete="name" placeholder="Your name" className="mt-2 w-full rounded-2xl border border-white/[.08] bg-white/[.025] px-4 py-3 text-sm text-white outline-none placeholder:text-[#555155] focus:border-[#8049D9]/70" required />
            </label>}
            <label className="block text-xs font-semibold text-[#aaa6a8]">Work email
              <input value={email} onChange={event => { setEmail(event.target.value); setError(""); }} type="email" autoComplete="email" placeholder="analyst@company.com" className="mt-2 w-full rounded-2xl border border-white/[.08] bg-white/[.025] px-4 py-3 text-sm text-white outline-none placeholder:text-[#555155] focus:border-[#8049D9]/70" required />
            </label>
            <label className="block text-xs font-semibold text-[#aaa6a8]">Password
              <div className="relative mt-2">
                <input value={password} onChange={event => { setPassword(event.target.value); setError(""); }} type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="Enter your password" className="w-full rounded-2xl border border-white/[.08] bg-white/[.025] px-4 py-3 pr-20 text-sm text-white outline-none placeholder:text-[#555155] focus:border-[#8049D9]/70" required />
                <button type="button" onClick={() => setShowPassword(value => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 px-1 text-[10px] font-bold uppercase tracking-[.12em] text-[#8f8b8d] hover:text-white">{showPassword ? "Hide" : "Show"}</button>
              </div>
            </label>
            {mode === "register" && <label className="block text-xs font-semibold text-[#aaa6a8]">Confirm password
              <input value={confirmPassword} onChange={event => { setConfirmPassword(event.target.value); setError(""); }} type={showPassword ? "text" : "password"} autoComplete="new-password" placeholder="Repeat your password" className="mt-2 w-full rounded-2xl border border-white/[.08] bg-white/[.025] px-4 py-3 text-sm text-white outline-none placeholder:text-[#555155] focus:border-[#8049D9]/70" required />
            </label>}
            {error && <p role="alert" className="rounded-xl border border-[#ff6b81]/20 bg-[#ff6b81]/[.08] px-3 py-2 text-xs text-[#ff8799]">{error}</p>}
            <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ebe6e7] py-3.5 text-xs font-bold text-[#111] transition hover:bg-white">{mode === "login" ? <LogIn size={15}/> : <UserPlus size={15}/>} {mode === "login" ? "Sign in to workspace" : "Create account"}</button>
          </form>
          {mode === "login" && <>
            <div className="my-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#555155]"><span className="h-px flex-1 bg-white/[.07]"/>or<span className="h-px flex-1 bg-white/[.07]"/></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={() => handleOAuth(onGoogleLogin)} className="flex items-center justify-center gap-2 rounded-2xl border border-white/[.1] bg-white/[.025] py-3.5 text-xs font-bold text-white transition hover:bg-white/[.07]"><Chrome size={15}/> Google</button>
              <button type="button" onClick={() => handleOAuth(onGithubLogin)} className="flex items-center justify-center gap-2 rounded-2xl border border-white/[.1] bg-white/[.025] py-3.5 text-xs font-bold text-white transition hover:bg-white/[.07]"><Github size={15}/> GitHub</button>
            </div>
            {!isSupabaseConfigured && <p className="mt-2 text-center text-[10px] leading-4 text-[#666365]">Social sign-in needs Supabase environment variables.</p>}
          </>}
          {mode === "login" && <div className="mt-6 rounded-2xl border border-[#8049D9]/20 bg-[#8049D9]/[.07] p-3 text-[11px] leading-5 text-[#aaa6a8]">Demo access: <span className="font-semibold text-[#d4c5ff]">analyst@cybershield.ai</span> / <span className="font-semibold text-[#d4c5ff]">shield2026</span></div>}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#777477]">
            <span>{mode === "login" ? "New to AI KAVACH?" : "Already have an account?"}</span>
            <button type="button" onClick={switchMode} className="font-semibold text-[#bda6ff] hover:text-white">{mode === "login" ? "Register" : "Sign in"}</button>
          </div>
        </div>
        <p className="mt-6 text-center text-[10px] text-[#555155]">Protected workspace access • AI KAVACH</p>
      </div>
    </main>
  );
}

function App() {
  const [authenticated, setAuthenticated] = useState(() => localStorage.getItem("cybershield-auth") === "true");
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (!supabase) return undefined;

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        setAuthenticated(true);
        await saveProfile(session.user);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        localStorage.setItem("cybershield-auth", "true");
        setAuthenticated(true);
        await saveProfile(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return threats;
    return threats.filter(t => `${t.title} ${t.source} ${t.level}`.toLowerCase().includes(q));
  }, [query]);

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2200);
  };

  const oauthLogin = async (provider) => {
    if (!supabase) return;

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin }
    });

    if (error) throw error;
  };

  const emailAuth = async ({ mode, name, email, password }) => {
    if (!supabase) return;

    if (mode === "register") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
      });
      if (error) throw error;
      if (!data.session) throw new Error("Check your email to confirm your account, then sign in.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const saveProfile = async (user) => {
    if (!supabase || !user) return;

    const metadata = user.user_metadata || {};
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      full_name: metadata.full_name || metadata.name || "Security Analyst",
      avatar_url: metadata.avatar_url || metadata.picture || null,
      email: user.email || null,
      provider: user.app_metadata?.provider || "email"
    }, { onConflict: "id" });
    if (error) console.error("Could not save profile:", error.message);
  };

  const handleLogin = async () => {
    localStorage.setItem("cybershield-auth", "true");
    setAuthenticated(true);
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      await saveProfile(user);
    }
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem("cybershield-auth");
    setAuthenticated(false);
  };

  if (!authenticated) return <AuthScreen onLogin={handleLogin} onEmailAuth={async (credentials) => { await emailAuth(credentials); await handleLogin(); }} onGoogleLogin={() => oauthLogin("google")} onGithubLogin={() => oauthLogin("github")} />;

  const nav = [
    ["Overview", LayoutDashboard],
    ["Threat Detection", ShieldAlert],
    ["Phishing", Globe2],
    ["Impersonation", UserRound],
    ["Account Takeover", LockKeyhole],
    ["Deepfake", Fingerprint],
    ["Network", Network],
    ["Incidents", FileWarning],
  ];

  return (
    <div className="min-h-screen bg-[#090909] text-[#ebe6e7]">
      <div className="fixed inset-0 pointer-events-none opacity-40 grid-bg" />

      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed left-0 top-0 z-50 flex h-screen w-[270px] flex-col border-r border-white/[0.06] bg-[#0d0d0d] px-5 py-6 transition-transform lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="mb-10 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#3d2eb1] shadow-[0_0_35px_rgba(61,46,177,.35)]">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-sm font-black tracking-tight">AI KAVACH</div>
              <div className="text-[10px] font-bold tracking-[.28em] text-[#8f8b8d]">THREAT DEFENSE</div>
            </div>
          </div>
          <button className="lg:hidden text-[#8f8b8d]" onClick={() => setMobileOpen(false)}><X size={20}/></button>
        </div>

        <div className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.22em] text-[#666365]">Workspace</div>
        <nav className="space-y-1">
          {nav.map(([name, Icon]) => (
            <button key={name} onClick={() => { setActive(name); setMobileOpen(false); }}
              className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-[13px] font-medium transition ${
                active === name ? "bg-[#3d2eb1]/20 text-white" : "text-[#858184] hover:bg-white/[.04] hover:text-white"
              }`}>
              <Icon size={17} className={active === name ? "text-[#bda6ff]" : "text-[#646064] group-hover:text-[#aaa6a8]"} />
              <span>{name}</span>
              {name === "Incidents" && <span className="ml-auto rounded-full bg-[#ff6b81]/10 px-2 py-0.5 text-[9px] font-bold text-[#ff8294]">8</span>}
            </button>
          ))}
        </nav>

        <div className="mt-auto space-y-1">
          <button onClick={() => notify("Settings panel is ready for backend integration.")} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[13px] text-[#858184] hover:bg-white/[.04] hover:text-white">
            <Settings size={17}/> Settings
          </button>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/[.06] bg-white/[.025] p-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#8049D9] to-[#deaff6] text-xs font-black text-white">DP</div>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold">Security Analyst</div>
              <div className="truncate text-[10px] text-[#666365]">SOC Workspace</div>
            </div>
            <button aria-label="Sign out" title="Sign out" onClick={logout} className="ml-auto rounded-lg p-1.5 text-[#666365] hover:bg-white/[.06] hover:text-white"><LogOut size={15} /></button>
          </div>
        </div>
      </aside>

      <main className="relative lg:pl-[270px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center gap-3 border-b border-white/[.05] bg-[#090909]/85 px-5 backdrop-blur-xl lg:px-9">
          <button className="rounded-xl p-2 text-[#8f8b8d] hover:bg-white/[.05] lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={20}/></button>
          <div className="relative max-w-[390px] flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555155]" size={16}/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search threats, domains, users..."
              className="w-full rounded-2xl border border-white/[.06] bg-white/[.025] py-2.5 pl-10 pr-4 text-xs text-white outline-none placeholder:text-[#555155] focus:border-[#8049D9]/60"/>
          </div>
          <button onClick={() => { setNotifications(0); notify("Notifications marked as read."); }} className="relative rounded-2xl border border-white/[.06] p-2.5 text-[#8f8b8d] hover:bg-white/[.05]">
            <Bell size={17}/>
            {notifications > 0 && <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#ff6b81]"/>}
          </button>
          <button onClick={() => notify("Help center opened.")} className="hidden rounded-2xl border border-white/[.06] p-2.5 text-[#8f8b8d] hover:bg-white/[.05] sm:block"><CircleHelp size={17}/></button>
          <div className="hidden h-8 w-px bg-white/[.07] sm:block"/>
          <div className="hidden text-right sm:block"><div className="text-xs font-semibold">Analyst</div><div className="text-[10px] text-[#666365]">Online</div></div>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#242424] text-xs font-black">DP</div>
        </header>

        <section className="mx-auto max-w-[1500px] px-5 py-7 lg:px-9 lg:py-10">
          <div className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#8049D9]"><Sparkles size={13}/> AI Security Workspace</div>
              <h1 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">Good evening, Analyst</h1>
              <p className="mt-2 text-sm text-[#777477]">Your security environment is protected. Here’s what the AI found today.</p>
            </div>
            <button onClick={() => notify("New scan started. Connect the FastAPI endpoint to run real analysis.")} className="group flex w-fit items-center gap-2 rounded-full bg-[#ebe6e7] px-4 py-2.5 text-xs font-bold text-[#111] transition hover:bg-white">
              <Zap size={14}/> Run AI Scan <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/>
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              ["TOTAL THREATS", "1,284", "+12.8%", Activity],
              ["CRITICAL", "24", "8 require action", AlertTriangle],
              ["PHISHING BLOCKED", "742", "+18.4%", Globe2],
              ["AI CONFIDENCE", "96.2%", "Model ensemble", BrainCircuit]
            ].map(([label, value, sub, Icon], i) => (
              <Card key={label} className="group relative overflow-hidden p-5 transition hover:-translate-y-1 hover:border-[#8049D9]/30">
                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#8049D9]/10 blur-2xl opacity-0 transition group-hover:opacity-100"/>
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-[10px] font-bold tracking-[.17em] text-[#686467]">{label}</span>
                  <Icon size={17} className={i === 1 ? "text-[#ff7184]" : "text-[#a78ce9]"}/>
                </div>
                <div className="text-3xl font-semibold tracking-[-.04em]">{value}</div>
                <div className={`mt-1 text-[11px] ${i === 1 ? "text-[#ff7c8e]" : "text-[#5bdba0]"}`}>{sub}</div>
              </Card>
            ))}
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.65fr_1fr]">
            <Card className="p-5 sm:p-6">
              <div className="mb-7 flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-[.17em] text-[#686467]">THREAT ACTIVITY</div>
                  <div className="mt-2 text-xl font-semibold">Threats detected</div>
                </div>
                <button onClick={() => notify("Showing last 30 days.")} className="flex items-center gap-1 rounded-full border border-white/[.06] px-3 py-1.5 text-[10px] text-[#8f8b8d]">Last 30 days <ChevronDown size={12}/></button>
              </div>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="threatFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={purple} stopOpacity={0.42}/>
                        <stop offset="100%" stopColor={purple} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,.04)" vertical={false}/>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:"#5e5b5e", fontSize:10}}/>
                    <YAxis axisLine={false} tickLine={false} tick={{fill:"#5e5b5e", fontSize:10}} width={28}/>
                    <Tooltip contentStyle={{background:"#191919", border:"1px solid rgba(255,255,255,.08)", borderRadius:14, color:"#fff", fontSize:11}}/>
                    <Area type="monotone" dataKey="threats" stroke={purple} strokeWidth={2.5} fill="url(#threatFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="text-[10px] font-bold tracking-[.17em] text-[#686467]">RISK OVERVIEW</div>
              <div className="mt-2 text-xl font-semibold">Current exposure</div>
              <div className="flex items-center justify-center py-2">
                <div className="relative h-[190px] w-[190px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={riskData} dataKey="value" innerRadius={62} outerRadius={84} paddingAngle={3} stroke="none">
                        {riskData.map((entry) => <Cell key={entry.name} fill={entry.color}/>)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="text-center"><div className="text-3xl font-semibold">1,284</div><div className="text-[9px] font-bold tracking-[.16em] text-[#666365]">EVENTS</div></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {riskData.map(r => <div key={r.name} className="flex items-center justify-between rounded-xl bg-white/[.025] px-3 py-2"><span className="flex items-center gap-2 text-[10px] text-[#777477]"><i style={{background:r.color}} className="h-1.5 w-1.5 rounded-full"/>{r.name}</span><b className="text-[11px]">{r.value}</b></div>)}
              </div>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_1fr]">
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/[.06] px-5 py-5 sm:px-6">
                <div><div className="text-[10px] font-bold tracking-[.17em] text-[#686467]">RECENT THREATS</div><div className="mt-1 text-lg font-semibold">Latest detections</div></div>
                <button onClick={() => setActive("Threat Detection")} className="text-[11px] font-semibold text-[#a78ce9] hover:text-white">View all <ArrowUpRight className="ml-1 inline" size={13}/></button>
              </div>
              <div className="divide-y divide-white/[.05]">
                {filtered.length ? filtered.map((t) => {
                  const Icon = t.icon;
                  return <div key={t.title} className="flex items-center gap-3 px-5 py-4 transition hover:bg-white/[.025] sm:px-6">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/[.035]"><Icon size={17} className="text-[#a78ce9]"/></div>
                    <div className="min-w-0 flex-1"><div className="truncate text-xs font-semibold">{t.title}</div><div className="mt-1 truncate text-[10px] text-[#666365]">{t.source}</div></div>
                    <div className="hidden sm:block"><RiskBadge level={t.level}/></div>
                    <div className="text-right"><div className="text-sm font-semibold">{t.score}</div><div className="text-[9px] text-[#5f5c5f]">RISK</div></div>
                    <button onClick={() => notify(`${t.action} queued for ${t.title}.`)} className="hidden rounded-xl border border-white/[.06] px-3 py-2 text-[10px] font-semibold text-[#aaa6a8] hover:border-[#8049D9]/50 hover:text-white md:block">{t.action}</button>
                  </div>
                }) : <div className="px-6 py-10 text-center text-xs text-[#666365]">No threats match “{query}”.</div>}
              </div>
            </Card>

            <Card className="p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between"><div><div className="text-[10px] font-bold tracking-[.17em] text-[#686467]">AI RECOMMENDATION</div><div className="mt-1 text-lg font-semibold">Containment plan</div></div><BrainCircuit size={19} className="text-[#a78ce9]"/></div>
              <div className="rounded-2xl border border-[#8049D9]/20 bg-[#8049D9]/[.07] p-4">
                <div className="mb-2 flex items-center gap-2 text-xs font-semibold"><Sparkles size={14} className="text-[#bda6ff]"/> AI analysis</div>
                <p className="text-xs leading-5 text-[#aaa6a8]">The current risk cluster suggests coordinated phishing activity targeting credentials. Immediate containment is recommended.</p>
              </div>
              <div className="mt-4 space-y-2">
                {["Block malicious URLs", "Quarantine suspicious emails", "Revoke anomalous sessions"].map((x, i) => <button key={x} onClick={() => notify(`${x} action selected.`)} className="flex w-full items-center gap-3 rounded-2xl border border-white/[.06] p-3 text-left text-xs hover:bg-white/[.03]"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#4dd59a]/10 text-[#5fe0a5]"><Check size={12}/></span>{x}<ArrowUpRight size={13} className="ml-auto text-[#5e5b5e]"/></button>)}
              </div>
              <button onClick={() => notify("Response workflow started.")} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3d2eb1] py-3 text-xs font-bold transition hover:bg-[#4a38c8]"><Zap size={14}/> Execute response</button>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {[
              ["PHISHING DETECTION", "94", "Credential harvesting", Globe2, "CRITICAL"],
              ["ACCOUNT TAKEOVER", "87", "New device anomaly", LockKeyhole, "HIGH"],
              ["DIGITAL IMPERSONATION", "92", "Identity mismatch", Fingerprint, "CRITICAL"]
            ].map(([title, score, evidence, Icon, level]) => (
              <Card key={title} className="group p-5 transition hover:-translate-y-1 hover:border-[#8049D9]/30">
                <div className="flex items-center justify-between"><div className="grid h-9 w-9 place-items-center rounded-xl bg-[#8049D9]/10 text-[#a98be8]"><Icon size={16}/></div><RiskBadge level={level}/></div>
                <div className="mt-5 text-[10px] font-bold tracking-[.14em] text-[#686467]">{title}</div>
                <div className="mt-1 flex items-end gap-2"><span className="text-4xl font-semibold tracking-[-.05em]">{score}</span><span className="mb-1 text-[10px] text-[#5f5c5f]">/100 RISK</span></div>
                <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[.06]"><div style={{width:`${score}%`}} className="h-full rounded-full bg-gradient-to-r from-[#3d2eb1] to-[#deaff6]"/></div>
                <div className="mt-4 flex items-center justify-between text-[10px] text-[#777477]"><span>{evidence}</span><button onClick={() => notify(`${title} evidence opened.`)} className="text-[#a78ce9]">Evidence <ExternalLink size={11} className="ml-1 inline"/></button></div>
              </Card>
            ))}
          </div>

          <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-white/[.05] py-6 text-[10px] text-[#555155] sm:flex-row">
            <span>AI KAVACH • Threat Intelligence Workspace</span>
            <span className="flex items-center gap-1"><Activity size={11} className="text-[#4dd59a]"/> All systems operational</span>
          </footer>
        </section>
      </main>

      {toast && <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-2xl border border-white/[.08] bg-[#191919] px-4 py-3 text-xs shadow-2xl"><Check size={14} className="text-[#5fe0a5]"/>{toast}</div>}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

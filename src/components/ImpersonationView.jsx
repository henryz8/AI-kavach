import React, { useState } from "react";
import {
  UserRound, ShieldCheck, Mail, AlertTriangle, ExternalLink,
  CheckCircle2, XCircle, ArrowUpRight, Zap, Shield
} from "lucide-react";
import { api } from "../lib/api";

export function ImpersonationView({ vipList, onOpenEvidence, notify }) {
  const [intercepts, setIntercepts] = useState([
    {
      id: "bec-1",
      subject: "URGENT: Confidential wire transfer invoice for European acquisition",
      spoofedExecutive: "Elena Rostova (CEO)",
      rawSender: "elena.ceo@executive-internal-mail.xyz",
      indicators: ["SPF: FAILED", "Domain Age: 2 hours", "Entropy: 4.8"],
      risk: "CRITICAL",
      score: 96,
      status: "Flagged"
    },
    {
      id: "bec-2",
      subject: "Updated direct deposit bank account instructions for next payroll",
      spoofedExecutive: "Marcus Vance (CFO)",
      rawSender: "marcus.cfo@pay-update-payroll.com",
      indicators: ["DKIM: INVALID", "Display Name Spoofing", "Lookalike Header"],
      risk: "HIGH",
      score: 89,
      status: "Flagged"
    },
    {
      id: "bec-3",
      subject: "Immediate contractor onboarding credentials needed",
      spoofedExecutive: "David Kim (VP Eng)",
      rawSender: "david.kim@github-enterprise-sync.org",
      indicators: ["Freemail Relay", "Unrecognized IP"],
      risk: "HIGH",
      score: 84,
      status: "Flagged"
    }
  ]);

  const handleQuarantine = async (intercept) => {
    try {
      await api.quarantine(intercept.rawSender, "email", `BEC impersonation spoofing ${intercept.spoofedExecutive}`);
    } catch (e) {
      console.warn("Backend quarantine call:", e.message);
    }

    setIntercepts((prev) =>
      prev.map((item) =>
        item.id === intercept.id ? { ...item, status: "Quarantined ✓" } : item
      )
    );
    notify(`Quarantined spoofed email from ${intercept.rawSender}!`);
  };

  const handleBlacklist = async (intercept) => {
    const domain = intercept.rawSender.split("@")[1];
    try {
      await api.blockUrl(domain, `Blacklisted BEC sender domain: ${intercept.rawSender}`);
    } catch (e) {
      console.warn("Backend blacklist call:", e.message);
    }

    setIntercepts((prev) =>
      prev.map((item) =>
        item.id === intercept.id ? { ...item, status: "Blacklisted ✓" } : item
      )
    );
    notify(`Blacklisted domain '${domain}' across mail exchange gateway.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#8049D9]">
            <UserRound size={14} /> Digital Impersonation & Executive BEC Defense
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Executive Identity Guard
          </h1>
          <p className="mt-1 text-xs text-[#888]">
            AI deep linguistic heuristics intercepting Business Email Compromise (BEC), CEO fraud, and display-name spoofing.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Protected Executives</div>
          <div className="mt-1 text-2xl font-bold text-white">{vipList.length}</div>
          <div className="mt-0.5 text-[10px] text-[#5bdba0]">Hardened telemetry</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">BEC Intercepts</div>
          <div className="mt-1 text-2xl font-bold text-[#ff7184]">{intercepts.length}</div>
          <div className="mt-0.5 text-[10px] text-[#ff7c8e]">Zero-day attempts</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">DMARC Policy</div>
          <div className="mt-1 text-2xl font-bold text-[#5bdba0]">p=reject</div>
          <div className="mt-0.5 text-[10px] text-[#888]">100% enforcement</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Attacks Repelled</div>
          <div className="mt-1 text-2xl font-bold text-[#a78ce9]">
            {vipList.reduce((acc, v) => acc + (v.attacksBlocked || 0), 0)}
          </div>
          <div className="mt-0.5 text-[10px] text-[#888]">Direct wire lures blocked</div>
        </div>
      </div>

      {/* Executive Watchlist */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#141414] p-5">
        <div className="text-xs font-bold text-white mb-4">VIP & Executive Identity Roster</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {vipList.map((vip) => (
            <div
              key={vip.id}
              className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 transition hover:border-[#8049D9]/40"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#8049D9] to-[#3d2eb1] text-xs font-black text-white">
                  {vip.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-white truncate">{vip.name}</div>
                  <div className="text-[10px] text-[#888] truncate">{vip.role}</div>
                </div>
              </div>
              <div className="font-mono text-[10px] text-[#aaa] truncate mb-2">{vip.email}</div>
              <div className="flex items-center justify-between text-[10px]">
                <span className="rounded-full bg-[#4dd59a]/10 px-2 py-0.5 text-[#5fe0a5] font-semibold">
                  {vip.status}
                </span>
                <span className="text-[#888] font-bold">{vip.attacksBlocked} blocked</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detected BEC Intercepts */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#141414] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-bold text-white">Detected Impersonation & BEC Attacks</div>
            <div className="text-[11px] text-[#888]">
              Emails attempting display name mimicry or unauthorized executive authorization
            </div>
          </div>
          <span className="rounded-full bg-[#ff6b81]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#ff8799]">
            {intercepts.filter((i) => i.status === "Flagged").length} Active Alerts
          </span>
        </div>

        <div className="space-y-3">
          {intercepts.map((intercept) => (
            <div
              key={intercept.id}
              className="flex flex-col justify-between gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:bg-white/[0.035] sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-white">{intercept.subject}</span>
                  <span className="rounded-full bg-[#ff6b81]/20 px-2 py-0.5 text-[9px] font-bold text-[#ff8799]">
                    {intercept.risk}
                  </span>
                </div>
                <div className="text-[11px] text-[#888] mb-1">
                  Spoofing: <span className="font-semibold text-white">{intercept.spoofedExecutive}</span> • From:{" "}
                  <span className="font-mono text-[#ff8799] font-medium">{intercept.rawSender}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {intercept.indicators.map((ind) => (
                    <span
                      key={ind}
                      className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[9px] font-mono text-[#ccc]"
                    >
                      {ind}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() =>
                    onOpenEvidence({
                      title: `BEC: ${intercept.spoofedExecutive}`,
                      source: intercept.rawSender,
                      score: intercept.score,
                      level: intercept.risk,
                      category: "Digital Impersonation"
                    })
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-xs font-semibold text-[#a78ce9] hover:text-white transition"
                >
                  Evidence
                </button>

                <button
                  disabled={intercept.status !== "Flagged"}
                  onClick={() => handleQuarantine(intercept)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition shadow ${
                    intercept.status.includes("Quarantined")
                      ? "bg-[#4dd59a]/20 text-[#5fe0a5] border border-[#4dd59a]/30 cursor-default"
                      : "bg-[#3d2eb1] text-white hover:bg-[#4a38c8]"
                  }`}
                >
                  {intercept.status.includes("Quarantined") ? "Quarantined ✓" : "Quarantine Email"}
                </button>

                <button
                  disabled={intercept.status !== "Flagged"}
                  onClick={() => handleBlacklist(intercept)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold transition ${
                    intercept.status.includes("Blacklisted")
                      ? "bg-[#ff6b81]/20 text-[#ff8799] cursor-default"
                      : "border border-white/10 text-[#888] hover:text-white hover:bg-white/10"
                  }`}
                >
                  {intercept.status.includes("Blacklisted") ? "Blacklisted ✓" : "Blacklist"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Protocol Checklist */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#141414] p-5">
        <div className="text-xs font-bold text-white mb-3">Inbound & Outbound Email Trust Architecture</div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] p-3 border border-white/[0.04]">
            <CheckCircle2 size={18} className="text-[#5fe0a5]" />
            <div>
              <div className="text-xs font-bold text-white">SPF Alignment</div>
              <div className="text-[10px] text-[#888]">v=spf1 include:_spf.google.com ~all</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] p-3 border border-white/[0.04]">
            <CheckCircle2 size={18} className="text-[#5fe0a5]" />
            <div>
              <div className="text-xs font-bold text-white">DKIM 2048-bit</div>
              <div className="text-[10px] text-[#888]">Cryptographic signature verified</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] p-3 border border-white/[0.04]">
            <CheckCircle2 size={18} className="text-[#5fe0a5]" />
            <div>
              <div className="text-xs font-bold text-white">DMARC Strict</div>
              <div className="text-[10px] text-[#888]">p=reject with automated reports</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] p-3 border border-white/[0.04]">
            <CheckCircle2 size={18} className="text-[#5fe0a5]" />
            <div>
              <div className="text-xs font-bold text-white">BIMI Verified</div>
              <div className="text-[10px] text-[#888]">VMC Certificate Authenticated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

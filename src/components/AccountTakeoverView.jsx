import React, { useState } from "react";
import {
  LockKeyhole, AlertTriangle, ShieldCheck, CheckCircle2,
  Smartphone, Laptop, Globe2, LogOut, KeyRound, Radio
} from "lucide-react";
import { ToggleSwitch } from "./ToggleSwitch";
import { api } from "../lib/api";

export function AccountTakeoverView({ notify }) {
  const [sessions, setSessions] = useState([
    {
      id: "sess-1",
      user: "analyst@cybershield.ai",
      ip: "192.168.1.45",
      location: "New York, USA (Current)",
      device: "Chrome 122 • Windows 11",
      status: "Active",
      risk: "LOW",
      isRevoked: false
    },
    {
      id: "sess-2",
      user: "analyst@cybershield.ai",
      ip: "185.220.101.5",
      location: "St. Petersburg, Russia (Anomalous)",
      device: "Firefox 115 • Tor Exit Node",
      status: "Suspicious",
      risk: "CRITICAL",
      isRevoked: false
    },
    {
      id: "sess-3",
      user: "analyst@cybershield.ai",
      ip: "103.21.244.0",
      location: "Mumbai, India (VPN Mismatch)",
      device: "Safari 17 • macOS Sonoma",
      status: "Suspicious",
      risk: "HIGH",
      isRevoked: false
    },
    {
      id: "sess-4",
      user: "devops@cybershield.ai",
      ip: "54.210.12.98",
      location: "Ashburn, VA (AWS Subnet)",
      device: "cURL / Automated Script",
      status: "Active",
      risk: "LOW",
      isRevoked: false
    }
  ]);

  const [hardwareKeyEnforced, setHardwareKeyEnforced] = useState(true);
  const [stepUpAuth, setStepUpAuth] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(false);

  const handleRevoke = async (session) => {
    try {
      await api.revokeSession(session.id, session.user, `Anomalous login pattern from ${session.location}`);
    } catch (e) {
      console.warn("Backend revoke session call:", e.message);
    }

    setSessions((prev) =>
      prev.map((s) =>
        s.id === session.id ? { ...s, isRevoked: true, status: "Revoked" } : s
      )
    );
    notify(`Revoked session on IP ${session.ip} (${session.location})!`);
  };

  const handleTerminateAllAnomalies = async () => {
    const anomalous = sessions.filter((s) => s.risk !== "LOW" && !s.isRevoked);
    for (const s of anomalous) {
      try {
        await api.revokeSession(s.id, s.user, "Bulk anomalous session revocation");
      } catch (e) {
        console.warn(e);
      }
    }
    setSessions((prev) =>
      prev.map((s) =>
        s.risk !== "LOW" ? { ...s, isRevoked: true, status: "Revoked" } : s
      )
    );
    notify("Terminated all anomalous sessions. Security tokens invalidated.");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#8049D9]">
            <LockKeyhole size={14} /> Account Takeover & Identity Sentinel
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Session & Identity Defense
          </h1>
          <p className="mt-1 text-xs text-[#888]">
            Real-time impossible travel detection, credential stuffing telemetry, and single-click session revocation.
          </p>
        </div>
        <button
          onClick={handleTerminateAllAnomalies}
          className="flex items-center gap-2 rounded-2xl bg-[#ff6b81] px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-[#ff526c]"
        >
          <LogOut size={14} /> Terminate All Anomalous Sessions
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Active Sessions</div>
          <div className="mt-1 text-2xl font-bold text-white">
            {sessions.filter((s) => !s.isRevoked).length}
          </div>
          <div className="mt-0.5 text-[10px] text-[#888]">Authenticated tokens</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Anomalies Flagged</div>
          <div className="mt-1 text-2xl font-bold text-[#ff7184]">
            {sessions.filter((s) => s.risk !== "LOW" && !s.isRevoked).length}
          </div>
          <div className="mt-0.5 text-[10px] text-[#ff7c8e]">Impossible travel violations</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">MFA Enforcement</div>
          <div className="mt-1 text-2xl font-bold text-[#5bdba0]">100%</div>
          <div className="mt-0.5 text-[10px] text-[#888]">FIDO2 / WebAuthn</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Stuffing Drops</div>
          <div className="mt-1 text-2xl font-bold text-[#a78ce9]">318</div>
          <div className="mt-0.5 text-[10px] text-[#888]">Automated bot attempts</div>
        </div>
      </div>

      {/* Impossible Travel Violation Banner */}
      <div className="rounded-2xl border border-[#ff6b81]/30 bg-[#ff6b81]/[0.08] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#ff6b81]/20 text-[#ff8799]">
            <Radio size={18} className="animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#ff8799]">CRITICAL: Impossible Travel Violation Detected</div>
            <p className="text-[11px] text-[#ddd] mt-0.5">
              Simultaneous authentication detected from <b>New York, USA</b> and <b>St. Petersburg, Russia</b> within 14 minutes.
              Velocity required: 18,400 mph. Credential leak or proxy relay suspected.
            </p>
          </div>
        </div>
        <button
          onClick={() => handleRevoke(sessions[1])}
          className="shrink-0 rounded-xl bg-[#ff6b81] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#ff526c] transition"
        >
          Kill Tor Session Now
        </button>
      </div>

      {/* Sessions Table */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#141414] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-bold text-white">Active Identity Sessions</div>
            <div className="text-[11px] text-[#888]">Tokens authorized across corporate identity provider</div>
          </div>
          <span className="text-[11px] text-[#888]">Auto-monitored by AI Heuristics</span>
        </div>

        <div className="divide-y divide-white/[0.05]">
          {sessions.map((s) => (
            <div
              key={s.id}
              className={`flex flex-col justify-between gap-3 py-3.5 transition sm:flex-row sm:items-center ${
                s.isRevoked ? "opacity-40" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.03] text-[#a78ce9]">
                  {s.device.includes("Chrome") || s.device.includes("Windows") ? (
                    <Laptop size={18} />
                  ) : s.device.includes("Safari") ? (
                    <Smartphone size={18} />
                  ) : (
                    <Globe2 size={18} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-white">{s.ip}</span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                        s.isRevoked
                          ? "bg-white/10 text-[#888]"
                          : s.risk === "CRITICAL"
                          ? "bg-[#ff6b81]/20 text-[#ff8799]"
                          : s.risk === "HIGH"
                          ? "bg-[#f4b860]/20 text-[#f4b860]"
                          : "bg-[#4dd59a]/20 text-[#5fe0a5]"
                      }`}
                    >
                      {s.isRevoked ? "REVOKED" : s.risk}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#888] mt-0.5">
                    {s.location} • <span className="text-[#aaa]">{s.device}</span>
                  </div>
                  <div className="text-[10px] text-[#666] font-mono mt-0.5">{s.user}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  disabled={s.isRevoked}
                  onClick={() => handleRevoke(s)}
                  className={`flex items-center gap-1 rounded-xl px-3.5 py-2 text-xs font-bold transition shadow ${
                    s.isRevoked
                      ? "bg-white/5 text-[#666] cursor-not-allowed"
                      : s.risk === "CRITICAL"
                      ? "bg-[#ff6b81] text-white hover:bg-[#ff526c]"
                      : "bg-[#3d2eb1] text-white hover:bg-[#4a38c8]"
                  }`}
                >
                  <LogOut size={12} /> {s.isRevoked ? "Revoked ✓" : "Revoke Session"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Identity Hardening Controls */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#141414] p-5 space-y-3">
        <div className="text-xs font-bold text-white mb-2">Zero-Trust Identity Hardening Policies</div>
        <ToggleSwitch
          checked={hardwareKeyEnforced}
          onChange={(val) => {
            setHardwareKeyEnforced(val);
            notify(`Hardware key enforcement ${val ? "enabled" : "disabled"}.`);
          }}
          label="Enforce Hardware Security Keys (FIDO2 / YubiKey)"
          description="Mandates physical cryptographic token verification for all administrative sessions."
        />
        <ToggleSwitch
          checked={stepUpAuth}
          onChange={(val) => {
            setStepUpAuth(val);
            notify(`Step-up biometric challenge ${val ? "enabled" : "disabled"}.`);
          }}
          label="Step-Up Biometric Authentication on IP or ASN Change"
          description="Instantly challenges user if egress ISP or subnet changes mid-session."
        />
        <ToggleSwitch
          checked={sessionTimeout}
          onChange={(val) => {
            setSessionTimeout(val);
            notify(`Strict session idle timeout ${val ? "enabled" : "disabled"}.`);
          }}
          label="Auto-Invalidate Idle Sessions (> 15 Minutes)"
          description="Revokes bearer tokens if no cryptographic heartbeat is received."
        />
      </div>
    </div>
  );
}

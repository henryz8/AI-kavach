import React, { useState } from "react";
import {
  Settings, Server, Shield, Activity, RefreshCw,
  CheckCircle2, XCircle, LogOut, Sparkles, Terminal, KeyRound
} from "lucide-react";
import { ToggleSwitch } from "./ToggleSwitch";
import { api } from "../lib/api";

export function SettingsView({
  settings,
  onToggleSetting,
  currentUser,
  onLogout,
  notify
}) {
  const [backendStatus, setBackendStatus] = useState({
    checking: false,
    online: true,
    latency: "12ms",
    version: "FastAPI 0.110.0 (Neural Engine v2.4)",
    activeEndpoints: 8
  });

  const checkBackend = async () => {
    setBackendStatus((prev) => ({ ...prev, checking: true }));
    const startTime = performance.now();
    try {
      const res = await api.checkHealth();
      const elapsed = Math.round(performance.now() - startTime);
      setBackendStatus({
        checking: false,
        online: true,
        latency: `${elapsed}ms`,
        version: res.version ? `FastAPI (${res.version})` : "FastAPI 0.110.0 (Neural Engine v2.4)",
        activeEndpoints: 8
      });
      notify(`FastAPI Backend Healthy! Ping roundtrip: ${elapsed}ms`);
    } catch {
      setBackendStatus((prev) => ({
        ...prev,
        checking: false,
        online: false,
        latency: "Timeout"
      }));
      notify("Warning: Could not contact FastAPI backend on port 8000.");
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#8049D9]">
            <Settings size={14} /> System Configuration & AI Engine
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Security Settings
          </h1>
          <p className="mt-1 text-xs text-[#888]">
            Configure autonomous containment parameters, neural heuristic sensitivity, and API gateway connections.
          </p>
        </div>
      </div>

      {/* Backend Health Diagnostics */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#141414] p-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#3d2eb1]/20 text-[#a78ce9]">
              <Server size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">FastAPI Cyber Defense Engine</span>
                <span
                  className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                    backendStatus.online
                      ? "bg-[#4dd59a]/15 text-[#5fe0a5]"
                      : "bg-[#ff6b81]/15 text-[#ff8799]"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${backendStatus.online ? "bg-[#4dd59a]" : "bg-[#ff6b81]"}`} />
                  {backendStatus.online ? "ONLINE" : "OFFLINE"}
                </span>
              </div>
              <p className="text-[11px] text-[#888]">http://localhost:8000 • SQLite + SQLAlchemy + Neural Heuristics</p>
            </div>
          </div>

          <button
            disabled={backendStatus.checking}
            onClick={checkBackend}
            className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/15 transition shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={13} className={backendStatus.checking ? "animate-spin" : ""} />
            {backendStatus.checking ? "Testing Connection..." : "Test Backend Ping"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-white/[0.02] p-3 border border-white/[0.04]">
            <div className="text-[10px] text-[#888]">Connection Latency</div>
            <div className="mt-1 font-mono text-sm font-bold text-[#5fe0a5]">{backendStatus.latency}</div>
          </div>
          <div className="rounded-xl bg-white/[0.02] p-3 border border-white/[0.04]">
            <div className="text-[10px] text-[#888]">Backend Engine</div>
            <div className="mt-1 font-mono text-xs font-bold text-white truncate">{backendStatus.version}</div>
          </div>
          <div className="rounded-xl bg-white/[0.02] p-3 border border-white/[0.04]">
            <div className="text-[10px] text-[#888]">Database State</div>
            <div className="mt-1 font-mono text-xs font-bold text-[#bda6ff]">SQLite (kavach.db)</div>
          </div>
          <div className="rounded-xl bg-white/[0.02] p-3 border border-white/[0.04]">
            <div className="text-[10px] text-[#888]">Active API Endpoints</div>
            <div className="mt-1 font-mono text-sm font-bold text-white">8 Routes Registered</div>
          </div>
        </div>
      </div>

      {/* Security Switches and Policy Toggles */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#141414] p-5 space-y-4">
        <div>
          <div className="text-xs font-bold text-white">Autonomous Threat Containment Policies</div>
          <div className="text-[11px] text-[#888]">Control which actions AI KAVACH takes automatically versus requiring confirmation</div>
        </div>

        <div className="space-y-3">
          <ToggleSwitch
            checked={settings.autoContainment}
            onChange={(val) => onToggleSetting("autoContainment", val)}
            label="Automated AI Threat Containment"
            description="Automatically block URLs, quarantine malicious attachments, and revoke suspicious sessions when AI confidence exceeds 90%."
          />

          <ToggleSwitch
            checked={settings.emailQuarantine}
            onChange={(val) => onToggleSetting("emailQuarantine", val)}
            label="Inbound Suspicious Attachment Quarantine"
            description="Isolate executables (.exe, .scr), macro-enabled office docs, and encrypted zip files before delivery to inbox."
          />

          <ToggleSwitch
            checked={settings.darkWebMonitoring}
            onChange={(val) => onToggleSetting("darkWebMonitoring", val)}
            label="Dark Web & Credential Breach Feeds"
            description="Stream real-time leaked credentials from paste sites and underground forums to flag compromised employee accounts."
          />

          <ToggleSwitch
            checked={settings.strictHeuristics}
            onChange={(val) => onToggleSetting("strictHeuristics", val)}
            label="Strict Neural Heuristic Mode (Elevated Sensitivity)"
            description="Lowers detection threshold for newly-registered domains (< 48 hrs) and homoglyph lookalikes."
          />

          <ToggleSwitch
            checked={settings.dnsSinkhole}
            onChange={(val) => onToggleSetting("dnsSinkhole", val)}
            label="Perimeter DNS Sinkholing"
            description="Redirect malicious queries directly to AI KAVACH local honeypot to inspect adversary C2 payloads."
          />

          <ToggleSwitch
            checked={settings.voiceDeepfakeShield}
            onChange={(val) => onToggleSetting("voiceDeepfakeShield", val)}
            label="Biometric Deepfake Interceptor"
            description="Analyze inbound audio recordings for synthetic speech glottal pulse anomalies."
          />

          <ToggleSwitch
            checked={settings.soundAlerts}
            onChange={(val) => onToggleSetting("soundAlerts", val)}
            label="Audio Alerts on Critical Threat Interception"
            description="Play immediate audible chime on browser client when a CRITICAL threat is detected."
          />
        </div>
      </div>

      {/* Analyst Profile & Credentials */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#141414] p-5">
        <div className="text-xs font-bold text-white mb-3">Analyst Profile & Session</div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#8049D9] to-[#deaff6] text-sm font-black text-white shadow-lg">
              {currentUser.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
            <div>
              <div className="text-sm font-bold text-white">{currentUser.name}</div>
              <div className="text-xs text-[#888]">{currentUser.email}</div>
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded bg-[#8049D9]/20 px-2 py-0.5 text-[10px] font-bold text-[#bda6ff]">
                  Role: Tier 3 Security Analyst
                </span>
                <span className="text-[10px] text-[#666]">Local Session Active</span>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-bold text-[#ff8799] hover:bg-[#ff6b81]/15 hover:border-[#ff6b81]/30 transition"
          >
            <LogOut size={14} /> Sign Out of Workspace
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useMemo, useEffect } from "react";
import {
  FileWarning, ShieldCheck, Download, Search,
  Filter, CheckCircle2, Clock, ExternalLink, ArrowUpRight, RefreshCw
} from "lucide-react";
import { api } from "../lib/api";

export function IncidentsView({ onOpenEvidence, notify }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [incidents, setIncidents] = useState([
    {
      id: "INC-2026-081",
      title: "Credential Phishing Perimeter Interception",
      target: "login-secure-account.xyz",
      action: "Perimeter DNS Sinkholed",
      analyst: "AI KAVACH Neural Engine",
      severity: "CRITICAL",
      status: "RESOLVED",
      timestamp: "14 mins ago"
    },
    {
      id: "INC-2026-080",
      title: "CEO Direct Wire Impersonation (BEC)",
      target: "elena.ceo@executive-internal-mail.xyz",
      action: "Quarantined & Sender Blacklisted",
      analyst: "Security Analyst",
      severity: "CRITICAL",
      status: "RESOLVED",
      timestamp: "42 mins ago"
    },
    {
      id: "INC-2026-079",
      title: "Anomalous Tor Exit Session Takeover Attempt",
      target: "185.220.101.5 (St. Petersburg)",
      action: "Session Revoked & Token Purged",
      analyst: "Automated Sentinel",
      severity: "HIGH",
      status: "RESOLVED",
      timestamp: "2 hours ago"
    },
    {
      id: "INC-2026-078",
      title: "Suspicious Multi-Part Archive Delivery",
      target: "invoice_2026.zip",
      action: "Sandbox Quarantined",
      analyst: "AI Mail Gateway",
      severity: "HIGH",
      status: "RESOLVED",
      timestamp: "5 hours ago"
    },
    {
      id: "INC-2026-077",
      title: "Synthetic Audio Teleconference Probe",
      target: "VoIP Stream ID: 8829-Voice",
      action: "Biometric Challenge Failed",
      analyst: "Deepfake Shield",
      severity: "MEDIUM",
      status: "IN_PROGRESS",
      timestamp: "Yesterday"
    },
    {
      id: "INC-2026-076",
      title: "Distributed SSH Brute Force Reconnaissance",
      target: "194.26.29.112/32",
      action: "Rate-Limit Exceeded -> IP Banned",
      analyst: "Perimeter Firewall",
      severity: "MEDIUM",
      status: "RESOLVED",
      timestamp: "2 days ago"
    }
  ]);

  const fetchLiveIncidents = async () => {
    setLoading(true);
    try {
      const data = await api.getIncidents();
      const items = Array.isArray(data) ? data : (data?.items || []);
      if (items.length > 0) {
        const mapped = items.map((inc) => ({
          id: inc.reference || `INC-2026-${String(inc.id).slice(-4)}`,
          title: inc.title || inc.summary || "Security Incident",
          target: inc.summary?.slice(0, 60) || "Detected Vector",
          action: inc.status === "Contained" ? "Contained" : (inc.severity === "Critical" ? "Immediate Triage" : "Review Evidence"),
          analyst: "AI KAVACH Sentinel",
          severity: (inc.severity || "HIGH").toUpperCase(),
          status: (inc.status || "OPEN").toUpperCase() === "OPEN" ? "IN_PROGRESS" : inc.status.toUpperCase(),
          timestamp: inc.first_seen_at ? new Date(inc.first_seen_at).toLocaleDateString([], { month: "short", day: "numeric" }) : "Recently",
          raw: inc
        }));
        setIncidents(mapped);
        notify("Incident ledger synchronized with database.");
      }
    } catch (e) {
      console.warn("Could not fetch live incidents:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveIncidents();
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      const matchSearch =
        search === "" ||
        `${inc.id} ${inc.title} ${inc.target} ${inc.action}`.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;
      if (filter === "ALL") return true;
      if (filter === "CRITICAL") return inc.severity === "CRITICAL";
      if (filter === "RESOLVED") return inc.status === "RESOLVED";
      if (filter === "IN_PROGRESS") return inc.status === "IN_PROGRESS";
      return true;
    });
  }, [incidents, filter, search]);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidents, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ai_kavach_audit_log_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notify("Incident audit ledger exported as JSON.");
  };

  const handleResolve = (id) => {
    setIncidents((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "RESOLVED" } : item))
    );
    notify(`Incident ${id} marked as resolved.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#8049D9]">
            <FileWarning size={14} /> Incident Response & Audit Ledger
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Security Incident Trail
          </h1>
          <p className="mt-1 text-xs text-[#888]">
            Immutable record of all neural detections, quarantine interventions, and analyst containment actions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchLiveIncidents}
            disabled={loading}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin text-[#a78ce9]" : "text-[#a78ce9]"} />
            Sync Ledger
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#3d2eb1] to-[#8049D9] px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:opacity-95"
          >
            <Download size={14} /> Export Audit Log
          </button>
        </div>
      </div>


      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Total Incidents</div>
          <div className="mt-1 text-2xl font-bold text-white">{incidents.length}</div>
          <div className="mt-0.5 text-[10px] text-[#888]">Logged this quarter</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Resolved</div>
          <div className="mt-1 text-2xl font-bold text-[#5bdba0]">
            {incidents.filter((i) => i.status === "RESOLVED").length}
          </div>
          <div className="mt-0.5 text-[10px] text-[#5fe0a5]">100% containment</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">In Progress</div>
          <div className="mt-1 text-2xl font-bold text-[#f4b860]">
            {incidents.filter((i) => i.status === "IN_PROGRESS").length}
          </div>
          <div className="mt-0.5 text-[10px] text-[#f4b860]">Under active review</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Mean Time to Contain</div>
          <div className="mt-1 text-2xl font-bold text-[#a78ce9]">1.4 min</div>
          <div className="mt-0.5 text-[10px] text-[#888]">Automated response</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-[#141414] p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#666] mr-2">
            <Filter size={12} /> Status:
          </span>
          {["ALL", "CRITICAL", "RESOLVED", "IN_PROGRESS"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                filter === f ? "bg-[#3d2eb1] text-white" : "text-[#888] hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              {f.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search incident ID, target, or action..."
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2 pl-9 pr-3 text-xs text-white outline-none focus:border-[#8049D9]"
          />
        </div>
      </div>

      {/* Incident List */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#141414] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-white/[0.06] bg-white/[0.02] text-[10px] font-bold uppercase text-[#888]">
              <tr>
                <th className="px-5 py-3.5">Incident ID</th>
                <th className="px-5 py-3.5">Threat Scenario</th>
                <th className="px-5 py-3.5">Target / Vector</th>
                <th className="px-5 py-3.5">Containment Action</th>
                <th className="px-5 py-3.5">Severity</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Time</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {filteredIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-white/[0.02] transition">
                  <td className="px-5 py-3.5 font-mono text-[#bda6ff] font-semibold">{inc.id}</td>
                  <td className="px-5 py-3.5 font-semibold text-white">{inc.title}</td>
                  <td className="px-5 py-3.5 font-mono text-[#aaa] max-w-[200px] truncate">{inc.target}</td>
                  <td className="px-5 py-3.5 text-[#5fe0a5] font-medium">{inc.action}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                        inc.severity === "CRITICAL"
                          ? "bg-[#ff6b81]/15 text-[#ff8799]"
                          : "bg-[#f4b860]/15 text-[#f4b860]"
                      }`}
                    >
                      {inc.severity}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                        inc.status === "RESOLVED"
                          ? "bg-[#4dd59a]/15 text-[#5fe0a5]"
                          : "bg-[#f4b860]/15 text-[#f4b860]"
                      }`}
                    >
                      {inc.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-[#666]">{inc.timestamp}</td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() =>
                          onOpenEvidence({
                            title: inc.title,
                            source: inc.target,
                            score: inc.severity === "CRITICAL" ? 95 : 82,
                            level: inc.severity,
                            category: "Incident Response Audit"
                          })
                        }
                        className="rounded-lg border border-white/10 px-2.5 py-1 text-[10px] text-[#a78ce9] hover:text-white transition"
                      >
                        Evidence
                      </button>
                      {inc.status === "IN_PROGRESS" && (
                        <button
                          onClick={() => handleResolve(inc.id)}
                          className="rounded-lg bg-[#3d2eb1] px-2.5 py-1 text-[10px] font-bold text-white hover:bg-[#4a38c8] transition"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

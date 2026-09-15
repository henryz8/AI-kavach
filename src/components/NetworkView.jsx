import React, { useState } from "react";
import {
  Network, Shield, Activity, Plus, Trash2,
  Lock, CheckCircle2, AlertTriangle, ArrowUpRight, Zap, RefreshCw
} from "lucide-react";
import { ToggleSwitch } from "./ToggleSwitch";

export function NetworkView({ notify }) {
  const [firewallRules, setFirewallRules] = useState([
    { id: "fw-1", name: "Tor Exit Node Perimeter Drop", proto: "TCP/UDP", port: "ALL", action: "DROP", enabled: true, desc: "Instantly drops all inbound SYN packets originating from published Tor exit nodes." },
    { id: "fw-2", name: "Inbound TLS 1.3 Inspection & Decrypt", proto: "HTTPS", port: "443", action: "INSPECT", enabled: true, desc: "Performs real-time deep packet inspection on encrypted egress/ingress streams." },
    { id: "fw-3", name: "SSH & RDP Strict Rate Limiter", proto: "TCP", port: "22, 3389", action: "RATE-LIMIT", enabled: true, desc: "Limits authentication attempts to 3 per minute before triggering perimeter ban." },
    { id: "fw-4", name: "Suspicious Dynamic DNS Sinkholing", proto: "DNS", port: "53", action: "SINKHOLE", enabled: true, desc: "Reroutes queries for freshly generated domains (DGA) to security blackhole." },
    { id: "fw-5", name: "Geo-Fence High Risk ASNs", proto: "ANY", port: "ANY", action: "CHALLENGE", enabled: false, desc: "Challenges traffic originating from bulletproof hosting providers with proof-of-work." }
  ]);

  const [blockedIps, setBlockedIps] = useState([
    { id: "ip-1", ip: "185.220.101.5/32", asn: "AS200052", location: "St. Petersburg, RU", reason: "Credential Brute Force", date: "10m ago" },
    { id: "ip-2", ip: "45.154.255.0/24", asn: "AS44034", location: "Amsterdam, NL", reason: "Botnet C2 Relay", date: "1h ago" },
    { id: "ip-3", ip: "194.26.29.112/32", asn: "AS197695", location: "Bucharest, RO", reason: "SSH Scanning & Exploitation", date: "4h ago" }
  ]);

  const [newIp, setNewIp] = useState("");
  const [newReason, setNewReason] = useState("");

  const handleToggleRule = (ruleId, currentVal) => {
    const updated = !currentVal;
    setFirewallRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: updated } : r))
    );
    const rule = firewallRules.find((r) => r.id === ruleId);
    notify(`Firewall rule '${rule?.name}' ${updated ? "armed" : "disarmed"}.`);
  };

  const handleAddIp = (e) => {
    e.preventDefault();
    if (!newIp.trim()) return;

    setBlockedIps((prev) => [
      {
        id: "ip-" + Date.now(),
        ip: newIp.trim(),
        asn: "Manual-ASN",
        location: "Network Edge",
        reason: newReason.trim() || "Manual perimeter blacklist",
        date: "Just now"
      },
      ...prev
    ]);

    notify(`IP ${newIp} blacklisted across perimeter firewall.`);
    setNewIp("");
    setNewReason("");
  };

  const handleUnblockIp = (id, ip) => {
    setBlockedIps((prev) => prev.filter((item) => item.id !== id));
    notify(`IP ${ip} removed from perimeter blacklist.`);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#8049D9]">
            <Network size={14} /> Network & Perimeter Sentinel
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Perimeter Firewall
          </h1>
          <p className="mt-1 text-xs text-[#888]">
            L4/L7 deep packet inspection, automated IP blacklisting, and honeypot sinkholes.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Throughput</div>
          <div className="mt-1 text-2xl font-bold text-white">1.4 Gbps</div>
          <div className="mt-0.5 text-[10px] text-[#5bdba0]">Zero dropped packets</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Inbound Drops</div>
          <div className="mt-1 text-2xl font-bold text-[#ff7184]">842</div>
          <div className="mt-0.5 text-[10px] text-[#ff7c8e]">Malicious probes stopped</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">DDoS Mitigations</div>
          <div className="mt-1 text-2xl font-bold text-[#5bdba0]">3 Repelled</div>
          <div className="mt-0.5 text-[10px] text-[#888]">SYN flood absorbed</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">TLS 1.3 Ratio</div>
          <div className="mt-1 text-2xl font-bold text-[#a78ce9]">99.4%</div>
          <div className="mt-0.5 text-[10px] text-[#888]">Encrypted ingress</div>
        </div>
      </div>

      {/* Active Rules List with Toggle Switches */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#141414] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-bold text-white">Perimeter Firewall Rulebook</div>
            <div className="text-[11px] text-[#888]">Toggle automated inspection rules across edge proxies</div>
          </div>
          <span className="rounded-full bg-[#3d2eb1]/20 px-2.5 py-0.5 text-[10px] font-bold text-[#bda6ff]">
            {firewallRules.filter((r) => r.enabled).length} / {firewallRules.length} Active
          </span>
        </div>

        <div className="space-y-3">
          {firewallRules.map((rule) => (
            <div
              key={rule.id}
              className="flex flex-col justify-between gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition hover:bg-white/[0.03] sm:flex-row sm:items-center"
            >
              <div className="pr-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{rule.name}</span>
                  <span className="rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[9px] text-[#aaa]">
                    {rule.proto}:{rule.port}
                  </span>
                  <span
                    className={`rounded px-1.5 py-0.5 font-mono text-[9px] font-bold ${
                      rule.action === "DROP"
                        ? "bg-[#ff6b81]/20 text-[#ff8799]"
                        : rule.action === "SINKHOLE"
                        ? "bg-[#8049D9]/20 text-[#bda6ff]"
                        : "bg-[#4dd59a]/20 text-[#5fe0a5]"
                    }`}
                  >
                    {rule.action}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-[#888]">{rule.desc}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="text-[11px] font-bold text-[#888]">
                  {rule.enabled ? "ENABLED" : "DISABLED"}
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={rule.enabled}
                  onClick={() => handleToggleRule(rule.id, rule.enabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    rule.enabled ? "bg-[#3d2eb1]" : "bg-white/20"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      rule.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blocked IP Subnets */}
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl border border-white/[0.07] bg-[#141414] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-bold text-white">Blacklisted IP Subnets</div>
              <div className="text-[11px] text-[#888]">Packets from these ranges are silently dropped</div>
            </div>
            <span className="text-[11px] text-[#888] font-mono">{blockedIps.length} subnets</span>
          </div>

          <div className="divide-y divide-white/[0.05]">
            {blockedIps.map((b) => (
              <div key={b.id} className="flex items-center justify-between py-3">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#ff8799]">{b.ip}</span>
                    <span className="font-mono text-[9px] text-[#888]">{b.asn}</span>
                  </div>
                  <div className="text-[10px] text-[#888] mt-0.5">
                    {b.location} • {b.reason}
                  </div>
                </div>
                <button
                  onClick={() => handleUnblockIp(b.id, b.ip)}
                  className="flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1 text-[10px] text-[#888] hover:text-[#ff8799] transition shrink-0"
                >
                  <Trash2 size={11} /> Unblock
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add IP Form */}
        <div className="rounded-2xl border border-white/[0.07] bg-[#141414] p-5 space-y-4">
          <div>
            <div className="text-xs font-bold text-white">Blacklist Malicious IP / CIDR</div>
            <div className="text-[11px] text-[#888]">Add rogue IP address or subnet to drop list</div>
          </div>

          <form onSubmit={handleAddIp} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#aaa] mb-1">IP Address or CIDR</label>
              <input
                required
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                placeholder="198.51.100.24 or 203.0.113.0/24"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white outline-none focus:border-[#8049D9]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#aaa] mb-1">Reason / Threat Vector</label>
              <input
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="e.g. Distributed brute-force bot"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white outline-none focus:border-[#8049D9]"
              />
            </div>
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3d2eb1] py-2.5 text-xs font-bold text-white hover:bg-[#4a38c8] transition shadow"
            >
              <Plus size={14} /> Add to Drop Table
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

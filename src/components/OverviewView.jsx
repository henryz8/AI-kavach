import React, { useState, useMemo } from "react";
import {
  Activity, AlertTriangle, ArrowUpRight, BrainCircuit, Check,
  ChevronDown, ExternalLink, FileWarning, Fingerprint, Globe2,
  LockKeyhole, Sparkles, UserRound, Zap
} from "lucide-react";
import {
  AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
  PieChart, Pie, Cell
} from "recharts";

const purple = "#8049D9";

const chartDataSets = {
  "7d": [
    { name: "Mon", threats: 14 },
    { name: "Tue", threats: 28 },
    { name: "Wed", threats: 45 },
    { name: "Thu", threats: 32 },
    { name: "Fri", threats: 59 },
    { name: "Sat", threats: 38 },
    { name: "Sun", threats: 67 }
  ],
  "30d": [
    { name: "00", threats: 18 },
    { name: "04", threats: 31 },
    { name: "08", threats: 25 },
    { name: "12", threats: 48 },
    { name: "16", threats: 39 },
    { name: "20", threats: 63 },
    { name: "24", threats: 51 },
    { name: "28", threats: 72 }
  ],
  "90d": [
    { name: "W1", threats: 110 },
    { name: "W2", threats: 142 },
    { name: "W3", threats: 185 },
    { name: "W4", threats: 160 },
    { name: "W5", threats: 215 },
    { name: "W6", threats: 240 },
    { name: "W7", threats: 198 },
    { name: "W8", threats: 280 },
    { name: "W9", threats: 320 }
  ]
};

const riskData = [
  { name: "Critical", value: 24, color: "#ff6b81" },
  { name: "High", value: 86, color: "#f4b860" },
  { name: "Medium", value: 214, color: "#a98be8" },
  { name: "Safe", value: 960, color: "#4dd59a" }
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
    MEDIUM: "bg-[#a98be8]/10 text-[#cbb6f8]",
    SAFE: "bg-[#4dd59a]/10 text-[#5fe0a5]",
    RESOLVED: "bg-[#4dd59a]/10 text-[#5fe0a5]"
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${map[level] || map.SAFE}`}>
      {level}
    </span>
  );
}

export function OverviewView({
  currentUser,
  threatList,
  dbStats,
  query,
  handleThreatAction,
  handleExecuteResponseWorkflow,
  notify,
  onOpenEvidence,
  onOpenScan,
  setActive
}) {
  const [timeRange, setTimeRange] = useState("30d");

  const stats = dbStats?.stats;
  const totalTelemetry = stats?.totals?.scans ?? threatList.length;
  const criticalCount = stats?.scans_by_severity?.Critical ?? threatList.filter(t => t.level === "CRITICAL").length;
  const highRiskCount = stats?.totals?.high_risk_scans ?? threatList.filter(t => t.level === "HIGH" || t.level === "CRITICAL").length;
  const criticalActive = threatList.filter(t => t.level === "CRITICAL" && !t.isContained).length;
  const containedCount = stats?.actions_by_status?.simulated ?? stats?.actions_by_status?.succeeded ?? threatList.filter(t => t.isContained).length;
  const avgRiskScore = stats?.totals?.average_risk_score ? `${stats.totals.average_risk_score}%` : "98.4%";

  const dynamicRiskData = useMemo(() => {
    if (stats?.scans_by_severity) {
      return [
        { name: "Critical", value: stats.scans_by_severity.Critical || 0, color: "#ff6b81" },
        { name: "High", value: stats.scans_by_severity.High || 0, color: "#f4b860" },
        { name: "Medium", value: stats.scans_by_severity.Medium || 0, color: "#a98be8" },
        { name: "Safe", value: stats.scans_by_severity.Safe || 0, color: "#4dd59a" }
      ];
    }
    const critical = threatList.filter(t => t.level === "CRITICAL").length;
    const high = threatList.filter(t => t.level === "HIGH").length;
    const medium = threatList.filter(t => t.level === "MEDIUM").length;
    const safe = threatList.filter(t => t.level === "SAFE").length;
    return [
      { name: "Critical", value: critical || 1, color: "#ff6b81" },
      { name: "High", value: high || 1, color: "#f4b860" },
      { name: "Medium", value: medium || 1, color: "#a98be8" },
      { name: "Safe", value: safe || 1, color: "#4dd59a" }
    ];
  }, [stats, threatList]);

  const filtered = query
    ? threatList.filter((t) => `${t.title} ${t.source} ${t.level}`.toLowerCase().includes(query.toLowerCase()))
    : threatList;

  const currentChartData = useMemo(() => {
    if (stats?.trend && Array.isArray(stats.trend) && stats.trend.length > 0) {
      return stats.trend.map(t => ({
        name: t.day.slice(5),
        threats: t.scans,
        highRisk: t.high_risk
      }));
    }
    return chartDataSets[timeRange] || chartDataSets["30d"];
  }, [stats, timeRange]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Greeting banner */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#8049D9]">
            <Sparkles size={13} /> AI Security Workspace
          </div>
          <h1 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl text-white">
            Good evening, {(currentUser?.name || "Analyst").split(" ")[0]}
          </h1>
          <p className="mt-2 text-sm text-[#777477]">
            Your security environment is protected. Here’s what the AI found today.
          </p>
        </div>
        <button
          onClick={onOpenScan}
          className="group flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#ebe6e7] to-white px-4 py-2.5 text-xs font-bold text-[#111] transition hover:shadow-[0_0_20px_rgba(255,255,255,0.25)]"
        >
          <Zap size={14} className="text-[#3d2eb1] fill-[#3d2eb1]" /> Run AI Scan
          <ArrowUpRight size={14} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["TOTAL THREATS SCANNED", totalTelemetry.toLocaleString(), `${highRiskCount} high-risk detected`, Activity],
          ["CRITICAL SEVERITY", String(criticalCount), `${criticalActive} active in queue`, AlertTriangle],
          ["ACTIONS EXECUTED", containedCount.toLocaleString(), "Containment response ledger", Globe2],
          ["AVG RISK INDEX", avgRiskScore, "Live Heuristic & ML Model", BrainCircuit]
        ].map(([label, value, sub, Icon], i) => (
          <Card key={label} className="group relative overflow-hidden p-5 transition hover:-translate-y-1 hover:border-[#8049D9]/30">
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#8049D9]/10 blur-2xl opacity-0 transition group-hover:opacity-100" />
            <div className="mb-8 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-[.17em] text-[#686467]">{label}</span>
              <Icon size={17} className={i === 1 ? "text-[#ff7184]" : "text-[#a78ce9]"} />
            </div>
            <div className="text-3xl font-semibold tracking-[-.04em] text-white">{value}</div>
            <div className={`mt-1 text-[11px] ${i === 1 ? "text-[#ff7c8e]" : "text-[#5bdba0]"}`}>{sub}</div>
          </Card>
        ))}
      </div>


      {/* Threat Activity Area Chart & Exposure Donut Chart */}
      <div className="grid gap-4 xl:grid-cols-[1.65fr_1fr]">
        <Card className="p-5 sm:p-6">
          <div className="mb-7 flex items-start justify-between">
            <div>
              <div className="text-[10px] font-bold tracking-[.17em] text-[#686467]">THREAT ACTIVITY</div>
              <div className="mt-2 text-xl font-semibold text-white">Threats detected</div>
            </div>
            {/* Interactive Time Range Switcher */}
            <div className="flex rounded-full border border-white/[.08] bg-white/[0.03] p-0.5">
              {["7d", "30d", "90d"].map((range) => (
                <button
                  key={range}
                  onClick={() => {
                    setTimeRange(range);
                    notify(`Switched telemetry to last ${range.toUpperCase()}`);
                  }}
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold transition ${
                    timeRange === range
                      ? "bg-[#3d2eb1] text-white shadow"
                      : "text-[#888] hover:text-white"
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentChartData}>
                <defs>
                  <linearGradient id="threatFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={purple} stopOpacity={0.42} />
                    <stop offset="100%" stopColor={purple} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,.04)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#5e5b5e", fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#5e5b5e", fontSize: 10 }} width={28} />
                <Tooltip
                  contentStyle={{
                    background: "#191919",
                    border: "1px solid rgba(255,255,255,.08)",
                    borderRadius: 14,
                    color: "#fff",
                    fontSize: 11
                  }}
                />
                <Area type="monotone" dataKey="threats" stroke={purple} strokeWidth={2.5} fill="url(#threatFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Risk Exposure */}
        <Card className="p-5 sm:p-6">
          <div className="text-[10px] font-bold tracking-[.17em] text-[#686467]">RISK OVERVIEW</div>
          <div className="mt-2 text-xl font-semibold text-white">Current exposure</div>
          <div className="flex items-center justify-center py-2">
            <div className="relative h-[190px] w-[190px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dynamicRiskData} dataKey="value" innerRadius={62} outerRadius={84} paddingAngle={3} stroke="none">
                    {dynamicRiskData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-3xl font-semibold text-white">{totalTelemetry.toLocaleString()}</div>
                  <div className="text-[9px] font-bold tracking-[.16em] text-[#666365]">TELEMETRY</div>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {dynamicRiskData.map((r) => (
              <div key={r.name} className="flex items-center justify-between rounded-xl bg-white/[.025] px-3 py-2">
                <span className="flex items-center gap-2 text-[10px] text-[#777477]">
                  <i style={{ background: r.color }} className="h-1.5 w-1.5 rounded-full" />
                  {r.name}
                </span>
                <b className="text-[11px] text-white">{r.value}</b>
              </div>
            ))}
          </div>

        </Card>
      </div>

      {/* Recent Threats and AI Recommendations */}
      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[.06] px-5 py-5 sm:px-6">
            <div>
              <div className="text-[10px] font-bold tracking-[.17em] text-[#686467]">RECENT THREATS</div>
              <div className="mt-1 text-lg font-semibold text-white">Latest detections</div>
            </div>
            <button
              onClick={() => setActive("Threat Detection")}
              className="text-[11px] font-semibold text-[#a78ce9] hover:text-white transition"
            >
              View all <ArrowUpRight className="ml-1 inline" size={13} />
            </button>
          </div>
          <div className="divide-y divide-white/[.05]">
            {filtered.length ? (
              filtered.map((t) => {
                const Icon = t.icon || AlertTriangle;
                return (
                  <div key={t.title} className="flex items-center gap-3 px-5 py-4 transition hover:bg-white/[.025] sm:px-6">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/[.035]">
                      <Icon size={17} className="text-[#a78ce9]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-semibold text-white">{t.title}</div>
                      <div className="mt-1 truncate text-[10px] text-[#666365] font-mono">{t.source}</div>
                    </div>
                    <div className="hidden sm:block">
                      <RiskBadge level={t.level} />
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">{t.score}</div>
                      <div className="text-[9px] text-[#5f5c5f]">RISK</div>
                    </div>
                    <button
                      onClick={() =>
                        onOpenEvidence({
                          title: t.title,
                          source: t.source,
                          score: t.score,
                          level: t.level,
                          category: "Recent Threat Telemetry",
                          action: t.action
                        })
                      }
                      className="hidden sm:flex items-center gap-1 rounded-xl border border-white/10 px-2.5 py-1.5 text-[10px] text-[#a78ce9] hover:text-white transition"
                    >
                      <ExternalLink size={10} /> Evidence
                    </button>
                    <button
                      disabled={t.isContained}
                      onClick={() => handleThreatAction(t)}
                      className={`rounded-xl border px-3 py-2 text-[10px] font-semibold transition ${
                        t.isContained
                          ? "border-[#4dd59a]/30 bg-[#4dd59a]/10 text-[#5fe0a5] cursor-default"
                          : "border-white/[.06] text-[#aaa6a8] hover:border-[#8049D9]/50 hover:text-white"
                      }`}
                    >
                      {t.isContained ? "Contained ✓" : t.action}
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="px-6 py-10 text-center text-xs text-[#666365]">No threats match “{query}”.</div>
            )}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold tracking-[.17em] text-[#686467]">AI RECOMMENDATION</div>
              <div className="mt-1 text-lg font-semibold text-white">Containment plan</div>
            </div>
            <BrainCircuit size={19} className="text-[#a78ce9]" />
          </div>
          <div className="rounded-2xl border border-[#8049D9]/20 bg-[#8049D9]/[.07] p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-white">
              <Sparkles size={14} className="text-[#bda6ff]" /> AI analysis
            </div>
            <p className="text-xs leading-5 text-[#aaa6a8]">
              The current risk cluster suggests coordinated phishing activity targeting credentials. Immediate containment is recommended.
            </p>
          </div>
          <div className="mt-4 space-y-2">
            {[
              "Block malicious URLs",
              "Quarantine suspicious emails",
              "Revoke anomalous sessions"
            ].map((x) => (
              <button
                key={x}
                onClick={() => notify(`${x} workflow armed.`)}
                className="flex w-full items-center gap-3 rounded-2xl border border-white/[.06] p-3 text-left text-xs hover:bg-white/[.03] transition text-white"
              >
                <span className="grid h-6 w-6 place-items-center rounded-full bg-[#4dd59a]/10 text-[#5fe0a5]">
                  <Check size={12} />
                </span>
                {x}
                <ArrowUpRight size={13} className="ml-auto text-[#5e5b5e]" />
              </button>
            ))}
          </div>
          <button
            onClick={handleExecuteResponseWorkflow}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#3d2eb1] py-3 text-xs font-bold text-white transition hover:bg-[#4a38c8] shadow-lg shadow-[#3d2eb1]/20"
          >
            <Zap size={14} /> Execute response
          </button>
        </Card>
      </div>

      {/* Forensic Intelligence Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["PHISHING DETECTION", "94", "Credential harvesting", Globe2, "CRITICAL", "login-secure-account.xyz"],
          ["ACCOUNT TAKEOVER", "87", "New device anomaly", LockKeyhole, "HIGH", "185.220.101.5 (Tor Exit)"],
          ["DIGITAL IMPERSONATION", "92", "Identity mismatch", Fingerprint, "CRITICAL", "elena.ceo@executive-internal-mail.xyz"]
        ].map(([title, score, evidence, Icon, level, source]) => (
          <Card key={title} className="group p-5 transition hover:-translate-y-1 hover:border-[#8049D9]/30">
            <div className="flex items-center justify-between">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#8049D9]/10 text-[#a98be8]">
                <Icon size={16} />
              </div>
              <RiskBadge level={level} />
            </div>
            <div className="mt-5 text-[10px] font-bold tracking-[.14em] text-[#686467]">{title}</div>
            <div className="mt-1 flex items-end gap-2 text-white">
              <span className="text-4xl font-semibold tracking-[-.05em]">{score}</span>
              <span className="mb-1 text-[10px] text-[#5f5c5f]">/100 RISK</span>
            </div>
            <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[.06]">
              <div style={{ width: `${score}%` }} className="h-full rounded-full bg-gradient-to-r from-[#3d2eb1] to-[#deaff6]" />
            </div>
            <div className="mt-4 flex items-center justify-between text-[10px] text-[#777477]">
              <span>{evidence}</span>
              <button
                onClick={() =>
                  onOpenEvidence({
                    title,
                    source,
                    score: parseInt(score, 10),
                    level,
                    category: title
                  })
                }
                className="flex items-center gap-1 font-semibold text-[#a78ce9] hover:text-white transition"
              >
                Evidence <ExternalLink size={11} />
              </button>
            </div>
          </Card>
        ))}
      </div>

      <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-white/[.05] py-6 text-[10px] text-[#555155] sm:flex-row">
        <span>AI KAVACH • Threat Intelligence Workspace</span>
        <span className="flex items-center gap-1">
          <Activity size={11} className="text-[#4dd59a]" /> All systems operational
        </span>
      </footer>
    </div>
  );
}

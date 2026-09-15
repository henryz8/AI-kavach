import React, { useState, useMemo } from "react";
import {
  ShieldAlert, ShieldCheck, AlertTriangle, Globe2, LockKeyhole,
  UserRound, FileWarning, Search, Zap, ExternalLink, Filter, CheckCircle2
} from "lucide-react";

export function ThreatDetectionView({
  threats,
  onThreatAction,
  onOpenEvidence,
  onOpenScan,
  notify
}) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredThreats = useMemo(() => {
    return threats.filter((t) => {
      const matchSearch =
        search === "" ||
        `${t.title} ${t.source} ${t.level}`.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;
      if (filter === "ALL") return true;
      if (filter === "CONTAINED") return t.isContained;
      if (filter === "CRITICAL") return t.level === "CRITICAL" && !t.isContained;
      if (filter === "HIGH") return t.level === "HIGH" && !t.isContained;
      if (filter === "MEDIUM") return t.level === "MEDIUM" && !t.isContained;
      return true;
    });
  }, [threats, filter, search]);

  const stats = useMemo(() => {
    const critical = threats.filter((t) => t.level === "CRITICAL" && !t.isContained).length;
    const high = threats.filter((t) => t.level === "HIGH" && !t.isContained).length;
    const contained = threats.filter((t) => t.isContained).length;
    return { total: threats.length, critical, high, contained };
  }, [threats]);

  const handleContainAll = () => {
    threats.forEach((t) => {
      if (!t.isContained) {
        onThreatAction(t);
      }
    });
    notify("Containment workflow initiated for all active threats.");
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#8049D9]">
            <ShieldAlert size={14} /> Threat Intelligence & Detection
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Live Threat Radar
          </h1>
          <p className="mt-1 text-xs text-[#888]">
            Real-time neural heuristics identifying credential theft, ransomware vectors, and unauthorized access.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenScan}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#3d2eb1] to-[#8049D9] px-4 py-2.5 text-xs font-bold text-white shadow-lg transition hover:opacity-95"
          >
            <Zap size={14} /> Scan Asset with AI
          </button>
          <button
            onClick={handleContainAll}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/10"
          >
            <ShieldCheck size={14} className="text-[#5fe0a5]" /> Contain All Active
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Total Telemetry</div>
          <div className="mt-1 text-2xl font-bold text-white">{stats.total}</div>
          <div className="mt-0.5 text-[10px] text-[#888]">Logged incidents</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Critical Threats</div>
          <div className="mt-1 text-2xl font-bold text-[#ff7184]">{stats.critical}</div>
          <div className="mt-0.5 text-[10px] text-[#ff7c8e]">Requires immediate action</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">High Priority</div>
          <div className="mt-1 text-2xl font-bold text-[#f4b860]">{stats.high}</div>
          <div className="mt-0.5 text-[10px] text-[#f4b860]">Elevated risk pattern</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Contained</div>
          <div className="mt-1 text-2xl font-bold text-[#5bdba0]">{stats.contained}</div>
          <div className="mt-0.5 text-[10px] text-[#5fe0a5]">Perimeter secured</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.06] bg-[#141414] p-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#666] mr-2">
            <Filter size={12} /> Filter:
          </span>
          {["ALL", "CRITICAL", "HIGH", "CONTAINED"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                filter === f
                  ? "bg-[#3d2eb1] text-white shadow"
                  : "text-[#888] hover:bg-white/[0.05] hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" size={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search target, level, source..."
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2 pl-9 pr-3 text-xs text-white outline-none focus:border-[#8049D9]"
          />
        </div>
      </div>

      {/* Threats List */}
      <div className="space-y-3">
        {filteredThreats.length > 0 ? (
          filteredThreats.map((t) => {
            const Icon = t.icon || AlertTriangle;
            return (
              <div
                key={t.title + t.source}
                className="group flex flex-col justify-between gap-4 rounded-2xl border border-white/[0.07] bg-[#141414] p-4 transition hover:border-[#8049D9]/40 sm:flex-row sm:items-center"
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/[0.04] text-[#a78ce9] shadow-inner">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{t.title}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                          t.isContained
                            ? "bg-[#4dd59a]/15 text-[#5fe0a5]"
                            : t.level === "CRITICAL"
                            ? "bg-[#ff6b81]/15 text-[#ff8799]"
                            : "bg-[#f4b860]/15 text-[#f4b860]"
                        }`}
                      >
                        {t.isContained ? "CONTAINED" : t.level}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-xs text-[#888] break-all">{t.source}</div>
                    <div className="mt-2 flex items-center gap-3">
                      <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/[0.08]">
                        <div
                          style={{ width: `${t.score}%` }}
                          className={`h-full rounded-full ${
                            t.score > 85 ? "bg-[#ff6b81]" : t.score > 70 ? "bg-[#f4b860]" : "bg-[#4dd59a]"
                          }`}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-[#888]">{t.score}/100 Risk</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() =>
                      onOpenEvidence({
                        title: t.title,
                        source: t.source,
                        score: t.score,
                        level: t.level,
                        category: "Threat Telemetry",
                        action: t.action
                      })
                    }
                    className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs font-semibold text-[#a78ce9] transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <ExternalLink size={12} /> Evidence Dossier
                  </button>

                  <button
                    disabled={t.isContained}
                    onClick={() => onThreatAction(t)}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition shadow-md ${
                      t.isContained
                        ? "border border-[#4dd59a]/30 bg-[#4dd59a]/10 text-[#5fe0a5] cursor-default"
                        : "bg-[#3d2eb1] text-white hover:bg-[#4a38c8]"
                    }`}
                  >
                    {t.isContained ? "Contained ✓" : t.action}
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-12 text-center">
            <CheckCircle2 size={32} className="mx-auto text-[#5fe0a5] mb-2 opacity-80" />
            <div className="text-sm font-semibold text-white">No threats match current filter</div>
            <p className="mt-1 text-xs text-[#888]">All inspected perimeter vectors are nominal and protected.</p>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  Fingerprint, Sparkles, AlertTriangle, CheckCircle2,
  Play, ShieldAlert, Sliders, Activity, Loader2
} from "lucide-react";
import { ToggleSwitch } from "./ToggleSwitch";

export function DeepfakeView({ notify }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [sampleType, setSampleType] = useState("audio"); // "audio" | "video"
  const [sampleUrl, setSampleUrl] = useState("https://telecom-stream.internal/ceo_urgent_memo.wav");
  const [result, setResult] = useState(null);

  const [voiceShield, setVoiceShield] = useState(true);
  const [videoQuarantine, setVideoQuarantine] = useState(true);
  const [glottalPulseLogging, setGlottalPulseLogging] = useState(false);

  const recentIntercepts = [
    {
      id: "df-1",
      target: "ceo_voice_memo_transfer.wav",
      type: "Audio Voice Clone",
      confidence: "98.6%",
      signature: "ElevenLabs Neural TTS clone",
      verdict: "SYNTHETIC",
      time: "12m ago"
    },
    {
      id: "df-2",
      target: "cfo_zoom_briefing_sample.mp4",
      type: "Video Face Swap",
      confidence: "94.2%",
      signature: "DeepFaceLab landmark artifact",
      verdict: "SYNTHETIC",
      time: "2h ago"
    },
    {
      id: "df-3",
      target: "analyst_standup_audio.m4a",
      type: "Microphone Audio",
      confidence: "99.1%",
      signature: "Natural human glottal entropy",
      verdict: "AUTHENTIC",
      time: "Yesterday"
    }
  ];

  const handleRunAnalysis = () => {
    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      setAnalyzing(false);
      setResult({
        verdict: "CRITICAL: Synthetic Voice Clone Detected",
        score: 97.4,
        metrics: [
          { name: "Glottal Frequency Incoherence", value: "94.2%", status: "Abnormal" },
          { name: "Phase Delay Spectral Jitter", value: "98.1%", status: "Synthetic" },
          { name: "Natural Vocal Cord Entropy", value: "0.02 (Expected > 0.4)", status: "Zero-Entropy Clone" },
          { name: "Acoustic TTS Fingerprint", value: "ElevenLabs v3 Ensemble", status: "Identified" }
        ],
        recommendation: "Flagged audio displays mathematical signatures of synthetic neural speech synthesis. Reject authorization."
      });
      notify("Deepfake forensic analysis complete. High-risk synthesis confirmed.");
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#8049D9]">
            <Fingerprint size={14} /> Biometric & Synthetic Media Authenticity
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Deepfake Shield
          </h1>
          <p className="mt-1 text-xs text-[#888]">
            Neural acoustic frequency verification, facial landmark micro-jitter analysis, and synthetic speech classification.
          </p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Classifier Accuracy</div>
          <div className="mt-1 text-2xl font-bold text-white">98.8%</div>
          <div className="mt-0.5 text-[10px] text-[#5bdba0]">Validated on DeepForensics</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Media Intercepted</div>
          <div className="mt-1 text-2xl font-bold text-[#ff7184]">14</div>
          <div className="mt-0.5 text-[10px] text-[#ff7c8e]">Audio & Video clones</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Inspection Latency</div>
          <div className="mt-1 text-2xl font-bold text-[#a78ce9]">45ms</div>
          <div className="mt-0.5 text-[10px] text-[#888]">Real-time VoIP stream</div>
        </div>
        <div className="rounded-2xl border border-white/[0.06] bg-[#141414] p-4">
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#686467]">Live Shield</div>
          <div className="mt-1 text-2xl font-bold text-[#5bdba0]">ACTIVE</div>
          <div className="mt-0.5 text-[10px] text-[#5fe0a5]">Inbound call defense</div>
        </div>
      </div>

      {/* Interactive Biometric Simulator */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#141414] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-bold text-white">Deepfake Forensic Inspector</div>
            <div className="text-[11px] text-[#888]">Analyze voice notes, video clips, or meeting recordings</div>
          </div>
          <div className="flex rounded-xl bg-white/[0.04] p-1 border border-white/[0.06]">
            <button
              onClick={() => { setSampleType("audio"); setSampleUrl("https://telecom-stream.internal/ceo_urgent_memo.wav"); }}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                sampleType === "audio" ? "bg-[#3d2eb1] text-white" : "text-[#888] hover:text-white"
              }`}
            >
              Audio Speech
            </button>
            <button
              onClick={() => { setSampleType("video"); setSampleUrl("https://telecom-stream.internal/cfo_video_call.mp4"); }}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                sampleType === "video" ? "bg-[#3d2eb1] text-white" : "text-[#888] hover:text-white"
              }`}
            >
              Video Stream
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row mb-3">
          <input
            value={sampleUrl}
            onChange={(e) => setSampleUrl(e.target.value)}
            placeholder="Enter media stream URI or file path..."
            className="flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-xs text-white outline-none focus:border-[#8049D9]"
          />
          <button
            disabled={analyzing}
            onClick={handleRunAnalysis}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#3d2eb1] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#4a38c8] transition shadow-md disabled:opacity-50"
          >
            {analyzing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {analyzing ? "Running Neural Decomposition..." : "Analyze Biometrics"}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="text-[#666]">Simulate samples:</span>
          <button
            onClick={() => {
              setSampleUrl("https://telecom-stream.internal/ceo_urgent_wire_voice_clone.wav");
              handleRunAnalysis();
            }}
            className="text-[#ff8799] underline"
          >
            CEO Voice Clone Sample (97%)
          </button>
          <span className="text-[#444]">•</span>
          <button
            onClick={() => {
              setSampleUrl("https://telecom-stream.internal/human_executive_speech.wav");
              setResult({
                verdict: "AUTHENTIC: Human Vocal Patterns Confirmed",
                score: 2.1,
                metrics: [
                  { name: "Glottal Frequency Incoherence", value: "1.4%", status: "Natural" },
                  { name: "Phase Delay Spectral Jitter", value: "2.8%", status: "Natural" },
                  { name: "Natural Vocal Cord Entropy", value: "0.82", status: "Organic Human" },
                  { name: "Acoustic TTS Fingerprint", value: "None", status: "Clean" }
                ],
                recommendation: "Sample exhibits organic vocal tract resonances and physiological harmonics."
              });
              notify("Sample verified as authentic human voice.");
            }}
            className="text-[#5fe0a5] underline"
          >
            Authentic Human Audio Sample
          </button>
        </div>

        {result && (
          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#888]">Classification</span>
                <div className={`text-sm font-bold mt-0.5 ${
                  result.score > 50 ? "text-[#ff8799]" : "text-[#5fe0a5]"
                }`}>
                  {result.verdict}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#888]">Synthetic Confidence</span>
                <div className="text-xl font-bold text-white">{result.score}%</div>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 mb-3">
              {result.metrics.map((m) => (
                <div key={m.name} className="rounded-xl bg-white/[0.02] p-2.5 border border-white/[0.04]">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#888]">{m.name}</span>
                    <span className="font-mono font-bold text-white">{m.value}</span>
                  </div>
                  <div className="mt-1 text-[10px] font-semibold text-[#a78ce9]">{m.status}</div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-[#aaa]">{result.recommendation}</p>
          </div>
        )}
      </div>

      {/* Recent Intercepts */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#141414] p-5">
        <div className="text-xs font-bold text-white mb-3">Recent Synthetic Media Interceptions</div>
        <div className="divide-y divide-white/[0.05]">
          {recentIntercepts.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{item.target}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold ${
                    item.verdict === "SYNTHETIC" ? "bg-[#ff6b81]/20 text-[#ff8799]" : "bg-[#4dd59a]/20 text-[#5fe0a5]"
                  }`}>
                    {item.verdict} ({item.confidence})
                  </span>
                </div>
                <div className="text-[11px] text-[#888] mt-0.5">{item.signature} • {item.time}</div>
              </div>
              <button
                onClick={() => notify(`Forensic export created for ${item.target}`)}
                className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-[#a78ce9] hover:text-white transition"
              >
                Inspect Spectrogram
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Policies */}
      <div className="rounded-2xl border border-white/[0.07] bg-[#141414] p-5 space-y-3">
        <div className="text-xs font-bold text-white mb-2">Deepfake Defense Protocols</div>
        <ToggleSwitch
          checked={voiceShield}
          onChange={(val) => {
            setVoiceShield(val);
            notify(`Voice synthesis guard ${val ? "enabled" : "disabled"}.`);
          }}
          label="Real-Time Voice Verification on Executive Teleconferences"
          description="Analyzes microphone input stream and flags synthetic voice conversion within 50ms."
        />
        <ToggleSwitch
          checked={videoQuarantine}
          onChange={(val) => {
            setVideoQuarantine(val);
            notify(`Video deepfake quarantine ${val ? "enabled" : "disabled"}.`);
          }}
          label="Auto-Quarantine Inbound Media Attachments with >80% Synthetic Score"
          description="Prevents video and audio files from executing in chat or email clients without analyst sign-off."
        />
        <ToggleSwitch
          checked={glottalPulseLogging}
          onChange={(val) => {
            setGlottalPulseLogging(val);
            notify(`Glottal pulse logging ${val ? "enabled" : "disabled"}.`);
          }}
          label="Preserve Acoustic Artifact Spectra for Law Enforcement Dossier"
          description="Maintains encrypted cryptographic evidence logs for forensic cybercrime investigations."
        />
      </div>
    </div>
  );
}

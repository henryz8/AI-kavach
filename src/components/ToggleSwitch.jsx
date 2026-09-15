import React from "react";

export function ToggleSwitch({ checked, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.035] transition">
      <div className="pr-4">
        <div className="text-xs font-semibold text-white">{label}</div>
        {description && <div className="text-[11px] text-[#888] mt-0.5 leading-relaxed">{description}</div>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? "bg-[#8049D9]" : "bg-white/20"
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

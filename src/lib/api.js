/**
 * AI KAVACH API Client
 * Seamlessly connects the React dashboard to the FastAPI backend (localhost:8000).
 * Gracefully falls back if the backend is not running.
 */

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (typeof window !== "undefined") {
    const isCapacitor = window.Capacitor?.getPlatform?.() === "android" || window.location.protocol === "capacitor:";
    if (isCapacitor) {
      return "http://10.0.2.2:8000/api";
    }
  }
  return "http://localhost:8000/api";
};

const API_BASE_URL = getApiBaseUrl();

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API error ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[AI KAVACH API] Could not reach ${url}:`, err.message);
    throw err;
  }
}

export const api = {
  // Health
  checkHealth: () => request("/health"),

  // Dashboard
  getStatistics: () => request("/dashboard/statistics"),
  getActivity: () => request("/dashboard/activity"),
  getRiskDistribution: () => request("/dashboard/risk-distribution"),
  getDashboard: () => request("/dashboard"),

  // Threats
  getThreats: (query = "") => {
    const q = query ? `?query=${encodeURIComponent(query)}` : "";
    return request(`/threats${q}`);
  },
  createThreat: (threatData) =>
    request("/threats", {
      method: "POST",
      body: JSON.stringify(threatData),
    }),
  dismissThreat: (threatId) =>
    request(`/threats/${threatId}`, {
      method: "DELETE",
    }),

  // AI Analysis Engines
  analyzeUrl: (url) =>
    request("/analyze/url", {
      method: "POST",
      body: JSON.stringify({ url }),
    }),
  analyzeEmail: ({ sender, subject, body, attachment_name = null }) =>
    request("/analyze/email", {
      method: "POST",
      body: JSON.stringify({ sender, subject, body, attachment_name }),
    }),
  analyzeText: (text) =>
    request("/analyze/text", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
  analyzeCode: (code, language = "generic") =>
    request("/analyze/code", {
      method: "POST",
      body: JSON.stringify({ code, language }),
    }),

  // Incident Containment Responses
  blockUrl: (url, reason = "Phishing domain detected") =>
    request("/response/block-url", {
      method: "POST",
      body: JSON.stringify({ url, reason }),
    }),
  quarantine: (itemIdentifier, itemType = "email", reason = "Malicious content") =>
    request("/response/quarantine", {
      method: "POST",
      body: JSON.stringify({
        item_identifier: itemIdentifier,
        item_type: itemType,
        reason,
      }),
    }),
  revokeSession: (sessionId, userEmail = "unknown", reason = "Anomalous takeover pattern") =>
    request("/response/revoke-session", {
      method: "POST",
      body: JSON.stringify({
        session_id: sessionId,
        user_email: userEmail,
        reason,
      }),
    }),

  // Incidents
  getIncidents: () => request("/incidents"),
};

// Types for the new nested attribute structure from ha-adaptive-climate

export interface PidHistoryEntry {
  timestamp: string;
  kp: number;
  ki: number;
  kd: number;
  ke: number;
  reason: string;
  actor: string;
}

export interface LearningObject {
  status?: string;
  confidence?: number;
  pid_history?: PidHistoryEntry[];
}

export interface Override {
  type: string;
  // contact_open
  sensors?: string[];
  since?: string;
  // humidity
  state?: string;
  resume_at?: string;
  // night_setback
  delta?: number;
  ends_at?: string;
  limited_to?: number;
  // learning_grace
  until?: string;
}

export interface StatusObject {
  activity?: string;
  overrides?: Override[];
}

export interface AdaptiveAttributes {
  status?: StatusObject;
  learning?: LearningObject;
  cycle_count?: number | { heater: number; cooler: number };
  control_output?: number;
  outdoor_temp_lagged?: number;
  // Flat attributes for backwards compatibility
  learning_status?: string;
  pid_history?: PidHistoryEntry[];
  convergence_confidence_pct?: number;
  heater_cycle_count?: number;
  cooler_cycle_count?: number;
  cycles_collected?: number;
}

// Helper functions

export function getConditions(attrs: AdaptiveAttributes): string[] {
  const types = attrs.status?.overrides?.map(o => o.type) ?? [];
  // Map backend override types to card condition names
  // Backend uses "humidity" but card expects "humidity_spike" for icons/colors
  return types.map(t => t === "humidity" ? "humidity_spike" : t);
}

export function getNightSetback(attrs: AdaptiveAttributes): { delta?: number; ends_at?: string } | undefined {
  const override = attrs.status?.overrides?.find(o => o.type === "night_setback");
  return override ? { delta: override.delta, ends_at: override.ends_at } : undefined;
}

export function getLearningStatus(attrs: AdaptiveAttributes): string | undefined {
  return attrs.learning?.status ?? attrs.learning_status;
}

export function getLearningConfidence(attrs: AdaptiveAttributes): number | undefined {
  return attrs.learning?.confidence ?? attrs.convergence_confidence_pct;
}

export function getPidHistory(attrs: AdaptiveAttributes): PidHistoryEntry[] | undefined {
  return attrs.learning?.pid_history ?? attrs.pid_history;
}

export function getCycleCounts(attrs: AdaptiveAttributes): { heater?: number; cooler?: number } {
  const cc = attrs.cycle_count;
  if (typeof cc === "number") return { heater: cc };
  if (cc && typeof cc === "object") return { heater: cc.heater, cooler: cc.cooler };
  // Fallback to flat attributes
  return { heater: attrs.heater_cycle_count, cooler: attrs.cooler_cycle_count };
}

import { HvacAction, HvacMode } from "../../ha";

export const CLIMATE_HVAC_MODE_COLORS: Record<HvacMode, string> = {
  auto: "var(--rgb-state-climate-auto)",
  cool: "var(--rgb-state-climate-cool)",
  dry: "var(--rgb-state-climate-dry)",
  fan_only: "var(--rgb-state-climate-fan-only)",
  heat: "var(--rgb-state-climate-heat)",
  heat_cool: "var(--rgb-state-climate-heat-cool)",
  off: "var(--rgb-state-climate-off)",
};

export const CLIMATE_HVAC_ACTION_COLORS: Record<HvacAction, string> = {
  cooling: "var(--rgb-state-climate-cool)",
  drying: "var(--rgb-state-climate-dry)",
  heating: "var(--rgb-state-climate-heat)",
  idle: "var(--rgb-state-climate-idle)",
  off: "var(--rgb-state-climate-off)",
};

export const CLIMATE_HVAC_MODE_ICONS: Record<HvacMode, string> = {
  auto: "mdi:thermostat-auto",
  cool: "mdi:snowflake",
  dry: "mdi:water-percent",
  fan_only: "mdi:fan",
  heat: "mdi:fire",
  heat_cool: "mdi:sun-snowflake-variant",
  off: "mdi:power",
};

export const CLIMATE_HVAC_ACTION_ICONS: Record<HvacAction, string> = {
  cooling: "mdi:snowflake",
  drying: "mdi:water-percent",
  heating: "mdi:fire",
  idle: "mdi:clock-outline",
  off: "mdi:power",
};

export function getHvacModeColor(hvacMode: HvacMode): string {
  return CLIMATE_HVAC_MODE_COLORS[hvacMode] ?? CLIMATE_HVAC_MODE_COLORS.off;
}

export function getHvacActionColor(hvacAction: HvacAction): string {
  return (
    CLIMATE_HVAC_ACTION_COLORS[hvacAction] ?? CLIMATE_HVAC_ACTION_COLORS.off
  );
}

export function getHvacModeIcon(hvacMode: HvacMode): string {
  return CLIMATE_HVAC_MODE_ICONS[hvacMode] ?? "mdi:thermostat";
}

export function getHvacActionIcon(hvacAction: HvacAction): string | undefined {
  return CLIMATE_HVAC_ACTION_ICONS[hvacAction] ?? "";
}

// Adaptive thermostat condition icons
export const ADAPTIVE_CONDITION_ICONS: Record<string, string> = {
  contact_open: "mdi:window-open-variant",
  humidity_spike: "mdi:shower",
  night_setback: "mdi:weather-night",
  open_window: "mdi:window-open-variant",
  learning: "mdi:brain",
  stable: "mdi:target-account",
};

// Adaptive condition colors (subtle, not too prominent)
export const ADAPTIVE_CONDITION_COLORS: Record<string, string> = {
  contact_open: "var(--rgb-amber)",
  humidity_spike: "var(--rgb-blue)",
  night_setback: "var(--rgb-purple)",
  open_window: "var(--rgb-amber)",
  learning: "var(--rgb-green)",
  stable: "var(--rgb-green)",
};

// Priority order for conditions (first match wins)
const CONDITION_PRIORITY = ["contact_open", "open_window", "humidity_spike", "night_setback", "learning", "stable"];

export function getAdaptiveConditionIcon(conditions: string[]): string | undefined {
  for (const cond of CONDITION_PRIORITY) {
    if (conditions.includes(cond)) {
      return ADAPTIVE_CONDITION_ICONS[cond];
    }
  }
  return undefined;
}

export function getAdaptiveConditionColor(conditions: string[]): string | undefined {
  for (const cond of CONDITION_PRIORITY) {
    if (conditions.includes(cond)) {
      return ADAPTIVE_CONDITION_COLORS[cond];
    }
  }
  return undefined;
}

// Check for away/vacation preset
export function isAwayMode(presetMode: string | undefined): boolean {
  return presetMode === "away" || presetMode === "vacation";
}

// Check if entity is from adaptive_climate integration
export function isAdaptiveThermostat(entity: any): boolean {
  return entity.attributes?.integration === "adaptive_climate";
}

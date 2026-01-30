import { css, CSSResultGroup, html, LitElement, nothing, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import { ClimateEntity, HomeAssistant } from "../../ha";
import { safeCustomElement } from "../../utils/safe-custom-element";
import setupCustomlocalize from "../../localize";
import {
  ADAPTIVE_CONDITION_ICONS,
  ADAPTIVE_CONDITION_COLORS,
} from "./utils";

interface PidHistoryEntry {
  timestamp: string;
  kp: number;
  ki: number;
  kd: number;
  ke: number;
  reason: string;
  actor: string;
}

interface AdaptiveAttributes {
  // Status object contains conditions and night setback info
  status?: {
    conditions?: string[];
    setback_delta?: number;
    setback_end?: string;
  };
  // PID values are flat on attributes
  kp?: number;
  ki?: number;
  kd?: number;
  control_output?: number;
  // PID history
  pid_history?: PidHistoryEntry[];
  // Learning values are flat on attributes
  learning_status?: string;
  cycles_collected?: number;
  convergence_confidence_pct?: number;
  // Environment and statistics
  outdoor_temp_lagged?: number;
  heater_cycle_count?: number;
  cooler_cycle_count?: number;
}

@safeCustomElement("adaptive-climate-info-popup")
export class ClimateInfoPopup extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public entity!: ClimateEntity;

  private _close() {
    this.dispatchEvent(new CustomEvent("close"));
  }

  private _onOverlayClick(e: Event) {
    if (e.target === e.currentTarget) {
      this._close();
    }
  }

  protected render(): TemplateResult {
    const customLocalize = setupCustomlocalize(this.hass);
    const attrs = this.entity.attributes as AdaptiveAttributes;

    return html`
      <div class="overlay" @click=${this._onOverlayClick}>
        <div class="popup">
          <header>
            <span class="title">${customLocalize("card.info_popup.title")}</span>
            <button class="close-btn" @click=${this._close}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </header>
          <div class="content">
            ${this._renderStatusSection(attrs, customLocalize)}
            ${this._renderPidSection(attrs, customLocalize)}
            ${this._renderPidHistorySection(attrs, customLocalize)}
            ${this._renderLearningSection(attrs, customLocalize)}
            ${this._renderNightSetbackSection(attrs, customLocalize)}
            ${this._renderEnvironmentSection(attrs, customLocalize)}
            ${this._renderStatisticsSection(attrs, customLocalize)}
          </div>
        </div>
      </div>
    `;
  }

  private _renderStatusSection(
    attrs: AdaptiveAttributes,
    localize: ReturnType<typeof setupCustomlocalize>
  ): TemplateResult {
    const conditions = attrs.status?.conditions ?? [];
    const state = this.entity.state;
    const hvacAction = this.entity.attributes.hvac_action;

    return html`
      <section>
        <h3>${localize("card.info_popup.status")}</h3>
        <div class="row">
          <span class="label">${localize("card.info_popup.state")}</span>
          <span class="value">${this.hass.formatEntityState(this.entity)}</span>
        </div>
        ${hvacAction
          ? html`
              <div class="row">
                <span class="label">${localize("card.info_popup.action")}</span>
                <span class="value">${hvacAction}</span>
              </div>
            `
          : nothing}
        ${conditions.length > 0
          ? html`
              <div class="row">
                <span class="label">${localize("card.info_popup.conditions")}</span>
                <span class="value conditions">
                  ${conditions.map((cond) => {
                    const icon = ADAPTIVE_CONDITION_ICONS[cond];
                    const color = ADAPTIVE_CONDITION_COLORS[cond];
                    return html`
                      <span
                        class="condition-badge"
                        style=${styleMap({
                          "--condition-color": color ? `rgb(${color})` : "var(--primary-text-color)",
                        })}
                      >
                        ${icon ? html`<ha-icon icon=${icon}></ha-icon>` : nothing}
                        ${cond.replace(/_/g, " ")}
                      </span>
                    `;
                  })}
                </span>
              </div>
            `
          : nothing}
      </section>
    `;
  }

  private _renderPidSection(
    attrs: AdaptiveAttributes,
    localize: ReturnType<typeof setupCustomlocalize>
  ): TemplateResult | typeof nothing {
    if (attrs.kp === undefined && attrs.ki === undefined && attrs.kd === undefined) {
      return nothing;
    }

    return html`
      <section>
        <h3>${localize("card.info_popup.pid_controller")}</h3>
        ${attrs.kp !== undefined
          ? html`
              <div class="row">
                <span class="label">Kp</span>
                <span class="value">${this._formatNumber(attrs.kp)}</span>
              </div>
            `
          : nothing}
        ${attrs.ki !== undefined
          ? html`
              <div class="row">
                <span class="label">Ki</span>
                <span class="value">${this._formatNumber(attrs.ki)}</span>
              </div>
            `
          : nothing}
        ${attrs.kd !== undefined
          ? html`
              <div class="row">
                <span class="label">Kd</span>
                <span class="value">${this._formatNumber(attrs.kd)}</span>
              </div>
            `
          : nothing}
        ${attrs.control_output !== undefined
          ? html`
              <div class="row">
                <span class="label">${localize("card.info_popup.control_output")}</span>
                <span class="value">${this._formatNumber(attrs.control_output)}%</span>
              </div>
            `
          : nothing}
      </section>
    `;
  }

  private _renderPidHistorySection(
    attrs: AdaptiveAttributes,
    localize: ReturnType<typeof setupCustomlocalize>
  ): TemplateResult | typeof nothing {
    const history = attrs.pid_history;
    if (!history || history.length === 0) {
      return nothing;
    }

    return html`
      <section>
        <h3>${localize("card.info_popup.pid_history")}</h3>
        <div class="history-table">
          <div class="history-header">
            <span>${localize("card.info_popup.time")}</span>
            <span>Kp</span>
            <span>Ki</span>
            <span>Kd</span>
          </div>
          ${history.slice(-5).reverse().map(
            (entry) => html`
              <div class="history-row">
                <span class="history-time">${this._formatDateTime(entry.timestamp)}</span>
                <span>${this._formatNumber(entry.kp)}</span>
                <span>${this._formatNumber(entry.ki, 4)}</span>
                <span>${this._formatNumber(entry.kd)}</span>
              </div>
              <div class="history-reason">${entry.reason}</div>
            `
          )}
        </div>
      </section>
    `;
  }

  private _renderLearningSection(
    attrs: AdaptiveAttributes,
    localize: ReturnType<typeof setupCustomlocalize>
  ): TemplateResult | typeof nothing {
    if (!attrs.learning_status) return nothing;

    return html`
      <section>
        <h3>${localize("card.info_popup.learning")}</h3>
        <div class="row">
          <span class="label">${localize("card.info_popup.learning_status")}</span>
          <span class="value">${attrs.learning_status}</span>
        </div>
        ${attrs.cycles_collected !== undefined
          ? html`
              <div class="row">
                <span class="label">${localize("card.info_popup.cycles_collected")}</span>
                <span class="value">${attrs.cycles_collected}</span>
              </div>
            `
          : nothing}
        ${attrs.convergence_confidence_pct !== undefined
          ? html`
              <div class="row">
                <span class="label">${localize("card.info_popup.convergence")}</span>
                <span class="value">${attrs.convergence_confidence_pct}%</span>
              </div>
            `
          : nothing}
      </section>
    `;
  }

  private _renderNightSetbackSection(
    attrs: AdaptiveAttributes,
    localize: ReturnType<typeof setupCustomlocalize>
  ): TemplateResult | typeof nothing {
    const status = attrs.status;
    const conditions = status?.conditions ?? [];

    // Only show when night setback is active
    if (!conditions.includes("night_setback")) return nothing;

    return html`
      <section>
        <h3>${localize("card.info_popup.night_setback")}</h3>
        ${status?.setback_delta !== undefined
          ? html`
              <div class="row">
                <span class="label">${localize("card.info_popup.setback_delta")}</span>
                <span class="value">${status.setback_delta}°</span>
              </div>
            `
          : nothing}
        ${status?.setback_end
          ? html`
              <div class="row">
                <span class="label">${localize("card.info_popup.setback_end")}</span>
                <span class="value">${this._formatTime(status.setback_end)}</span>
              </div>
            `
          : nothing}
      </section>
    `;
  }

  private _renderEnvironmentSection(
    attrs: AdaptiveAttributes,
    localize: ReturnType<typeof setupCustomlocalize>
  ): TemplateResult | typeof nothing {
    if (attrs.outdoor_temp_lagged === undefined) return nothing;

    return html`
      <section>
        <h3>${localize("card.info_popup.environment")}</h3>
        <div class="row">
          <span class="label">${localize("card.info_popup.outdoor_temp")}</span>
          <span class="value">${this._formatNumber(attrs.outdoor_temp_lagged)}°</span>
        </div>
      </section>
    `;
  }

  private _renderStatisticsSection(
    attrs: AdaptiveAttributes,
    localize: ReturnType<typeof setupCustomlocalize>
  ): TemplateResult | typeof nothing {
    if (
      attrs.heater_cycle_count === undefined &&
      attrs.cooler_cycle_count === undefined
    ) {
      return nothing;
    }

    return html`
      <section>
        <h3>${localize("card.info_popup.statistics")}</h3>
        ${attrs.heater_cycle_count !== undefined
          ? html`
              <div class="row">
                <span class="label">${localize("card.info_popup.heater_cycles")}</span>
                <span class="value">${attrs.heater_cycle_count}</span>
              </div>
            `
          : nothing}
        ${attrs.cooler_cycle_count !== undefined
          ? html`
              <div class="row">
                <span class="label">${localize("card.info_popup.cooler_cycles")}</span>
                <span class="value">${attrs.cooler_cycle_count}</span>
              </div>
            `
          : nothing}
      </section>
    `;
  }

  private _formatNumber(value: number, decimals: number = 2): string {
    return value.toLocaleString(this.hass?.locale?.language ?? "en", {
      maximumFractionDigits: decimals,
    });
  }

  private _formatDateTime(isoString: string): string {
    try {
      const date = new Date(isoString);
      return date.toLocaleString(this.hass?.locale?.language ?? "en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  }

  private _formatTime(isoString: string): string {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString(this.hass?.locale?.language ?? "en", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  }

  static get styles(): CSSResultGroup {
    return css`
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999;
      }

      .popup {
        background: var(--card-background-color, var(--ha-card-background, #fff));
        border-radius: 16px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
        max-width: 400px;
        width: calc(100% - 32px);
        max-height: 80vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
      }

      .title {
        font-size: 18px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .close-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--secondary-text-color);
        transition: background-color 0.2s;
      }

      .close-btn:hover {
        background: var(--secondary-background-color, rgba(0, 0, 0, 0.06));
      }

      .close-btn ha-icon {
        --mdc-icon-size: 24px;
      }

      .content {
        padding: 8px 16px 16px;
        overflow-y: auto;
      }

      section {
        margin-bottom: 16px;
      }

      section:last-child {
        margin-bottom: 0;
      }

      h3 {
        margin: 0 0 8px 0;
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-color);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 6px 0;
      }

      .label {
        color: var(--secondary-text-color);
        font-size: 14px;
      }

      .value {
        color: var(--primary-text-color);
        font-size: 14px;
        font-weight: 500;
        text-align: right;
      }

      .conditions {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        justify-content: flex-end;
      }

      .condition-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 12px;
        background: rgba(var(--rgb-primary-text-color), 0.08);
        font-size: 12px;
        text-transform: capitalize;
        color: var(--condition-color, var(--primary-text-color));
      }

      .condition-badge ha-icon {
        --mdc-icon-size: 14px;
      }

      .history-table {
        font-size: 12px;
      }

      .history-header {
        display: grid;
        grid-template-columns: 1fr repeat(3, 50px);
        gap: 8px;
        padding: 6px 0;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        color: var(--secondary-text-color);
        font-weight: 500;
        text-align: right;
      }

      .history-header span:first-child {
        text-align: left;
      }

      .history-row {
        display: grid;
        grid-template-columns: 1fr repeat(3, 50px);
        gap: 8px;
        padding: 6px 0 2px;
        color: var(--primary-text-color);
        text-align: right;
      }

      .history-row span:first-child {
        text-align: left;
      }

      .history-time {
        color: var(--secondary-text-color);
      }

      .history-reason {
        padding: 0 0 6px;
        color: var(--secondary-text-color);
        font-style: italic;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.06));
      }

      .history-reason:last-child {
        border-bottom: none;
      }

      /* Dark mode adjustments handled by HA theme variables */
    `;
  }
}

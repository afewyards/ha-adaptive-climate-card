import { html, LitElement, nothing, TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { styleMap } from "lit/directives/style-map.js";
import {
  ClimateEntity,
  computeRTL,
  HomeAssistant,
  isAvailable,
  UNIT_F,
} from "../../../ha";
import { safeCustomElement } from "../../../utils/safe-custom-element";
import "../../../shared/button";
import "../../../shared/button-group";
import "../../../shared/input-number";

export const isTemperatureControlVisible = (entity: ClimateEntity) =>
  entity.attributes.temperature != null ||
  (entity.attributes.target_temp_low != null &&
    entity.attributes.target_temp_high != null);

@safeCustomElement("adaptive-climate-temperature-control")
export class ClimateTemperatureControl extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public entity!: ClimateEntity;

  @property() public fill: boolean = false;

  private get _stepSize(): number {
    if (this.entity.attributes.target_temp_step) {
      return this.entity.attributes.target_temp_step;
    }
    return this.hass!.config.unit_system.temperature === UNIT_F ? 1 : 0.5;
  }

  onValueChange(e: CustomEvent<{ value: number }>): void {
    const value = e.detail.value;
    this.hass!.callService("climate", "set_temperature", {
      entity_id: this.entity.entity_id,
      temperature: value,
    });
  }

  onLowValueChange(e: CustomEvent<{ value: number }>): void {
    const value = e.detail.value;
    this.hass!.callService("climate", "set_temperature", {
      entity_id: this.entity.entity_id,
      target_temp_low: value,
      target_temp_high: this.entity.attributes.target_temp_high,
    });
  }

  onHighValueChange(e: CustomEvent<{ value: number }>): void {
    const value = e.detail.value;
    this.hass!.callService("climate", "set_temperature", {
      entity_id: this.entity.entity_id,
      target_temp_low: this.entity.attributes.target_temp_low,
      target_temp_high: value,
    });
  }

  private get _nightSetbackInfo(): { active: boolean; originalTarget: number | null } {
    const status = (this.entity.attributes as any).status;
    if (status?.conditions?.includes("night_setback") && status.setback_delta != null) {
      const currentTarget = this.entity.attributes.temperature;
      if (currentTarget != null) {
        return {
          active: true,
          originalTarget: currentTarget + status.setback_delta,
        };
      }
    }
    return { active: false, originalTarget: null };
  }

  protected render(): TemplateResult {
    const rtl = computeRTL(this.hass);

    const available = isAvailable(this.entity);

    const formatOptions: Intl.NumberFormatOptions =
      this._stepSize === 1
        ? {
            maximumFractionDigits: 0,
          }
        : {
            minimumFractionDigits: 1,
            maximumFractionDigits: 1,
          };

    const modeStyle = (mode: "heat" | "cool") => ({
      "--bg-color": `rgba(var(--rgb-state-climate-${mode}), 0.05)`,
      "--icon-color": `rgb(var(--rgb-state-climate-${mode}))`,
      "--text-color": `rgb(var(--rgb-state-climate-${mode}))`,
    });

    const nightSetback = this._nightSetbackInfo;

    return html`
      <adaptive-button-group .fill=${this.fill} ?rtl=${rtl}>
        ${this.entity.attributes.temperature != null
          ? html`
              <adaptive-input-number
                .locale=${this.hass.locale}
                .value=${this.entity.attributes.temperature}
                .secondaryValue=${nightSetback.originalTarget}
                .step=${this._stepSize}
                .min=${this.entity.attributes.min_temp}
                .max=${this.entity.attributes.max_temp}
                .disabled=${!available}
                .formatOptions=${formatOptions}
                @change=${this.onValueChange}
              ></adaptive-input-number>
            `
          : nothing}
        ${this.entity.attributes.target_temp_low != null &&
        this.entity.attributes.target_temp_high != null
          ? html`
              <adaptive-input-number
                style=${styleMap(modeStyle("heat"))}
                .locale=${this.hass.locale}
                .value=${this.entity.attributes.target_temp_low}
                .step=${this._stepSize}
                .min=${this.entity.attributes.min_temp}
                .max=${this.entity.attributes.max_temp}
                .disabled=${!available}
                .formatOptions=${formatOptions}
                @change=${this.onLowValueChange}
              ></adaptive-input-number
              ><adaptive-input-number
                style=${styleMap(modeStyle("cool"))}
                .locale=${this.hass.locale}
                .value=${this.entity.attributes.target_temp_high}
                .step=${this._stepSize}
                .min=${this.entity.attributes.min_temp}
                .max=${this.entity.attributes.max_temp}
                .disabled=${!available}
                .formatOptions=${formatOptions}
                @change=${this.onHighValueChange}
              ></adaptive-input-number>
            `
          : nothing}
      </adaptive-button-group>
    `;
  }
}

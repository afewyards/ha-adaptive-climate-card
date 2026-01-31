import {
  css,
  CSSResultGroup,
  html,
  nothing,
  PropertyValues,
  TemplateResult,
} from "lit";
import { state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import {
  actionHandler,
  ActionHandlerEvent,
  ClimateEntity,
  computeRTL,
  formatNumber,
  handleAction,
  hasAction,
  HomeAssistant,
  HvacMode,
  isActive,
  isAvailable,
  LovelaceCard,
  LovelaceCardEditor,
} from "../../ha";
import { safeCustomElement } from "../../utils/safe-custom-element";
import "../../shared/badge-icon";
import "../../shared/button";
import "../../shared/card";
import "../../shared/shape-avatar";
import "../../shared/shape-icon";
import "../../shared/state-info";
import "../../shared/state-item";
import setupCustomlocalize from "../../localize";
import { computeAppearance } from "../../utils/appearance";
import { MushroomBaseCard } from "../../utils/base-card";
import { cardStyle } from "../../utils/card-styles";
import { registerCustomCard } from "../../utils/custom-cards";
import { computeEntityPicture } from "../../utils/info";
import { ClimateCardConfig } from "./climate-card-config";
import {
  CLIMATE_CARD_EDITOR_NAME,
  CLIMATE_CARD_NAME,
  CLIMATE_ENTITY_DOMAINS,
} from "./const";
import "./controls/climate-hvac-modes-control";
import { isHvacModesVisible } from "./controls/climate-hvac-modes-control";
import "./controls/climate-temperature-control";
import { isTemperatureControlVisible } from "./controls/climate-temperature-control";
import "./info-popup";
import {
  getHvacActionColor,
  getHvacActionIcon,
  getHvacModeColor,
  getAdaptiveConditionIcon,
  getAdaptiveConditionColor,
  isAwayMode,
  isAdaptiveThermostat,
} from "./utils";

type ClimateCardControl = "temperature_control" | "hvac_mode_control";

const CONTROLS_ICONS: Record<ClimateCardControl, string> = {
  temperature_control: "mdi:thermometer",
  hvac_mode_control: "mdi:thermostat",
};

registerCustomCard({
  type: CLIMATE_CARD_NAME,
  name: "Adaptive Climate Card",
  description: "Card for Adaptive Climate",
});

@safeCustomElement(CLIMATE_CARD_NAME)
export class ClimateCard
  extends MushroomBaseCard<ClimateCardConfig, ClimateEntity>
  implements LovelaceCard
{
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    await import("./climate-card-editor");
    return document.createElement(
      CLIMATE_CARD_EDITOR_NAME
    ) as LovelaceCardEditor;
  }

  public static async getStubConfig(
    hass: HomeAssistant
  ): Promise<ClimateCardConfig> {
    const entities = Object.keys(hass.states);
    const climates = entities.filter((e) =>
      CLIMATE_ENTITY_DOMAINS.includes(e.split(".")[0])
    );
    return {
      type: `custom:${CLIMATE_CARD_NAME}`,
      entity: climates[0],
    };
  }

  @state() private _activeControl?: ClimateCardControl;
  @state() private _infoPopupOpen = false;

  private get _controls(): ClimateCardControl[] {
    if (!this._config || !this._stateObj) return [];

    const stateObj = this._stateObj;
    const controls: ClimateCardControl[] = [];
    if (
      isTemperatureControlVisible(stateObj) &&
      this._config.show_temperature_control
    ) {
      controls.push("temperature_control");
    }
    const autoModeSwitching = (stateObj.attributes as any).auto_mode_switching_enabled;
    if (isHvacModesVisible(stateObj, this._config.hvac_modes) && !autoModeSwitching) {
      controls.push("hvac_mode_control");
    }
    return controls;
  }

  protected get hasControls(): boolean {
    return this._controls.length > 0;
  }

  _onControlTap(ctrl, e): void {
    e.stopPropagation();
    this._activeControl = ctrl;
  }

  setConfig(config: ClimateCardConfig): void {
    super.setConfig({
      tap_action: {
        action: "toggle",
      },
      hold_action: {
        action: "more-info",
      },
      ...config,
    });
    this.updateActiveControl();
  }

  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (this.hass && changedProperties.has("hass")) {
      this.updateActiveControl();
    }
  }

  updateActiveControl() {
    const isActiveControlSupported = this._activeControl
      ? this._controls.includes(this._activeControl)
      : false;
    this._activeControl = isActiveControlSupported
      ? this._activeControl
      : this._controls[0];
  }

  private _handleAction(ev: ActionHandlerEvent) {
    handleAction(this, this.hass!, this._config!, ev.detail.action!);
  }

  protected render() {
    if (!this.hass || !this._config || !this._config.entity) {
      return nothing;
    }

    const stateObj = this._stateObj;

    if (!stateObj) {
      return this.renderNotFound(this._config);
    }

    if (!isAdaptiveThermostat(stateObj)) {
      return this.renderInvalidIntegration(this._config);
    }

    const name = this._config.name || stateObj.attributes.friendly_name || "";
    const icon = this._config.icon || "mdi:thermostat-box";
    const appearance = computeAppearance(this._config);
    const picture = computeEntityPicture(stateObj, appearance.icon_type);

    let stateDisplay = this.hass.formatEntityState(stateObj);
    if (stateObj.attributes.current_temperature !== null) {
      const temperature = this.hass.formatEntityAttributeValue(
        stateObj,
        "current_temperature"
      );
      stateDisplay += ` ⸱ ${temperature}`;
    }
    const rtl = computeRTL(this.hass);

    const isControlVisible =
      (!this._config.collapsible_controls || isActive(stateObj)) &&
      this._controls.length;

    const isOff = stateObj.state === "off";

    return html`
      <ha-card
        class=${classMap({
          "fill-container": appearance.fill_container,
          "state-off": isOff,
        })}
      >
        <adaptive-card .appearance=${appearance} ?rtl=${rtl}>
          <adaptive-state-item
            ?rtl=${rtl}
            .appearance=${appearance}
            @action=${this._handleAction}
            .actionHandler=${actionHandler({
              hasHold: hasAction(this._config.hold_action),
              hasDoubleClick: hasAction(this._config.double_tap_action),
            })}
          >
            ${picture
              ? this.renderPicture(picture)
              : this.renderIcon(stateObj, icon)}
            ${this.renderBadge(stateObj)}
            ${this.renderStateInfo(stateObj, appearance, name, stateDisplay)};
          </adaptive-state-item>
          ${isControlVisible
            ? html`
                <div class="actions" ?rtl=${rtl}>
                  ${this.renderActiveControl(stateObj)}
                  ${this.renderOtherControls()}
                  ${this.renderInfoButton()}
                </div>
              `
            : nothing}
        </adaptive-card>
      </ha-card>
      ${this._infoPopupOpen
        ? html`
            <adaptive-climate-info-popup
              .hass=${this.hass}
              .entity=${stateObj}
              @close=${() => (this._infoPopupOpen = false)}
            ></adaptive-climate-info-popup>
          `
        : nothing}
    `;
  }

  protected renderIcon(stateObj: ClimateEntity, icon?: string): TemplateResult {
    const available = isAvailable(stateObj);

    // Use hvac_action for background color (shows actual heating/cooling state)
    const hvacAction = stateObj.attributes.hvac_action;
    const color = hvacAction
      ? getHvacActionColor(hvacAction)
      : getHvacModeColor(stateObj.state as HvacMode);

    const iconStyle = {};
    iconStyle["--icon-color"] = `rgb(${color})`;
    iconStyle["--shape-color"] = `rgba(${color}, 0.2)`;

    return html`
      <adaptive-shape-icon
        slot="icon"
        .disabled=${!available}
        style=${styleMap(iconStyle)}
      >
        <ha-state-icon
          .hass=${this.hass}
          .stateObj=${stateObj}
          .icon=${icon}
        ></ha-state-icon>
      </adaptive-shape-icon>
    `;
  }

  protected renderBadge(entity: ClimateEntity) {
    const unavailable = !isAvailable(entity);
    if (unavailable) {
      return super.renderBadge(entity);
    }

    // Check for adaptive thermostat conditions first
    const adaptiveBadge = this.renderAdaptiveBadge(entity);
    if (adaptiveBadge) {
      return adaptiveBadge;
    }

    // Fall back to showing nothing (action now shown via circle color)
    return nothing;
  }

  renderAdaptiveBadge(entity: ClimateEntity) {
    // Get status.conditions and learning_status from entity attributes
    const attrs = entity.attributes as any;
    const status = attrs.status as { conditions?: string[] } | undefined;
    const conditions = [...(status?.conditions ?? [])];
    const presetMode = entity.attributes.preset_mode;

    // Add learning status condition
    if (attrs.learning_status === "collecting") {
      conditions.push("learning");
    } else if (attrs.learning_status === "stable") {
      conditions.push("stable");
    }

    // Check away/vacation mode
    if (isAwayMode(presetMode)) {
      return html`
        <adaptive-badge-icon
          slot="badge"
          .icon=${"mdi:airplane"}
          style=${styleMap({
            "--main-color": "rgb(var(--rgb-purple))",
          })}
        ></adaptive-badge-icon>
      `;
    }

    // Check adaptive conditions
    const conditionIcon = getAdaptiveConditionIcon(conditions);
    const conditionColor = getAdaptiveConditionColor(conditions);

    if (conditionIcon && conditionColor) {
      return html`
        <adaptive-badge-icon
          slot="badge"
          .icon=${conditionIcon}
          style=${styleMap({
            "--main-color": `rgb(${conditionColor})`,
          })}
        ></adaptive-badge-icon>
      `;
    }

    return nothing;
  }

  private renderOtherControls(): TemplateResult | null {
    const otherControls = this._controls.filter(
      (control) => control != this._activeControl
    );

    return html`
      ${otherControls.map(
        (ctrl) => html`
          <adaptive-button @click=${(e) => this._onControlTap(ctrl, e)}>
            <ha-icon .icon=${CONTROLS_ICONS[ctrl]}></ha-icon>
          </adaptive-button>
        `
      )}
    `;
  }

  private renderInfoButton(): TemplateResult {
    return html`
      <adaptive-button @click=${() => (this._infoPopupOpen = true)}>
        <ha-icon icon="mdi:information-outline"></ha-icon>
      </adaptive-button>
    `;
  }

  private renderActiveControl(entity: ClimateEntity) {
    const hvac_modes = this._config!.hvac_modes ?? [];
    const appearance = computeAppearance(this._config!);

    switch (this._activeControl) {
      case "temperature_control":
        return html`
          <adaptive-climate-temperature-control
            .hass=${this.hass}
            .entity=${entity}
            .fill=${appearance.layout !== "horizontal"}
          ></adaptive-climate-temperature-control>
        `;
      case "hvac_mode_control":
        return html`
          <adaptive-climate-hvac-modes-control
            .hass=${this.hass}
            .entity=${entity}
            .modes=${hvac_modes}
            .fill=${appearance.layout !== "horizontal"}
          ></adaptive-climate-hvac-modes-control>
        `;
      default:
        return nothing;
    }
  }

  protected renderInvalidIntegration(config: ClimateCardConfig): TemplateResult {
    const appearance = computeAppearance(config);
    const rtl = computeRTL(this.hass);
    const customLocalize = setupCustomlocalize(this.hass);

    return html`
      <ha-card
        class=${classMap({ "fill-container": appearance.fill_container })}
      >
        <adaptive-card .appearance=${appearance} ?rtl=${rtl}>
          <adaptive-state-item ?rtl=${rtl} .appearance=${appearance} disabled>
            <adaptive-shape-icon slot="icon" disabled>
              <ha-icon icon="mdi:thermostat-box"></ha-icon>
            </adaptive-shape-icon>
            <adaptive-badge-icon
              slot="badge"
              class="invalid-integration"
              icon="mdi:alert"
            ></adaptive-badge-icon>
            <adaptive-state-info
              slot="info"
              .primary=${config.entity}
              .secondary=${customLocalize("card.invalid_integration")}
            ></adaptive-state-info>
          </adaptive-state-item>
        </adaptive-card>
      </ha-card>
    `;
  }

  static get styles(): CSSResultGroup {
    return [
      super.styles,
      cardStyle,
      css`
        adaptive-state-item {
          cursor: pointer;
        }
        adaptive-climate-temperature-control,
        adaptive-climate-hvac-modes-control {
          flex: 1;
        }
        ha-card.state-off adaptive-state-item {
          opacity: 0.5;
        }
        ha-card.state-off .actions {
          opacity: 0.6;
        }
      `,
    ];
  }
}

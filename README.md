# Adaptive Thermostat Card

A Home Assistant Lovelace card for the [Adaptive Thermostat](https://github.com/afewyards/ha-adaptive-thermostat) integration. Based on [lovelace-mushroom](https://github.com/piitaya/lovelace-mushroom) by piitaya.

## Requires

This card is designed for the [Adaptive Thermostat](https://github.com/afewyards/ha-adaptive-thermostat) integration.

[![HACS](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://github.com/afewyards/ha-adaptive-thermostat)

## Features

- Temperature control with +/- buttons
- HVAC mode selection
- **Circle color** reflects actual state (red = heating, blue = cooling)
- **Badge icons** for adaptive conditions:
  - 🪟 Window/contact open
  - 🚿 Humidity pause (shower detected)
  - 🌙 Night setback active
  - 🧠 Learning mode
  - ✈️ Away/vacation mode

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Go to "Frontend" section
3. Click the three dots menu → "Custom repositories"
4. Add `https://github.com/afewyards/ha-adaptive-thermostat-card` as "Lovelace"
5. Search for "Adaptive Thermostat Card" and install
6. Restart Home Assistant

### Manual

1. Download `adaptive-thermostat-card.js` from the [latest release](https://github.com/afewyards/ha-adaptive-thermostat-card/releases)
2. Copy to `/config/www/adaptive-thermostat-card.js`
3. Add resource in Lovelace:
   ```yaml
   resources:
     - url: /local/adaptive-thermostat-card.js
       type: module
   ```

## Usage

```yaml
type: custom:adaptive-thermostat-card
entity: climate.living_room
```

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | **Required** | Climate entity ID |
| `name` | string | Entity name | Card name |
| `icon` | string | Entity icon | Custom icon |
| `show_temperature_control` | boolean | `true` | Show +/- temperature buttons |
| `hvac_modes` | list | All modes | HVAC modes to show |
| `collapsible_controls` | boolean | `false` | Hide controls when off |

### Example

```yaml
type: custom:adaptive-thermostat-card
entity: climate.living_room
name: Living Room
show_temperature_control: true
hvac_modes:
  - heat
  - "off"
collapsible_controls: true
```

## License

Apache 2.0 - See [LICENSE](LICENSE) file.

Original climate card by [piitaya](https://github.com/piitaya).

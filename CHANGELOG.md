## [1.10.3](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.10.2...v1.10.3) (2026-01-30)


### Bug Fixes

* **info-popup:** derive PID values from latest history entry ([67c5e1d](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/67c5e1d58606e2b1c343a1eafb57be47bb83a893))

## [1.10.2](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.10.1...v1.10.2) (2026-01-30)


### Bug Fixes

* **info-popup:** reverse PID history order and condense layout ([70a88f3](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/70a88f304489b4bd949b72e9fcc7faa477ecb75f))

## [1.10.1](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.10.0...v1.10.1) (2026-01-30)


### Bug Fixes

* **info-popup:** remove duplicate PID history implementations ([387f37b](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/387f37b697b1de03083423147d44c253ae4ba73e))

# [1.10.0](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.9.0...v1.10.0) (2026-01-30)


### Features

* **i18n:** add PID history translation keys ([bc628be](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/bc628befaeced43a9c74a07192646434521ed857))
* **info-popup:** add PID history section renderer ([a37d16b](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/a37d16be940420ee1b1c789fa6eabadee1e95912))
* **info-popup:** add PID history service handlers ([45af81f](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/45af81f3d5f9c739184e5e072faf40faef4568aa))
* **info-popup:** add PidHistoryEntry interface ([46e5c3b](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/46e5c3b72b3d73be4a92ec0c1504d98a9e24e365))
* **info-popup:** add relative time formatter ([888050c](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/888050c2d866a9018acce8147c9e9cbe9941fc4c))

# [1.9.0](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.8.0...v1.9.0) (2026-01-29)


### Features

* dim card content and strikethrough target temp when off ([55ccd6f](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/55ccd6f718142ae301227e089b3256da17e3b081))

# [1.8.0](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.7.1...v1.8.0) (2026-01-29)


### Features

* show PID history in info modal ([ef6ca65](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/ef6ca65f1197d5c1e79ef5144f71b0ea82d44910))

## [1.7.1](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.7.0...v1.7.1) (2026-01-29)


### Bug Fixes

* show idle color when thermostat is not actively heating/cooling ([484fef9](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/484fef93c569eb344c1dda4cec3bccd92005ade6))

# [1.7.0](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.6.2...v1.7.0) (2026-01-29)


### Features

* hide HVAC mode button when auto mode switching is enabled ([eb973c6](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/eb973c69077a476cb226d2416277a25392fb33f5))

## [1.6.2](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.6.1...v1.6.2) (2026-01-28)


### Bug Fixes

* night setback temp display and editing ([aa0b944](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/aa0b9444455f14ad235831da726a5188dfd30b69))

## [1.6.1](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.6.0...v1.6.1) (2026-01-28)


### Bug Fixes

* use correct flat attribute paths for PID and learning data ([620f4d9](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/620f4d9e34b6476284d4baf76f2e38f9528f446b))

# [1.6.0](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.5.0...v1.6.0) (2026-01-28)


### Features

* add info popup button showing thermostat details ([ec30de3](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/ec30de3eb4949dc7d953f81bd54efce044c17a96))

# [1.5.0](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.4.1...v1.5.0) (2026-01-28)


### Features

* restrict card to adaptive_thermostat integration only ([d9577cd](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/d9577cd82904602154fafd5fbef7c59870c69287))
* show original target temp during night setback ([4ed8eff](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/4ed8effff3c47ac6c4c456c32e934b85ecdf7fe1))

## [1.4.1](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.4.0...v1.4.1) (2026-01-28)


### Bug Fixes

* remove Babel output plugin causing class name mangling ([f69e91e](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/f69e91e29a5aaf791eae22c25b1b946d03811adf))

# [1.4.0](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.3.0...v1.4.0) (2026-01-28)


### Features

* add HACS icon from brands repo ([ad9018d](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/ad9018da9807652806c1026c9c8040402b1e0980))

# [1.3.0](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.2.0...v1.3.0) (2026-01-28)


### Features

* use mdi:thermostat-box as default icon ([616b5aa](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/616b5aaa7e617ae933eeef620dbd74cbb4fab5c7))

# [1.2.0](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.1.0...v1.2.0) (2026-01-28)


### Features

* rename card to adaptive-thermostat-card and update README ([8e188bb](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/8e188bbe603051f1967c77d778c9318e5fa36855))

# [1.1.0](https://github.com/afewyards/ha-adaptive-thermostat-card/compare/v1.0.0...v1.1.0) (2026-01-28)


### Features

* add adaptive thermostat condition badges and action-based colors ([638aba8](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/638aba875400b9abe80ab985f83aee2987ccc23b))

# 1.0.0 (2026-01-28)


### Bug Fixes

* add missing rollup plugin and lockfile ([bebc955](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/bebc9552a213e68b6266758c5fda92d931a6b0e6))


### Features

* add build artifacts to releases for HACS ([f6c242d](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/f6c242d7c23544bd3dee7ee27d4188b9b46d0e11))
* extract climate card from lovelace-mushroom ([f915ef0](https://github.com/afewyards/ha-adaptive-thermostat-card/commit/f915ef0192c1912c46b454818895eff786efda9d))

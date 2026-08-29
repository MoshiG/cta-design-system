# CTA Design System

Design tokens and brand assets for the **Calvary Temple, TAG Arusha** applications —
the Flutter mobile app (`cta-app/mobile`) and the web IMS (`cta-app/web`).

## What this is not

**Nothing here renders in both clients.** Flutter and React cannot share component
code, so buttons, cards, inputs and chips are implemented twice — once in Dart, once
in React. This repo exists so that the *values and the rules* behind those two
implementations cannot drift apart. It is a token and asset repo, not a component library.

## Layout

```
tokens/     SOURCE OF TRUTH — hand-edited JSON. Change values here, nowhere else.
build/      build.ts (tokens -> dist) and verify_against_flutter.py
dist/       GENERATED, and committed: neither client needs Node to build.
assets/     logos, icons, images
docs/       DESIGN_SYSTEM.md, BRAND.md, component specs   (arrives in M9d/M9e)
```

Run `npm run build` after editing anything in `tokens/`, and commit the `dist/`
change in the same commit. CI fails the build if `dist/` is stale. After a colour change,
also run `python3 build/check_contrast.py`.

## Consuming it

**Flutter** — `pubspec.yaml`, pinned to a tag, never `main`:

```yaml
dependencies:
  cta_design_system:
    git:
      url: git@github.com:MoshiG/cta-design-system.git
      path: dist/dart
      ref: v0.1.0
```

```dart
import 'package:cta_design_system/app_tokens.dart';
Container(color: AppColors.gold500, padding: EdgeInsets.all(AppSpacing.s4));
```

**Web** — Tailwind **v4** configures through CSS:

```css
@import "tailwindcss";
@import "@cta/design-system/tailwind-theme";   /* dist/tailwind/theme.css */
```

Tailwind **v3** consumers use the JS preset instead:

```js
// tailwind.config.js
presets: [require('@cta/design-system/tailwind-preset')]
```

Web targets emit **rem**, so spacing, radii and type scale with the reader's font size and
browser zoom. Dart keeps logical pixels, which Flutter already scales.

```
bg-gold-500  text-neutral-800  rounded-lg  p-4  shadow-modal  bg-gold
```

Both clients pin the **same tag**, so a token change cannot silently alter a release
build of either one.

## Two things worth knowing before you change a value

**Body text is not identical across the clients.** The body family is Mona Sans, which
is not available through the `google_fonts` package, so the Flutter app renders
**Montserrat** as the closest substitute while the web can self-host real Mona Sans.
This is recorded in `tokens/typography.json` rather than hidden. Until Mona Sans is
self-hosted on mobile too, do not treat the two as pixel-identical in body copy.

**Swahili strings run materially longer than English.** Swahili is the app's default
language, not a translation afterthought. Size components against the *Swahili*
string: no fixed-width buttons, no single-line truncation on primary actions, and
check both languages at the 320 dp width floor. `docs/bilingual.md` (M9e) expands this.

## Documents

- `docs/ACCESSIBILITY.md` — WCAG 2.2 AA for both clients, with measured contrast ratios
- `docs/COMPONENT_STATES.md` — the six states every component must define
- `docs/ADMIN_SURFACE.md` — how the web IMS uses this system (borrow the brand, not the patterns)

## Status

M9a–M9c are done: repo, tokens, generator, five `dist/` targets. Still to come, after
the web shell (M10c) exists — see `cta-app/docs/M9-design-system-plan.md`:

- **M9d** move `DESIGN_SYSTEM.md`, `BRAND.md` and the brand assets here
- **M9e** `docs/bilingual.md` and per-component specs
- **M9f** point `cta-app/mobile` at this package

Until M9f, `mobile/lib/theme/app_theme.dart` remains the values the app actually
renders; `build/verify_against_flutter.py` is what proves the two are still equal.

// Generates dist/ from tokens/. One file, no design-token framework — the token
// set is small enough that a framework would cost more than it saves.
//
//   npm run build     regenerate dist/
//   npm run check     regenerate and fail if dist/ was stale (what CI runs)
//
// Runs on Node's own TypeScript stripping (>=22.6), so the repo has no
// dependencies and consumers never need to install anything.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = (name: string): any => JSON.parse(readFileSync(join(ROOT, 'tokens', name), 'utf8'));

const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

const color = read('color.json');
const spacing = read('spacing.json');
const radii = read('radii.json');
const elevation = read('elevation.json');
const typography = read('typography.json');

const GENERATED = 'GENERATED FILE — do not edit. Source: tokens/*.json, generator: build/build.ts.';

// --- reference resolution -------------------------------------------------
// A string like "{brand.gold500}" resolves against the colour token tree.

function lookup(path: string): string {
  const value = path.split('.').reduce<any>((node, key) => (node == null ? node : node[key]), color);
  if (typeof value !== 'string') throw new Error(`token reference {${path}} does not resolve to a value`);
  return resolve(value);
}

function resolve(value: string): string {
  const match = /^\{([^}]+)\}$/.exec(value);
  return match ? lookup(match[1]) : value;
}

// --- flatten colours to the names both clients already use ----------------

const flatColors: Record<string, string> = {};
for (const [name, hex] of Object.entries(color.brand)) flatColors[name] = resolve(hex as string);
for (const [step, hex] of Object.entries(color.neutral)) flatColors[`neutral${step}`] = resolve(hex as string);
for (const [name, hex] of Object.entries(color.semantic)) flatColors[name] = resolve(hex as string);
for (const [name, hex] of Object.entries(color.surface)) flatColors[name] = resolve(hex as string);
for (const [tone, pair] of Object.entries<any>(color.chip)) {
  const Tone = tone[0].toUpperCase() + tone.slice(1);
  flatColors[`chip${Tone}Bg`] = resolve(pair.bg);
  flatColors[`chip${Tone}Fg`] = resolve(pair.fg);
}

const kebab = (name: string) => name.replace(/([a-z])([A-Z0-9])/g, '$1-$2').replace(/([0-9])([A-Z])/g, '$1-$2').toLowerCase();
const argb = (hex: string) => `0xFF${hex.replace('#', '').toUpperCase()}`;
const rgba = (hex: string, opacity: number) => {
  const h = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const write = (relative: string, body: string) => {
  const path = join(ROOT, relative);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, body.endsWith('\n') ? body : `${body}\n`);
  console.log(`  wrote ${relative}`);
};

// --- Dart -----------------------------------------------------------------
// Class and member names deliberately mirror mobile/lib/theme/app_theme.dart so
// that pointing the app at this package (M9f) is a re-export, not a rewrite.

function dart(): string {
  const alignment = (name: string) => `Alignment.${name}`;
  const gradientStops = (stops: any[]) => stops.map((s) => `Color(${argb(resolve(s.color))})`).join(', ');

  const g = color.gradient.goldGradient;
  const s = color.gradient.splashRadial;

  const colorLines = Object.entries(flatColors)
    .map(([name, hex]) => `  static const ${name} = Color(${argb(hex)});`)
    .join('\n');

  const textLines = Object.entries<any>(typography.scale.mobile)
    .map(([name, t]) =>
      `  static const ${name} = AppTextToken(\n` +
      `    family: AppFontFamily.${t.family},\n` +
      `    size: ${t.size.toFixed(1)},\n` +
      `    weight: ${t.weight},\n` +
      `    lineHeight: ${t.lineHeight},\n  );`)
    .join('\n');

  return `// ${GENERATED}
//
// Consumed by the Calvary Temple Flutter app. Names mirror the app's original
// AppColors / AppSpacing / AppRadii exactly.

import 'package:flutter/material.dart';

/// Colour tokens. Source: tokens/color.json.
class AppColors {
  const AppColors._();

${colorLines}

  static const goldGradient = LinearGradient(
    begin: ${alignment(g.begin)},
    end: ${alignment(g.end)},
    colors: [${gradientStops(g.stops)}],
  );

  static const splashRadial = RadialGradient(
    center: Alignment(${s.center[0]}, ${s.center[1]}),
    radius: ${s.radius},
    colors: [${gradientStops(s.stops)}],
    stops: [${s.stops.map((x: any) => x.at.toFixed(2)).join(', ')}],
  );
}

/// Spacing scale. Source: tokens/spacing.json.
class AppSpacing {
  const AppSpacing._();

${Object.entries<number>(spacing.scale).map(([n, v]) => `  static const double ${n} = ${v};`).join('\n')}
}

/// Screen frame constants. Source: tokens/spacing.json "frame".
class AppFrame {
  const AppFrame._();

${Object.entries<number>(spacing.frame).map(([n, v]) => `  static const double ${n} = ${v};`).join('\n')}
}

/// Corner radii. Source: tokens/radii.json.
class AppRadii {
  const AppRadii._();

${Object.entries<number>(radii.scale).map(([n, v]) => `  static const Radius ${n} = Radius.circular(${v});`).join('\n')}

${Object.entries<number>(radii.scale).map(([n]) => `  static const BorderRadius ${n}All = BorderRadius.all(${n});`).join('\n')}
}

/// Which family a text token asks for. The app resolves this to a real font;
/// the body family falls back to ${typography.family.body.flutterSubstitute} on Flutter — see
/// tokens/typography.json.
enum AppFontFamily { display, body }

/// A type-scale entry as raw values. Building the TextStyle stays in the app,
/// because font delivery differs per platform.
@immutable
class AppTextToken {
  const AppTextToken({
    required this.family,
    required this.size,
    required this.weight,
    required this.lineHeight,
  });

  final AppFontFamily family;
  final double size;
  final int weight;
  final double lineHeight;
}

/// Mobile type scale. Source: tokens/typography.json.
class AppTextTokens {
  const AppTextTokens._();

${textLines}
}
`;
}

// --- CSS ------------------------------------------------------------------

function css(): string {
  const lines = Object.entries(flatColors).map(([name, hex]) => `  --cta-${kebab(name)}: ${hex};`);
  const space = Object.entries<number>(spacing.scale).map(([n, v]) => `  --cta-space-${n.slice(1)}: ${v}px;`);
  const radius = Object.entries<number>(radii.scale).map(([n, v]) => `  --cta-radius-${n}: ${v}px;`);
  const g = color.gradient.goldGradient;
  const s = color.gradient.splashRadial;
  const shadows = Object.entries<any>(elevation.levels)
    .filter(([, level]) => level.kind === 'shadow')
    .map(([n, l]) => `  --cta-elev-${n}: ${l.x}px ${l.y}px ${l.blur}px ${rgba(resolve(l.color), l.opacity)};`);

  return `/* ${GENERATED} */

:root {
${lines.join('\n')}

${space.join('\n')}

${radius.join('\n')}

  --cta-gradient-gold: linear-gradient(${g.cssAngleDeg}deg, ${resolve(g.stops[0].color)} 0%, ${resolve(g.stops[1].color)} 100%);
  --cta-gradient-splash: radial-gradient(circle at 50% ${((1 + s.center[1]) / 2 * 100).toFixed(0)}%, ${s.stops.map((x: any) => `${resolve(x.color)} ${(x.at * 100).toFixed(0)}%`).join(', ')});

${shadows.join('\n')}
  --cta-border-card: ${elevation.levels.card.width}px solid ${resolve(elevation.levels.card.color)};

  --cta-font-display: '${typography.family.display.name}', ${typography.family.display.fallback.join(', ')};
  --cta-font-body: '${typography.family.body.name}', ${typography.family.body.fallback.join(', ')};
}
`;
}

// --- TypeScript -----------------------------------------------------------

function ts(): string {
  const resolved = {
    color: flatColors,
    spacing: spacing.scale,
    frame: spacing.frame,
    radii: radii.scale,
    typography: { family: typography.family, scale: typography.scale },
    elevation: elevation.levels,
  };
  return `// ${GENERATED}

export const tokens = ${JSON.stringify(resolved, null, 2)} as const;

export type ColorToken = keyof typeof tokens.color;
export type SpacingToken = keyof typeof tokens.spacing;
export type RadiusToken = keyof typeof tokens.radii;
export type TextToken = keyof typeof tokens.typography.scale.mobile;

export default tokens;
`;
}

// --- Tailwind preset ------------------------------------------------------

function tailwind(): string {
  const gold = Object.fromEntries(Object.entries(color.brand).map(([n, v]) => [n.replace('gold', ''), resolve(v as string)]));
  const neutral = Object.fromEntries(Object.entries(color.neutral).map(([n, v]) => [n, resolve(v as string)]));
  const semantic = Object.fromEntries(Object.entries(color.semantic).map(([n, v]) => [n, resolve(v as string)]));
  const chip = Object.fromEntries(
    Object.entries<any>(color.chip).map(([tone, pair]) => [tone, { bg: resolve(pair.bg), fg: resolve(pair.fg) }]),
  );
  const space = Object.fromEntries(Object.entries<number>(spacing.scale).map(([n, v]) => [n.slice(1), `${v}px`]));
  const radius = Object.fromEntries(Object.entries<number>(radii.scale).map(([n, v]) => [n, `${v}px`]));
  const shadow = Object.fromEntries(
    Object.entries<any>(elevation.levels)
      .filter(([, l]) => l.kind === 'shadow')
      .map(([n, l]) => [n, `${l.x}px ${l.y}px ${l.blur}px ${rgba(resolve(l.color), l.opacity)}`]),
  );
  const g = color.gradient.goldGradient;

  const preset = {
    theme: {
      extend: {
        colors: {
          gold,
          neutral,
          ...semantic,
          onGold: resolve(color.surface.onGold),
          espresso: resolve(color.surface.espresso),
          chip,
        },
        spacing: space,
        borderRadius: radius,
        boxShadow: shadow,
        fontFamily: {
          display: [typography.family.display.name, ...typography.family.display.fallback],
          body: [typography.family.body.name, ...typography.family.body.fallback],
        },
        backgroundImage: {
          gold: `linear-gradient(${g.cssAngleDeg}deg, ${resolve(g.stops[0].color)} 0%, ${resolve(g.stops[1].color)} 100%)`,
        },
      },
    },
  };

  return `// ${GENERATED}
//
// Tailwind preset for the Calvary Temple web IMS:
//   // tailwind.config.js
//   presets: [require('@cta/design-system/tailwind-preset')]

module.exports = ${JSON.stringify(preset, null, 2)};
`;
}

// --- Dart package manifest ------------------------------------------------
// dist/dart must be a resolvable package, since Flutter consumes it as
// `git: {url, path: dist/dart, ref: <tag>}`. Generated so the version can
// never drift from package.json.

function pubspec(): string {
  return `# ${GENERATED}
name: cta_design_system
description: Design tokens for the Calvary Temple TAG Arusha applications.
version: ${pkg.version}
publish_to: none

environment:
  sdk: '>=3.4.0 <4.0.0'
  flutter: '>=3.22.0'

dependencies:
  flutter:
    sdk: flutter
`;
}

console.log('building dist/ from tokens/');
write('dist/dart/lib/app_tokens.dart', dart());
write('dist/dart/pubspec.yaml', pubspec());
write('dist/css/tokens.css', css());
write('dist/ts/tokens.ts', ts());
write('dist/tailwind/preset.js', tailwind());
console.log('done');

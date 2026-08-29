# Accessibility

Target: **WCAG 2.2 AA**, on both clients — the Flutter app and the web IMS.

Adapted from the accessibility rules in the CTA website design kit (visual audit of
cta.or.tz, 29 August 2026), generalised here to bind Flutter as well as the web.

## Colour and contrast

- Normal text ≥ 4.5:1. Large text ≥ 3:1. Focus indicators and essential UI boundaries ≥ 3:1
  against what sits next to them.
- **Never let colour alone carry meaning** — not for selection, status, live state, error, or
  success. Pair it with text, an icon, or a shape. This matters concretely here: our four chip
  pairs (`chipSuccess*`, `chipWarning*`, `chipDanger*`, `chipInfo*`) must always carry a label,
  never just a coloured dot.
`build/check_contrast.py` computes these from `tokens/color.json`, so they stay true when a
value changes. Run it after any colour edit. Measured today:

| Pairing | Ratio | |
|---|---|---|
| `neutral800` on `neutral50` (body text) | 14.05:1 | ✅ |
| `neutral500` on white (muted text) | 4.83:1 | ✅ |
| `onGold` on `gold500` (text on a gold button) | **6.97:1** | ✅ |
| all four chip pairs | 6.37–9.37:1 | ✅ |
| **white on `gold500`** | **2.15:1** | ❌ |
| `gold500` as text on white | 2.15:1 | ❌ |
| `gold600` as text on white | 3.19:1 | ❌ |
| `success` as text on white | 3.30:1 | ❌ |
| `neutral200` border on white | 1.24:1 | ⚠️ |

**Gold is a surface colour, not a text colour.** For text on gold use `onGold` (#451A03) —
that is exactly what the token exists for. `gold700` (5.02:1) is the only gold safe as text
on white.

`success`, `warning`, `danger` and `info` are **icon, fill and chip** colours. For coloured
text, use the chip foregrounds, which are all comfortably above 4.5:1.

The `neutral200` card border is a deliberate exception: it is decoration, not an essential
boundary — the card is also separated by background contrast and spacing. If a border ever
becomes the *only* thing distinguishing a control, it must move to `neutral300` or darker.

### Open defect in the Flutter app (not yet fixed)

`mobile/lib/theme/app_theme.dart` sets `elevatedButtonTheme` to `foregroundColor: Colors.white`
on a `gold500` background — **2.15:1**, so every primary button in the shipped app fails AA.
`textButtonTheme` uses `gold600` on `neutral50`, which is 3.05:1. The codebase already knows the
right answer: ten screens use `AppColors.onGold` by hand on gold surfaces. The fix is to change
those two theme entries to `onGold` and `gold700`. Deferred deliberately — the app is in pilot
and this is a visible change — and tracked in `cta-app/docs/BACKLOG.md`.

## Keyboard, focus, and pointer

- Web: every action reachable and operable by keyboard, focus order matching visual order,
  never remove `outline` without a visible replacement, Escape closes non-modal menus, modals
  trap focus and restore it on close, skip links in the IMS shell.
- Flutter: every action reachable by screen reader; give `Semantics` labels to icon-only
  buttons; do not rely on hover.
- **Touch targets ≥ 44×44 logical pixels** (48 dp for Material components). This binds the
  bottom nav, chips, and any icon button.

## Structure

- One `h1` per page; heading levels never skipped for styling. Flutter: use `Semantics(header: true)`.
- Web: use landmarks — header, nav, main, aside, footer. Use lists for navigation, schedules,
  events, and collections. Buttons for actions, links for navigation.

## Forms

- Every field keeps a **persistent** label — placeholder-as-label fails as soon as typing starts.
- Instructions precede the input they describe.
- Errors are associated programmatically, summarised on failed submission, and **never clear
  what the user typed**. On a slow connection, re-typing a 12-field registration is how you lose
  a member.
- Mark optional fields rather than marking every required one.

## Motion

Honour a reduced-motion preference: `prefers-reduced-motion: reduce` on web,
`MediaQuery.of(context).disableAnimations` in Flutter. Remove parallax, large transforms,
looping decorative motion, and smooth scrolling; keep only movement that explains state.
Motion tokens live in `tokens/motion.json`.

## Media

- Informative images need concise alt text; decorative textures take empty alt text.
- Sermon video needs captions where available; audio needs a transcript or equivalent.
- Never autoplay sound.

## Bilingual honesty

**Swahili is the default language, not a translation.** Swahili strings run materially longer
than their English equivalents, so:

- Size components against the **Swahili** string, never the English one.
- No fixed-width buttons; no single-line truncation on a primary action.
- Let headings wrap; step the type down a level rather than truncating.
- Check both languages at the **320 dp** width floor.
- Do not machine-translate names, ministry titles, or doctrinal terms without review.

## Testing checklist

Keyboard-only completion · visible focus at every step · browser zoom to 200% · narrow viewport
with no horizontal page scroll · screen-reader labels on every icon control · contrast checked
in whatever theme is active · reduced-motion mode · and every one of the six component states
in `COMPONENT_STATES.md`.

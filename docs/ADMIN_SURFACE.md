# The admin surface (web IMS)

How the church's **information management system** uses this design system. Adapted from the
"application dashboard adaptation" section of the CTA website design kit, which reached the same
conclusion we did independently.

## The principle

**The IMS should feel related to Calvary Temple, not like the marketing site forced around
operational work.** A church secretary clearing a verification queue, a treasurer working
through evidence photos, an administrator assigning roles — they scan dozens of rows and want
density, predictability and speed. The public site is built to move a visitor emotionally in
one screen. Those are different jobs, and the same layout cannot do both.

So: **borrow the brand, not the patterns.**

## What carries over

- The palette, radii, spacing and type tokens — unchanged. The IMS is unmistakably CTA.
- `gold500` as the accent, `neutral*` for everything structural.
- The card treatment: 1 px `neutral200` border, no shadow (`elevation.card`).
- The bilingual and accessibility rules, in full.

## What changes

| Public site | IMS |
|---|---|
| Floating top nav over a hero | **Persistent side navigation**, page-level breadcrumbs |
| Full-viewport cinematic hero | No hero. A page title, a status line, and the work |
| Editorial serif display face | UI sans throughout; the display face appears only on sign-in |
| Generous section padding (`s16`–`s24`) | Table and form density: `s2`–`s4` inside blocks |
| Accent used liberally for warmth | **Accent reserved** for the primary action and current selection |
| Imagery leads | Data leads; imagery only where it is the content (evidence photos, posters) |

## Rules with teeth

- **`surface` (white) for tables and forms**, `neutral50` for the page behind them. A table is
  read left-to-right across a row; alternating fills and heavy rules fight that.
- **Reserve the accent.** If gold marks the primary action *and* the active nav item *and* every
  status chip, it marks nothing.
- **Never place a destructive action next to a routine one.** Reject/refund sit apart from
  Confirm, and every destructive action confirms.
- **Every list gets the six states** in `COMPONENT_STATES.md`, including offline. Church office
  connectivity in Arusha is not assumed.
- **Density is not crowding.** Touch and pointer targets stay ≥ 44 px even in dense tables; the
  row gets tighter, the hit area does not.

## The privacy walls are a design constraint, not only a backend one

The IMS is where a leader is most likely to see a screen they should not. The interface must
make the wall visible rather than relying on the API to refuse:

- A cell or zone leader's giving view shows **engagement flags** — has-active-pledge, on-track
  vs behind, a days-behind bucket. There is no amount column to hide, and no "export" that
  would produce one.
- Contribution amounts, evidence photos, receipt images and channels appear only in **finance**
  screens.
- Prospects never appear in any directory-shaped list.
- An empty state or an error must not reveal the existence of a record the viewer may not see —
  see `COMPONENT_STATES.md`.

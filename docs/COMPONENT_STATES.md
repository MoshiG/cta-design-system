# The six states

Every interactive or data-backed component — on either client — must define all six. A component
that only specifies its happy path is not finished.

Adapted from the CTA website design kit's state requirements (29 August 2026).

| State | Requirement |
|---|---|
| **Loading** | A skeleton shaped like the final content, not a spinner in the middle of an empty page. Web: `aria-busy`. |
| **Empty** | Say what is absent and offer the most useful next action. Never bare "No data". |
| **Error** | Plain language and a recovery action. Never "Something went wrong" on its own, and never leak a stack trace or an HTTP code to a member. |
| **Disabled** | Visibly *and* semantically disabled — `disabled` on web, not merely greyed out. |
| **Success** | Confirmation that does not rely on colour alone. |
| **Offline** | Show cached content where we have it and offer retry. |

**Offline is not optional here.** Members are on intermittent mobile data; a screen that renders
blank when the request fails reads as a broken app, not a slow network.

## Two rules with privacy teeth

Both come out of this project's non-negotiables, not from the source kit:

- **Empty states must not leak.** "No contributions found" is fine for the member's own
  statement; for a leader viewing their cell it must not reveal whether a member has given at
  all. Leaders see engagement flags, never amounts or history.
- **Error text must not name what the user may not see.** A 403 on a giving record is
  "You do not have access to this", never "This member's contribution is finance-only".

## Example wording

> **Empty** — "Hakuna matukio yajayo kwa sasa." / "No upcoming events yet. Check back after
> Sunday's announcements."
>
> **Error** — "We could not load the sermon library. Please try again — nothing you entered has
> been lost."

---
name: The Line Map
description: Gugulothu Akhil Kumar's portfolio, drawn as a transit map where every project is a line and every stop is a measured pipeline stage.
colors:
  paper: "#f4f5f5"
  paper-raised: "#fcfcfb"
  ink: "#14161a"
  ink-2: "#525863"
  ink-3: "#686e78"
  rule: "#dadde0"
  rule-strong: "#bec3c9"
  line-red: "#d8343a"
  line-blue: "#1e5faf"
  line-green: "#148a4a"
  line-amber: "#e7a500"
  line-violet: "#7c48b4"
  night-paper: "#0f1114"
  night-paper-raised: "#181b20"
  night-ink: "#e8eaed"
  night-ink-2: "#a8aeb8"
  night-ink-3: "#8c929c"
  night-rule: "#282c33"
  night-rule-strong: "#3e444e"
  night-line-red: "#ef4b51"
  night-line-blue: "#5892e6"
  night-line-green: "#2fb06a"
  night-line-amber: "#f2b31a"
  night-line-violet: "#aa80e6"
typography:
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.9rem, 1rem + 5.2vw, 6.25rem)"
    fontWeight: 700
    lineHeight: 0.93
    letterSpacing: "-0.045em"
    fontVariation: "'wdth' 96"
  headline:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2rem, 1.35rem + 2.2vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.025em"
  lead:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  body-small:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  station:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 550
    lineHeight: 1.25
    fontVariation: "'wdth' 92"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.35
  hand:
    fontFamily: "Kalam, cursive"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.15
  code:
    fontFamily: "Fragment Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
rounded:
  control: "9999px"
  panel: "14px"
  item: "10px"
spacing:
  rail: "6px"
  gutter-mobile: "20px"
  gutter-desktop: "40px"
  container: "88rem"
  section: "7rem"
components:
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.control}"
    height: "44px"
    padding: "0 20px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "44px"
    padding: "0 20px"
  route-bullet:
    textColor: "#ffffff"
    rounded: "{rounded.control}"
    size: "44px"
  panel:
    backgroundColor: "{colors.paper-raised}"
    rounded: "{rounded.panel}"
---

# Design System: The Line Map

## Overview

The portfolio is a transit map. Each featured project is a metro line in a Hyderabad Metro colour; each stop on it is a real stage of that project's pipeline. When a line carries measured times, it is drawn to scale, with the target as a ghost stop and the miss bracketed. The site's promise is "measured, not claimed", so the map's job is to make real numbers legible, including the bad ones.

Two readers: a recruiter who needs name, role, availability and proof in one glance, and an engineer who rides a line into a case study and checks the numbers against GitHub. Calm enamel signage for the first; exact diagrams and tables for the second.

Anti-references: the dark terminal "telemetry" portfolio this replaced (fake status bars, SECTOR 02 labels, neon on black), project card grids with stock photos, and warm cream editorial pages.

## Colors

Restrained ground, full palette on the lines. Neutrals carry the page; colour appears only as line identity.

- **Paper / night paper**: the map ground. Day map is a cool enamel white, never cream. Night map is a blue-black, not pure black.
- **Ink, ink-2, ink-3**: primary text, secondary text (body copy, captions), tertiary meta (years, small labels). ink-3 is the floor for small text contrast; do not go lighter.
- **Rule, rule-strong**: hairlines between rows, section borders, control outlines.
- **Line colours**: red, blue, green, amber, violet, assigned to featured projects in admin order. A project's colour appears on its rail, its route bullet, its case-study progress rail and its key-finding stub, and nowhere else. Amber bullets take ink letters; the others take white.

The admin panel keeps its own dark tokens (`substrate`, `signal`, `telemetry` in the Tailwind config) and is out of this system.

## Typography

One family, Archivo, used at signage widths through its `wdth` axis. Display and titles are bold with tight tracking; station names are semi-condensed (92%) at weight 550 so long names fit between stops. Numbers that are measurements use tabular figures (`.num`). Fragment Mono is reserved for code, paths and the one measured number under each hero terminus, never as a "technical" costume. Kalam is the pen: margin notes and the signature on the line card only, never for content a reader must rely on.

Scale: display 2.9 to 6.25rem (hero, balanced to two lines on desktop), headline 2 to 3.25rem, title 1.875rem, body 1.0625 to 1.125rem, station 0.875rem, label 0.8125rem. Headings balance; paragraphs use `text-wrap: pretty`; body measure stays under about 70 characters.

## Layout

- Container 88rem with 20px (mobile), 32px (sm) and 40px (lg) gutters.
- Sections are separated by a single top hairline and generous vertical space (about 6 to 9rem); more space above a heading than below it.
- Home order is admin-controlled: hero, work, smaller builds, stack, about, contact.
- Work rows: 4/12 text column, 8/12 line column, divided by hairlines. Below 1024px they stack.
- Every line is horizontal from 768px up and vertical below it, with times on the left of the rail and names on the right. The stack interchange grid transposes the same way: tools become rows, lines become columns.

## Elevation & Depth

Nearly flat. The ground carries a fine paper grain (an SVG noise overlay above every layer, a touch stronger at night) so neither theme is a flat screen colour. Depth comes from the rail sitting over the ground and from the one raised surface family (search palette, chat panel), which uses `paper-raised`, a 1px rule ring and a soft, offset shadow. No glass, no glows, no hard offset shadows.

## Shapes

- Buttons are 8px rounded rectangles. Capsules (full radius) are for the search box, tool chips, chips of time on the rail and the train.
- Panels are 14px; list items inside panels are 10px.
- Rails are 6px with round ends. Stations are paper-filled circles with an ink ring (15px, terminals 19px). A filled ink station means "now".
- Tables and data are square: hairlines only.

## Components

- **Project map (`ProjectMap`)**: the hero's right half, on its own raised card with a faint 56px grid. Featured projects are listed on the left (bullet, name, tag, three tool chips); each one's line starts beside it, runs into one shared interchange ("Different problems. Same engineering mindset.") and fades off the right edge. The stops on each line are that project's real pipeline stages, spaced about one per 48px of open track: hover for the stage name, click for the case study. Legend from each project's second tag. Below 768px the names sit above a compact map whose lines start at small bullets. Lines are laid on load, trains shuttle along them, hovering a project ghosts the others.
- **Numbers strip**: four admin-set numbers under the hero between hairlines, with a handwritten line at the end. Every number must be true (count it from the repos or the resume).
- **Shipped at (`Industry`)**: products built in the current job, from `profile.experience[].products`. First product wide (screenshot 7/12, copy 5/12), the rest two up. Screenshots sit in a plain browser frame with the real host in the bar. The copy always says the products belong to the employer. An offline product shows its note instead of a link.
- **Hero portrait**: the owner's photo, 88px round, beside the role, location, current job and availability lines.
- **How I build**: heading with a grey second half, five steps with outline icons joined by arrows, then the ten tools used across the most projects, with their logos (`simple-icons`, server-rendered).
- **Route diagram (`RouteDiagram`)**: a project's line in the shape of its architecture, laid out at its measured width (horizontal from 560px, vertical below). Stop syntax: `A | B` parallel tracks (as the first stop: inputs that fan in), `loop 3: A, B, C` a loop the train laps, `hold: X` a gate with a red/green signal where the train waits. A train rides it when it scrolls into view and again when its row is hovered.
- **Split-flap values (`FlapValue`)**: measured numbers flip digit by digit into place when they enter view, on faint tiles with a split line.
- **Header progress**: the header's bottom rule fills in line red as the page scrolls (scroll-driven animation; absent where unsupported).
- **Shared-element transitions (`TransitionLink`)**: the route bullet and title the visitor clicked glide into the case study header through the View Transitions API; everything else crossfades.
- **Strip map (`LineStrip`)**: stops from the project's `processSteps`. "Label @ 165" records a measured stage in ms; when every stop after the first has a time, the line is drawn to scale, segment times sit on the rail as capsules, every other name drops a row on a leader, and each name wraps inside the room its neighbours leave. A metric labelled "Target" draws a dashed ghost stop; the hero also brackets the stretch past the target.
- **Ride line (`RideLine`)**: a timed project's strip in its work row. A train runs it at real speed with a live ms counter, then parks at the terminus. Reduced motion shows the finished state.
- **Margin notes (`Note`)**: a short handwritten aside in Kalam with a pen arrow that draws itself as it scrolls in. At most one per section, written in the first person, never carrying information that is not also in the body.
- **Pen underline**: a `*word*` in the hero headline gets a red hand-drawn stroke, revealed left to right.
- **Line card**: About's commuter card: four line-colour stripes, photo or initials, holder, line, base, since, card number and a signature. Sits 2.5 degrees askew and straightens on hover.
- **Timetable**: smaller builds as a printed timetable, name and year joined by dotted leaders.
- **Map insert**: the interchange grid printed on its own sheet with a faint 48px grid, the one boxed surface on the home page.
- **Route bullet**: the project's first letter on its line colour. The project's identity everywhere (work rows, palette, case study, prev/next).
- **Case-study route**: the case study's headings as stops on a sticky vertical rail that fills in the line colour as the reader moves.
- **Key finding**: a case study `quote` block renders as the one line that matters: a short rail stub in the line colour above a large sentence.
- **Table block**: pipe-separated rows from admin, first row as header, numbers right-aligned in tabular figures, source note underneath.
- **Search palette**: native `<dialog>`, arrow keys and Enter, projects, sections and actions (email, copy email, ask the AI, theme).
- **AI chat**: "Ask about my work". Tucks away while the hero lines are on screen. Answers only from site content.

## Do's and Don'ts

Do:
- Take every number from a README, eval file or the resume, and show the target next to the result.
- Keep one colour per project across every surface.
- Let hovering a line ghost the others to dashes; the chosen line stays solid.
- Theme browser surfaces (selection, focus ring, caret, scrollbars) from the tokens.

Don't:
- Add section numbers or status telemetry strips. Eyebrows (red dot, small caps) appear only on the hero role line and "How I build".
- Use stock photography or people who are not the owner. The portrait slot stays empty until a real photo is uploaded.
- Put colour on anything that is not a line.
- Round, improve or invent a metric.

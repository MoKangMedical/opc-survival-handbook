---
version: alpha
name: Cyber-Craftsman
description: Handcrafted warmth meets AI precision. Warm cream base, deep navy core, amber-gold accents. For independent creators who want modern tools to feel personal.
colors:
  primary: "#1A1C2E"
  secondary: "#6C9BCF"
  tertiary: "#F5A623"
  neutral: "#F7F5F2"
  surface: "#FFFFFF"
  muted: "#E8D5B7"
  text-primary: "#1A1C2E"
  text-secondary: "#4A4D5E"
  text-muted: "#9A9AA8"
  border: "#E5E0D8"
  highlight: "#FFF8EB"
typography:
  h1:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.2rem)"
    fontWeight: 900
    letterSpacing: "-0.02em"
    lineHeight: 1.2
  h2:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 1.8rem
    fontWeight: 800
    lineHeight: 1.3
  h3:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 1.15rem
    fontWeight: 700
    lineHeight: 1.5
  body:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: "1rem"
    lineHeight: 1.8
  body-sm:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 0.85rem
    lineHeight: 1.6
  label:
    fontFamily: "Inter, -apple-system, sans-serif"
    fontSize: 0.8rem
    fontWeight: 700
    letterSpacing: "0.05em"
    textTransform: uppercase
rounded:
  sm: 8px
  md: 12px
  lg: 16px
  full: 20px
spacing:
  xs: 8px
  sm: 16px
  md: 24px
  lg: 40px
  xl: 60px
components:
  nav-bar:
    backgroundColor: "{colors.neutral}"
    borderColor: "{colors.border}"
    padding: "12px 24px"
  nav-button:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
  nav-button-hover:
    backgroundColor: "{colors.tertiary}"
    textColor: "#FFFFFF"
  cover-hero:
    backgroundColor: "{colors.neutral}"
    minHeight: 100vh
  chapter-header:
    typography: "{typography.h2}"
    textColor: "{colors.primary}"
  section-heading:
    typography: "{typography.h3}"
    textColor: "{colors.secondary}"
  highlight-box:
    backgroundColor: "{colors.highlight}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "20px 24px"
  highlight-label:
    typography: "{typography.label}"
    textColor: "{colors.tertiary}"
  data-card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: 20px
  data-card-number:
    typography:
      fontFamily: "Inter, -apple-system, sans-serif"
      fontSize: 1.8rem
      fontWeight: 900
    textColor: "{colors.tertiary}"
  phase-card:
    backgroundColor: "{colors.surface}"
    borderColor: "{colors.border}"
    borderTopColor: "{colors.tertiary}"
    borderTopWidth: 4px
    rounded: "{rounded.md}"
    padding: 20px
  blockquote:
    borderLeftColor: "{colors.tertiary}"
    borderLeftWidth: 4px
    backgroundColor: "{colors.highlight}"
    rounded: 8px
    padding: "12px 20px"
  table-header:
    backgroundColor: "{colors.muted}"
    textColor: "{colors.primary}"
    borderBottomColor: "{colors.tertiary}"
    borderBottomWidth: 2px
  table-cell:
    borderBottomColor: "{colors.border}"
    borderBottomWidth: 1px
  img-placeholder:
    backgroundColor: "{colors.muted}"
    borderColor: "{colors.border}"
    borderStyle: dashed
    rounded: "{rounded.md}"
  footer:
    borderTopColor: "{colors.border}"
    textColor: "{colors.text-muted}"
---

## Overview

**Cyber-Craftsman** is a design system for creator-focused content — handbooks, guides, course pages, and documentation sites where the author is an individual (OPC / indie creator) rather than a faceless corporation. It balances warmth with precision.

**Core tension**: The content is about AI and technology, but the reader is a human creator. Warm cream backgrounds and amber accents prevent the cold, sterile feel of typical "tech" designs.

**When to use**: Creator guides, indie maker handbooks, course platforms, personal knowledge bases, one-person-company landing pages.

**When NOT to use**: Corporate SaaS dashboards, enterprise documentation, e-commerce product pages, medical/legal interfaces requiring high-trust blue-only palettes.

## Colors

- **Primary (#1A1C2E / Deep Navy):** Headlines, nav text, core UI text. Almost black with a hint of blue — softer than pure #000.
- **Secondary (#6C9BCF / Sky Blue):** Section headings, secondary actions, link underlines. Brings clarity without competing with gold.
- **Tertiary (#F5A623 / Amber Gold):** THE accent. Chapter numbers, CTAs on hover, data highlights, left borders, bullet markers. Use sparingly — one gold element per viewport section.
- **Neutral (#F7F5F2 / Warm Cream):** Page background. Warmer than white, cooler than beige. The "paper" feel.
- **Surface (#FFFFFF):** Card backgrounds. Pure white cards on cream background create clean layering.
- **Muted (#E8D5B7 / Sand):** Tag backgrounds, image placeholders, secondary button states. Warm but recessive.
- **Text Primary (#1A1C2E):** Body text. Same as primary color — keeps the palette tight.
- **Text Secondary (#4A4D5E):** Subtitles, metadata, captions. ~70% opacity equivalent.
- **Text Muted (#9A9AA8):** Footer text, placeholder labels, non-essential info.
- **Border (#E5E0D8):** Dividers, card borders. Barely visible — should guide the eye, not shout.
- **Highlight (#FFF8EB):** Blockquote backgrounds, highlight boxes. Warm amber undertone at 10% opacity.

**Dark mode variants**: Swap neutral→`#0F0F14`, surface→`#1A1C24`, text→`#E8E6E0`, text-secondary→`#9A9AA8`. Colors (blue, gold) remain unchanged but pop more against dark backgrounds.

## Typography

Inter is the sole typeface. No serif body text — this is a practical guide, not a literary journal. The font stack: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`.

**Hierarchy rules:**
- h1: Used once on cover. Massive, tight letter-spacing, weight 900.
- h2: Chapter titles. Weight 800.
- h3: Section headings inside chapters. Always has a gold left border (`border-left: 3px solid #F5A623`) and padding-left: 12px.
- Body: 1rem, line-height 1.8. Generous reading space.
- Labels: All-caps, small, gold. Used for badge text and highlight box headers.

**Chinese text**: Falls back to system CJK fonts. Inter handles Latin + numbers; Chinese renders in whatever the OS provides (PingFang on Mac, Microsoft YaHei on Windows, Noto Sans CJK on Linux).

## Layout

- **Max content width**: 800px, centered. Single-column reading layout — no sidebars, no multi-column body text.
- **Spacing rhythm**: Sections start with `margin: 32px 0`. Chapters have `margin: 60px 0` with a top border divider.
- **Cover section**: Full viewport height, flexbox centered, gradient from neutral to highlight.
- **Sticky nav**: Fixed top, `backdrop-filter: blur(10px)`. Logo left, action buttons right.
- **Gap rules**: 24px between cards in a grid. 16px between text elements inside a section.
- **Grid**: `grid-template-columns: repeat(auto-fit, minmax(180px, 1fr))` for data cards and phase cards. No fixed column counts.

## Elevation & Depth

Cyber-Craftsman is flat. No shadows, no z-index layering beyond the sticky nav. Depth comes from:
- Color contrast (white cards on cream background)
- Border lines (dividers between chapters)
- The gold left border on h3 — a single 3px line that creates visual hierarchy without shadows

**Exception**: The cover emoji has a CSS `@keyframes float` animation (translateY ±12px, 3s ease-in-out infinite). This is the ONLY motion in the system.

## Shapes

- **Border radius**: 12px for cards, 16px for containers (TOC, highlight boxes), 20px for pills/badges/buttons. Rounded but not bubbly.
- **Borders**: 1px solid on cards and dividers. 4px solid gold on blockquote left edge. 3px solid gold on h3 left edge. 2px dashed on image placeholders.
- **Icons**: Emoji-native. Chapter headers use emoji (🌍🧗🎯🧰🏭📡💰🛡️🧘🚀). No icon library dependencies.

## Components

- **`nav-bar`**: Fixed top, cream background, 1px bottom border. Logo text (font-weight 800) + action buttons.
- **`nav-button`**: Sand background pill. On hover: gold background, white text. Used for theme toggle and print.
- **`cover-hero`**: Full viewport flex column. Large emoji (80px, floating animation), h1 title, subtitle, gold badge pill.
- **`toc`**: White card with numbered list. Gold counter numbers (decimal-leading-zero format). Links turn gold on hover.
- **`chapter`**: Top-bordered section. Chapter number pill (gold text on sand bg), emoji, h2 title, italic tagline.
- **`section`**: Groups h3 heading + content. No border, just vertical spacing.
- **`section-heading`**: h3 with gold 3px left border and 12px padding-left. Sky blue text.
- **`highlight-box`**: Cream-highlight background card with optional gold label header. Used for key takeaways and workflow templates.
- **`highlight-label`**: Small uppercase gold text above highlight box content.
- **`data-card`**: White card in auto-fit grid. Large gold number + small gray description. Used for key metrics.
- **`data-card-number`**: 1.8rem, weight 900, gold. The hero element of data cards.
- **`phase-card`**: White card with gold 4px top border. Title + metadata. Used for the 4-phase monetization roadmap.
- **`blockquote`**: Gold left border, cream background, italic gray text.
- **`table-header`**: Sand background, deep navy text, gold 2px bottom border.
- **`table-cell`**: Light border-bottom between rows.
- **`img-placeholder`**: Dashed border box with emoji icon. Marks spots where generated illustrations will be placed.
- **`footer`**: Top-bordered, centered, muted text. Copyright + share prompt.

## Do's and Don'ts

- ✅ DO use gold for exactly ONE accent per viewport section — don't scatter it
- ✅ DO keep backgrounds warm (cream/white) — avoid pure #FFFFFF for page bg
- ✅ DO use emoji for chapter/scene icons — they're universally available and cost zero HTTP requests
- ✅ DO keep the single-column 800px max-width reading layout
- ❌ DON'T add shadows or depth effects — the system is intentionally flat
- ❌ DON'T introduce new fonts — Inter is the only typeface
- ❌ DON'T use gold for body text or long-form reading — it's for accents only
- ❌ DON'T add animations beyond the cover emoji float — motion should feel intentional, not decorative
- ❌ DON'T mix color temperatures — stay warm (cream/sand/amber) or neutral (navy/blue), never cold (cyan/lime/pure gray)

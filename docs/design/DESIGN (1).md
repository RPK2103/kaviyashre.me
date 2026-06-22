---
name: Personal Operating System
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#454843'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#757873'
  outline-variant: '#c5c7c1'
  surface-tint: '#5e5f5c'
  primary: '#5e5f5c'
  on-primary: '#ffffff'
  primary-container: '#fdfcf8'
  on-primary-container: '#747471'
  inverse-primary: '#c7c7c3'
  secondary: '#795465'
  on-secondary: '#ffffff'
  secondary-container: '#fdcde1'
  on-secondary-container: '#795465'
  tertiary: '#6c586d'
  on-tertiary: '#ffffff'
  tertiary-container: '#fffbff'
  on-tertiary-container: '#826d84'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3e2df'
  primary-fixed-dim: '#c7c7c3'
  on-primary-fixed: '#1b1c1a'
  on-primary-fixed-variant: '#464744'
  secondary-fixed: '#ffd8e7'
  secondary-fixed-dim: '#e9bacd'
  on-secondary-fixed: '#2e1221'
  on-secondary-fixed-variant: '#5f3c4d'
  tertiary-fixed: '#f5daf4'
  tertiary-fixed-dim: '#d8bfd8'
  on-tertiary-fixed: '#251628'
  on-tertiary-fixed-variant: '#534155'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
  surface-off-white: '#FAFAF5'
  border-subtle: '#EAEAEA'
  text-muted: '#666666'
  accent-blush: '#F8C8DC'
  accent-lilac: '#D8BFD8'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  code-label:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 16px
  meta-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 64px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style

This design system is built for a high-end AI Engineering portfolio that balances technical rigor with editorial elegance. The brand personality is "Sophisticated Technicality"—it avoids the clichés of "hacker" aesthetics in favor of a clean, structured, and intentional "Operating System" feel. It is inspired by the precision of modern engineering tools like Linear and Vercel.

The design style is **Minimalist-Tactile**. It utilizes a restricted color palette (95% neutral) to ensure that content and code remain the focal point. Depth is achieved through layered surfaces and razor-thin borders rather than heavy shadows or vibrant blurs. The goal is to evoke an emotional response of calm, competence, and premium craftsmanship.

## Colors

The palette is rooted in a "Warm Ivory" base to provide a more sophisticated and less clinical feel than pure white. 

- **Primary Base (#FDFCF8):** Used for the lowest level of the UI (the background).
- **Surface (#FAFAF5):** Used for raised elements like cards, sidebars, and panels to create a hierarchy of information.
- **Accents (#F8C8DC & #D8BFD8):** These are used sparingly (5% total) for interaction states, key focus points, or subtle status indicators.
- **Deep Charcoal (#1A1A1A):** The primary color for all high-contrast typography and iconography.

Avoid using heavy gradients or saturated fills. Color should be used like ink on paper—purposeful and minimal.

## Typography

The system utilizes **Hanken Grotesk** for its sharp, contemporary geometric feel that mirrors the precision of AI engineering. For technical data, code snippets, and "OS" status labels, **JetBrains Mono** is used to provide a developer-centric aesthetic.

Typography should be treated with an editorial eye. Use large negative space between headers and body text. "Display" styles should use tighter letter-spacing for a premium, tucked-in look, while small labels should be slightly tracked out for legibility and a mechanical feel.

## Layout & Spacing

This design system uses a **Fixed Grid** approach for desktop to maintain a controlled, high-end product feel. The layout is centered with a max-width of 1200px, utilizing a 12-column structure.

- **Editorial Scale:** Spacing is generous. Use `stack-lg` for separating major sections and `stack-md` for internal component groups.
- **Rhythm:** All spacing must be a multiple of 4px.
- **Responsive Behavior:** On mobile, margins shrink to 20px and the 12-column grid collapses to a single-column stack. Content-heavy components (like code editors) should allow for horizontal scrolling if they exceed the viewport.

## Elevation & Depth

Depth is communicated through **Tonal Layers** and **Subtle Outlines** rather than traditional elevation.

1.  **Base Layer:** Warm Ivory (#FDFCF8) - The global background.
2.  **Surface Layer:** Soft Off White (#FAFAF5) - Used for cards and navigation panels. 
3.  **Thin Borders:** Every interactive surface or container must have a `0.5px` or `1px` border using `#EAEAEA`. This creates the "Technical OS" look.
4.  **Shadows:** Shadows are used only for the highest "Z" index (e.g., modals or dropdowns). Use a "Linear-style" shadow: a very soft, multi-layered spread with 2% opacity charcoal to simulate a natural object resting on the surface.

## Shapes

The shape language is "Soft-Technical." Elements use a **Soft (0.25rem)** radius to maintain a professional, organized structure without feeling too "bubbly" or playful. 

- Large containers (Cards, Modals) use `rounded-lg` (0.5rem).
- Input fields and Buttons use the base `rounded` (0.25rem).
- Avoid pill-shapes except for status indicators (tags/chips) to keep the aesthetic "structured."

## Components

- **Buttons:** Primary buttons use a solid Deep Charcoal background with Ivory text. Secondary buttons are transparent with a 1px border. Hover states should trigger a subtle shift to Blush Pink text or a very light gray background fill.
- **Inputs:** Minimalist bottom-border or subtle 1px gray outline. Use JetBrains Mono for placeholder text to emphasize the technical nature of the OS.
- **Cards:** Surface-color backgrounds with 1px borders. No box-shadow on resting state; add a subtle shadow and 1px Blush Pink border on hover.
- **Chips/Badges:** Small, uppercase JetBrains Mono labels. Use the Blush Pink or Muted Lilac as a very faint background fill (10% opacity) with a 1px border.
- **Code Blocks:** Styled to look like a premium IDE. Use a Soft Off White background with a distinct 1px border. Ensure syntax highlighting uses a muted, professional color palette that complements the brand colors.
- **Navigation:** A persistent, thin top-bar or a floating side-dock with 1px borders and high-contrast labels.
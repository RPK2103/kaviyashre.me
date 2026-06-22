---
name: Luminous Ethereal
colors:
  surface: '#fff8f5'
  surface-dim: '#e1d8d4'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ed'
  surface-container: '#f5ece7'
  surface-container-high: '#efe6e2'
  surface-container-highest: '#e9e1dc'
  on-surface: '#1e1b18'
  on-surface-variant: '#4f4448'
  inverse-surface: '#34302c'
  inverse-on-surface: '#f8efea'
  outline: '#817478'
  outline-variant: '#d2c3c7'
  surface-tint: '#795465'
  primary: '#795465'
  on-primary: '#ffffff'
  primary-container: '#f8c8dc'
  on-primary-container: '#765162'
  inverse-primary: '#e9bacd'
  secondary: '#5c5d6e'
  on-secondary: '#ffffff'
  secondary-container: '#e1e1f5'
  on-secondary-container: '#626374'
  tertiary: '#5e5f5d'
  on-tertiary: '#ffffff'
  tertiary-container: '#d5d5d2'
  on-tertiary-container: '#5b5c5a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd8e7'
  primary-fixed-dim: '#e9bacd'
  on-primary-fixed: '#2e1221'
  on-primary-fixed-variant: '#5f3c4d'
  secondary-fixed: '#e1e1f5'
  secondary-fixed-dim: '#c5c5d8'
  on-secondary-fixed: '#191b29'
  on-secondary-fixed-variant: '#444655'
  tertiary-fixed: '#e3e2e0'
  tertiary-fixed-dim: '#c7c6c4'
  on-tertiary-fixed: '#1a1c1a'
  on-tertiary-fixed-variant: '#464745'
  background: '#fff8f5'
  on-background: '#1e1b18'
  surface-variant: '#e9e1dc'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: DM Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1200px
  gutter: 2rem
  margin-desktop: 4rem
  margin-mobile: 1.5rem
  section-gap: 8rem
---

## Brand & Style
The design system is centered on a premium, dreamlike aesthetic that balances professional authority with an approachable, artistic warmth. It targets high-end creative professionals and designers who require a portfolio that feels both curated and technologically advanced. 

The style is **Modern Glassmorphism**, characterized by translucent surfaces, soft-focus background blurs, and ethereal glowing accents. The emotional response should be one of "calm sophistication"—where the UI feels lightweight, almost floating, yet grounded by high-end editorial typography.

## Colors
The palette utilizes a warm off-white (#FAF9F6) as the primary canvas to avoid the clinical feel of pure white. Soft blush pink (#F8C8DC) and lilac (#E6E6FA) serve as the primary brand accents, frequently used in subtle gradients to represent energy and creativity. 

Interactive elements utilize "halo" effects—low-opacity radial gradients of the primary and secondary colors—to create depth. Typography and iconography use a deep charcoal (#2D2926) for optimal legibility against the light, airy backgrounds.

## Typography
This design system employs a classic high-contrast serif for headings to convey elegance and authority. For body copy, a clean, low-contrast geometric sans-serif is used to ensure readability across glassmorphic layers.

Large display titles should use tighter letter spacing to emphasize the editorial feel. On mobile devices, headline sizes scale down aggressively to maintain the "airy" whitespace characteristic of the brand style.

## Layout & Spacing
The layout philosophy is "Extravagant Airiness." It uses a fluid grid with generous margins to allow the glassmorphic components room to "breathe" and cast their glows. 

- **Desktop:** 12-column grid with wide gutters. Content is often centered or offset to create an asymmetrical, gallery-like feel.
- **Section Gaps:** Vertical spacing between sections is intentionally large (128px+) to prevent the translucent layers from feeling cluttered.
- **Mobile:** Transitions to a single-column layout with reduced margins, while maintaining the soft-edge aesthetics.

## Elevation & Depth
Depth is not communicated through traditional black shadows, but through **refraction and luminosity**. 

1.  **Backdrop Blur:** All elevated surfaces (cards, navigation bars) must apply a `backdrop-filter: blur(12px)`.
2.  **Inner Glows:** Instead of drop shadows, surfaces use a 1px semi-transparent white border to simulate light catching the edge of glass.
3.  **Color Tinted Shadows:** When depth is required, use a very soft, high-spread shadow tinted with the secondary lilac color (`rgba(230, 230, 250, 0.3)`) rather than gray.
4.  **Floating Elements:** Interactive badges and icons utilize "halo" background blurs (large, soft radial gradients) to appear as if they are emitting light.

## Shapes
The design system uses a consistent "Rounded" language. Main containers and cards utilize a `1rem` (16px) radius, while buttons and floating badges utilize a `2rem` (32px) "Pill" shape to emphasize the soft, approachable nature of the brand. Hard corners are strictly avoided to maintain the organic, ethereal feel.

## Components
- **Glassmorphic Cards:** Feature a background of `rgba(255, 255, 255, 0.4)`, a 1px white border at 20% opacity, and a 12px backdrop blur.
- **Glowing Buttons:** Primary buttons use the `ethereal_glow` gradient. On hover, the button’s box-shadow expands into a soft halo of the same color. Text remains dark for contrast.
- **Floating Badges:** Small, pill-shaped labels with a subtle lilac background tint and no border, used for categorization or status.
- **Input Fields:** Minimalist design—only a bottom border that transitions from a neutral gray to the blush pink gradient upon focus.
- **Navigation Bar:** A floating glass capsule anchored to the top of the viewport, with high-blur transparency and an ultra-thin border.
- **Lists:** Items are separated by generous whitespace and soft-tinted horizontal dividers rather than heavy lines.
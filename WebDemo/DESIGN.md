---
name: Clinical Precision
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#43474e'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#74777f'
  outline-variant: '#c4c6cf'
  surface-tint: '#455f85'
  primary: '#001631'
  on-primary: '#ffffff'
  primary-container: '#0c2b4e'
  on-primary-container: '#7993bc'
  inverse-primary: '#adc8f3'
  secondary: '#406089'
  on-secondary: '#ffffff'
  secondary-container: '#aecefd'
  on-secondary-container: '#375880'
  tertiary: '#001823'
  on-tertiary: '#ffffff'
  tertiary-container: '#002e3f'
  on-tertiary-container: '#6698b2'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d4e3ff'
  primary-fixed-dim: '#adc8f3'
  on-primary-fixed: '#001c3a'
  on-primary-fixed-variant: '#2d486c'
  secondary-fixed: '#d3e3ff'
  secondary-fixed-dim: '#a9c9f7'
  on-secondary-fixed: '#001c38'
  on-secondary-fixed-variant: '#274870'
  tertiary-fixed: '#c1e8ff'
  tertiary-fixed-dim: '#9bcde9'
  on-tertiary-fixed: '#001e2b'
  on-tertiary-fixed-variant: '#124c64'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  telemetry-data:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
    letterSpacing: -0.01em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  status-label:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base_unit: 8px
  container_padding: 32px
  card_gutter: 24px
  section_margin: 48px
  stack_sm: 12px
  stack_md: 20px
---

## Brand & Style
The design system is engineered for high-stakes laboratory environments where precision, security, and clarity are paramount. The brand personality is authoritative yet approachable, evoking a sense of technological sophistication and impenetrable reliability. 

The aesthetic follows a **Modern Corporate** approach with **Neomorphism-lite** accents. It prioritizes functional minimalism, utilizing generous whitespace to reduce cognitive load during mission-critical telemetry monitoring. The UI should feel like a high-end medical instrument: sterile but not cold, complex but not cluttered.

## Colors
The palette is anchored by a triad of deep blues to establish a "Secure Chain-of-Custody" atmosphere. 

- **Primary (#0C2B4E):** Used for navigation sidebars, headers, and primary action buttons to signify authority.
- **Secondary (#1A3D64):** Used for active states and secondary UI elements.
- **Accent (#1D546C):** Reserved for data visualization highlights and interactive telemetry indicators.
- **Background (#F4F4F4):** Provides a soft, non-reflective base that reduces eye strain in bright lab settings.
- **Surface (#FFFFFF):** Used for cards and modular containers to create clear separation of information.

## Typography
The typographic system utilizes a multi-font approach to maximize legibility and hierarchy. 

- **Hanken Grotesk** is used for primary headings to provide a modern, sharp, and professional look. 
- **Inter** handles all body copy and standard UI text, ensuring high readability across different display densities. 
- **Geist** is implemented for telemetry data (Temperature, Humidity) and labels. Its technical, slightly monospaced character provides a "data-driven" feel that distinguishes live readings from static text.

## Layout & Spacing
This design system utilizes a **Fixed 12-Column Grid** for desktop views with a maximum content width of 1440px. 

- **Sidebar:** A fixed 280px left-hand navigation panel.
- **Margins:** 32px outer margins for the main content area.
- **Gutters:** 24px consistent spacing between modular telemetry cards.
- **Rhythm:** Spacing follows an 8px baseline grid. Internal card padding should be 24px to maintain the "generous whitespace" requirement.

## Elevation & Depth
To achieve the **Neomorphism-lite** aesthetic, the design system avoids heavy, dark shadows. Instead, it uses a dual-light source approach:
- **Surface Cards:** 1px stroke in #E2E8F0 combined with a very soft, diffused shadow (`0px 4px 20px rgba(12, 43, 78, 0.05)`).
- **Interactive Elements:** Buttons and toggles use a slight inner shadow on click to simulate physical depression.
- **Depth Layers:** The background is level 0 (#F4F4F4), cards are level 1 (#FFFFFF), and overlays/modals are level 2 (higher elevation shadow).

## Shapes
The shape language is defined by modern, approachable geometry. 
- **Standard Radius:** 12px for small components like input fields and buttons.
- **Card Radius:** 16px for all primary data containers and telemetry modules.
- **Active Indicators:** Vertical pills with fully rounded ends (capsule shape) are used for sidebar active states and status badges.

## Components
- **Telemetry Cards:** Must feature a `label-caps` header, a large `telemetry-data` reading, and a sparkline or status indicator at the bottom.
- **Action Buttons:** 
    - *Primary:* Deep Navy (#0C2B4E) with white text, 12px radius.
    - *Secondary/Ghost:* Teal (#1D546C) outline with 10% opacity fill.
- **Event Controls:** Toggle switches for "Lock/Unlock" should be oversized with clear color shifts (Red for Locked, Green for Unlocked).
- **Status Badges:** Use subtle background tints with high-contrast text (e.g., light green background with dark green text for "Secure").
- **Inputs:** Minimalist bottom-border or light gray fill with 12px radius; focus state should use a 2px Teal (#1D546C) ring.
- **Chain-of-Custody Timeline:** A vertical stepper component using `secondary_color_hex` for completed steps and a dashed line for pending security checkpoints.
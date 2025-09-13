# Design System - Axios Protocol

## Overview

This document outlines the design standards and guidelines implemented in our web UI, following professional design principles for optimal user experience and conversion.

## 1. Typography System

### Fonts

- **Primary**: General Sans (Fontshare)
- **Display**: Clash Display (Fontshare)
- **Fallback**: System sans-serif

### Type Scale - Major Third (1.25)

Base font size: 16px

| Element | Size   | Line Height | Letter Spacing | Weight |
| ------- | ------ | ----------- | -------------- | ------ |
| h1      | 50px   | 100%        | -2%            | 400    |
| h2      | 40px   | 110%        | -1.5%          | 400    |
| h3      | 32px   | 120%        | -1.5%          | 400    |
| h4      | 25.6px | 130%        | -1%            | 400    |
| h5      | 20px   | 140%        | -0.5%          | 400    |
| h6      | 20px   | 140%        | -0.5%          | 400    |
| p       | 16px   | 150%        | 0%             | 300    |

### Usage

```css
/* Headings automatically use the type scale */
h1 {
  /* 50px, 100% line-height, -2% letter-spacing */
}
h2 {
  /* 40px, 110% line-height, -1.5% letter-spacing */
}

/* Body text */
p {
  /* 16px, 150% line-height, 0% letter-spacing */
}
```

## 2. Grid System

### Responsive Grid

- **Desktop**: 12 columns
- **Tablet**: 8 columns
- **Mobile**: 4 columns

### Usage

```css
.grid-cols-desktop  /* 12 columns */
/* 12 columns */
/* 12 columns */
/* 12 columns */
.grid-cols-tablet   /* 8 columns */
.grid-cols-mobile; /* 4 columns */
```

## 3. Spacing System

### Rhythm-Based Spacing (8px base unit)

- **xs**: 8px (0.5rem)
- **sm**: 16px (1rem)
- **md**: 24px (1.5rem)
- **lg**: 32px (2rem)
- **xl**: 48px (3rem)
- **2xl**: 64px (4rem)
- **3xl**: 96px (6rem)
- **4xl**: 128px (8rem)

### Usage

```css
.space-xs   /* margin-bottom: 8px */
/* margin-bottom: 8px */
/* margin-bottom: 8px */
/* margin-bottom: 8px */
.space-sm   /* margin-bottom: 16px */
.space-md   /* margin-bottom: 24px */
.space-lg   /* margin-bottom: 32px */
.space-xl   /* margin-bottom: 48px */
.space-2xl  /* margin-bottom: 64px */
.space-3xl  /* margin-bottom: 96px */
.space-4xl; /* margin-bottom: 128px */
```

## 4. Color Theory

### 60-30-10 Rule

- **60% Neutral**: Backgrounds, text (black, white, grays)
- **30% Secondary**: Cards, borders, secondary elements
- **10% Accent**: CTAs, highlights, primary actions (orange #DE6635)

### Color Palette

```css
/* Primary Colors */
--axios-orange: 16 70% 54%; /* #DE6635 - Updated */
--axios-black: 0 0% 0%; /* #000000 */
--axios-dark-gray: 0 0% 8%; /* #141414 */
--axios-light-gray: 0 0% 65%; /* #A6A6A6 */

/* Semantic Colors */
--success: 142 76% 36%; /* Green */
--warning: 43 96% 56%; /* Yellow */
--error: 0 84% 60%; /* Red */
--info: 198 93% 60%; /* Blue */
```

### Usage Guidelines

- Use opacity variations instead of adding new colors
- Maintain high contrast ratios for accessibility
- Use accent colors sparingly for maximum impact

## 5. Visual Hierarchy

### Principles

1. **Size**: Larger elements draw more attention
2. **Color**: Accent colors create focal points
3. **Spacing**: Consistent rhythm guides the eye
4. **Weight**: Font weights establish importance levels

### Implementation

```css
/* Primary CTA - Most prominent */
.cta-primary {
  background: var(--axios-orange);
  font-size: 1.25rem;
  padding: 1rem 2rem;
  box-shadow: 0 10px 25px rgba(222, 102, 53, 0.3);
}

/* Secondary CTA - Less prominent */
.cta-secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 1rem;
  padding: 0.75rem 1.5rem;
}
```

## 6. Conversion Thinking

### Every Page Needs One Goal

- **Hero Section**: Primary CTA for getting started
- **Product Pages**: Clear action buttons
- **Landing Pages**: Single conversion path

### CTA Best Practices

- **Visibility**: Above the fold, prominent positioning
- **Clarity**: Clear, action-oriented language
- **Trust**: Social proof, security badges, testimonials
- **Urgency**: Limited time offers, scarcity indicators

### Trust Signals

- Security badges (Shield icon)
- User count (10K+ Users)
- Performance indicators (Instant Execution)
- Social proof (Trusted by leading protocols)

## 7. Component Guidelines

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: var(--axios-orange);
  color: white;
  border-radius: 9999px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 9999px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Cards

```css
.card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 1.5rem;
}
```

## 8. Responsive Design

### Breakpoints

- **Mobile**: < 768px (4 columns)
- **Tablet**: 768px - 1024px (8 columns)
- **Desktop**: > 1024px (12 columns)

### Mobile-First Approach

```css
/* Base styles (mobile) */
.component {
  padding: 1rem;
  font-size: 1rem;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    padding: 1.5rem;
    font-size: 1.125rem;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    padding: 2rem;
    font-size: 1.25rem;
  }
}
```

## 9. Animation & Transitions

### Principles

- **Subtle**: Enhance UX without distraction
- **Fast**: 300ms or less for most interactions
- **Smooth**: Use cubic-bezier easing functions

### Implementation

```css
.transition-smooth {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-effect:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}
```

## 10. Accessibility

### Standards

- **Contrast**: Minimum 4.5:1 for normal text
- **Focus**: Visible focus indicators
- **Semantics**: Proper HTML structure
- **Alt Text**: Descriptive image alternatives

### Implementation

```css
/* Focus states */
.btn:focus {
  outline: 2px solid var(--axios-orange);
  outline-offset: 2px;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .card {
    border: 2px solid currentColor;
  }
}
```

## 11. Performance

### Guidelines

- Use CSS custom properties for theming
- Minimize JavaScript animations
- Optimize images and assets
- Implement lazy loading where appropriate

## 12. Maintenance

### Code Organization

- Use consistent naming conventions
- Document component variations
- Maintain design token consistency
- Regular design system audits

### Updates

- Version control for design changes
- Team communication for updates
- Documentation updates with changes
- Testing across different devices and browsers

---

_This design system should be treated as a living document, updated as the product evolves and new patterns emerge._

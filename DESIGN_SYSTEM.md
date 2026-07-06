# Digital Shadow — Design System Reference

## Project Info
- **Name**: Digital Shadow
- **Tagline**: "Your Life Has a Memory, Even When You Don't."
- **Theme**: Digital Life Timeline Reconstruction System using Linked List and Stack in C
- **Base Path**: C:\Users\Pratham\.gemini\antigravity\scratch\DigitalShadow

## Color Palette (CSS Custom Properties)
```css
--bg-primary: #07070f;
--bg-secondary: #0d0d1a;
--bg-tertiary: #141428;
--surface: rgba(255, 255, 255, 0.03);
--surface-hover: rgba(255, 255, 255, 0.06);
--surface-border: rgba(255, 255, 255, 0.06);
--surface-border-hover: rgba(255, 255, 255, 0.12);
--primary: #7c5cff;
--primary-glow: #9d7dff;
--primary-dim: #5a3dcc;
--accent: #00d4aa;
--accent-glow: #33ffd4;
--text-primary: #f0f0f5;
--text-secondary: #8888aa;
--text-tertiary: #555577;
--error: #ff4d6a;
--success: #00d4aa;
--warning: #ffb800;
--gradient-primary: linear-gradient(135deg, #7c5cff 0%, #00d4aa 100%);
--gradient-hero: radial-gradient(ellipse at 50% 0%, rgba(124,92,255,0.15) 0%, transparent 60%);
--shadow-sm: 0 2px 8px rgba(0,0,0,0.3);
--shadow-md: 0 8px 32px rgba(0,0,0,0.4);
--shadow-lg: 0 16px 64px rgba(0,0,0,0.5);
--shadow-glow: 0 0 30px rgba(124,92,255,0.3);
```

## Light Theme Overrides
```css
[data-theme="light"] {
  --bg-primary: #f5f5fa;
  --bg-secondary: #eeeef5;
  --bg-tertiary: #e4e4ee;
  --surface: rgba(255, 255, 255, 0.7);
  --surface-hover: rgba(255, 255, 255, 0.9);
  --surface-border: rgba(0, 0, 0, 0.08);
  --surface-border-hover: rgba(0, 0, 0, 0.15);
  --text-primary: #1a1a2e;
  --text-secondary: #555577;
  --text-tertiary: #8888aa;
  --shadow-sm: 0 2px 8px rgba(0,0,0,0.08);
  --shadow-md: 0 8px 32px rgba(0,0,0,0.1);
  --shadow-lg: 0 16px 64px rgba(0,0,0,0.12);
  --shadow-glow: 0 0 30px rgba(124,92,255,0.15);
  --gradient-hero: radial-gradient(ellipse at 50% 0%, rgba(124,92,255,0.08) 0%, transparent 60%);
}
```

## Typography
```
Heading Font: 'Space Grotesk', sans-serif
Body Font: 'Inter', sans-serif
Google Fonts Link: https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap
```

## Sizes
```
h1: clamp(2.5rem, 5vw, 4rem), font-weight: 700, Space Grotesk
h2: clamp(1.8rem, 3vw, 2.5rem), font-weight: 600, Space Grotesk
h3: clamp(1.2rem, 2vw, 1.5rem), font-weight: 600, Space Grotesk
body: 1rem (16px), font-weight: 400, Inter, line-height: 1.7
small: 0.875rem
badge: 0.75rem, uppercase, letter-spacing: 2px
```

## Spacing
```
--container-max: 1200px
--section-padding: clamp(4rem, 8vw, 8rem) 0
--card-padding: 2rem
--gap-sm: 1rem
--gap-md: 2rem  
--gap-lg: 3rem
```

## Border Radius
```
--radius-sm: 8px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 24px
--radius-pill: 50px
--radius-circle: 50%
```

## Glass Effect
```css
.glass {
  background: var(--surface);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--surface-border);
  border-radius: var(--radius-lg);
}
```

## Transitions
```
--transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1)
--transition-spring: 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)
```

## CSS Files Linked in EVERY HTML (in this order)
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="css/style.css">
<link rel="stylesheet" href="css/navbar.css">
<link rel="stylesheet" href="css/animations.css">
<link rel="stylesheet" href="css/cards.css">
<link rel="stylesheet" href="css/timeline.css">
<link rel="stylesheet" href="css/compiler.css">
<link rel="stylesheet" href="css/responsive.css">
<link rel="stylesheet" href="css/darktheme.css">
```

## JS Files Linked at End of Body in EVERY HTML
```html
<script src="js/main.js"></script>
<script src="js/navbar.js"></script>
<script src="js/theme.js"></script>
<script src="js/particles.js"></script>
<script src="js/search.js"></script>
```

## NAVBAR HTML (include in EVERY page, exact same markup)
```html
<nav class="navbar" id="navbar">
  <div class="nav-container">
    <a href="index.html" class="nav-logo">
      <span class="logo-icon">◈</span>
      <span class="logo-text">Digital Shadow</span>
    </a>
    <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
      <span></span><span></span><span></span>
    </button>
    <div class="nav-menu" id="navMenu">
      <div class="nav-links">
        <a href="index.html" class="nav-link">Home</a>
        <a href="about.html" class="nav-link">About</a>
        <a href="problem.html" class="nav-link">Problem</a>
        <a href="features.html" class="nav-link">Features</a>
        <a href="architecture.html" class="nav-link">Architecture</a>
        <div class="nav-dropdown">
          <button class="nav-link dropdown-trigger">Data Structures <span class="dropdown-arrow">▾</span></button>
          <div class="dropdown-menu">
            <a href="linkedlist.html" class="dropdown-link">Linked List</a>
            <a href="stack.html" class="dropdown-link">Stack</a>
          </div>
        </div>
        <a href="flowchart.html" class="nav-link">Flowchart</a>
        <a href="algorithm.html" class="nav-link">Algorithm</a>
        <a href="visualization.html" class="nav-link">Visualization</a>
        <a href="compiler.html" class="nav-link">Compiler</a>
        <a href="statistics.html" class="nav-link">Statistics</a>
        <a href="future.html" class="nav-link">Future</a>
        <a href="viva.html" class="nav-link">Viva</a>
        <a href="report.html" class="nav-link">Report</a>
        <a href="ppt.html" class="nav-link">PPT</a>
        <a href="contact.html" class="nav-link">Contact</a>
      </div>
      <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
        <span class="theme-icon">🌙</span>
      </button>
    </div>
  </div>
</nav>
```

## FOOTER HTML (include in EVERY page)
```html
<footer class="footer">
  <div class="footer-content">
    <div class="footer-brand">
      <span class="logo-icon">◈</span>
      <span>Digital Shadow</span>
    </div>
    <p class="footer-tagline">Your Life Has a Memory, Even When You Don't.</p>
    <div class="footer-links">
      <a href="index.html">Home</a>
      <a href="about.html">About</a>
      <a href="visualization.html">Demo</a>
      <a href="contact.html">Contact</a>
    </div>
    <p class="footer-copy">© 2026 Digital Shadow. Built with passion.</p>
  </div>
</footer>
```

## HTML Boilerplate Template
```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Page Title] — Digital Shadow</title>
  <meta name="description" content="[page-specific description]">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>◈</text></svg>">
  <!-- CSS Links (see above) -->
  <!-- Page-specific CSS if needed -->
</head>
<body>
  <!-- NAVBAR (see above) -->
  <div id="particles-container" class="particles-container"></div>
  <main>
    <section class="page-hero">
      <div class="container">
        <span class="section-badge">[BADGE]</span>
        <h1 class="page-title">[TITLE]</h1>
        <p class="page-subtitle">[SUBTITLE]</p>
      </div>
    </section>
    <!-- PAGE CONTENT SECTIONS -->
    <section class="section" id="[section-id]">
      <div class="container">
        <!-- content -->
      </div>
    </section>
  </main>
  <!-- FOOTER (see above) -->
  <!-- JS Scripts (see above) -->
  <!-- Page-specific JS if needed -->
</body>
</html>
```

## CSS Class Conventions

### Layout
- `.container` — max-width: 1200px centered
- `.section` — Section with vertical padding
- `.page-hero` — Hero section with gradient background

### Cards
- `.glass-card` — Glassmorphic card
- `.feature-card` — Feature grid card with icon
- `.info-card` — Informational card

### Buttons
- `.btn` — Base button
- `.btn-primary` — Primary filled button (gradient)
- `.btn-secondary` — Secondary outlined button
- `.btn-glow` — Button with glow effect

### Text
- `.section-badge` — Uppercase colored badge above section title
- `.page-title` — Main page heading
- `.page-subtitle` — Subtitle text
- `.gradient-text` — Text with gradient fill

### Animations (classes added by IntersectionObserver)
- `.reveal` — Element to be revealed on scroll
- `.revealed` — Active state after scroll trigger
- `.reveal-left` — Slide in from left
- `.reveal-right` — Slide in from right
- `.reveal-up` — Slide up (default)
- `.stagger-1` through `.stagger-6` — Stagger delay classes

### Grid
- `.grid-2` — 2-column grid
- `.grid-3` — 3-column grid
- `.grid-4` — 4-column grid

## Key Interaction Patterns

### Cards hover
- translateY(-4px) on hover
- Border color brightens
- Subtle glow shadow appears

### Buttons hover
- Scale(1.02) + box-shadow glow
- Background shifts slightly

### Section entrance
- IntersectionObserver adds .revealed class
- Elements translate from 30px below + opacity 0 → visible position

## Important Notes
- ALL pages use data-theme="dark" by default on <html>
- theme.js handles toggling to data-theme="light"
- particles.js creates floating dots in #particles-container
- navbar.js handles mobile menu + scroll-based navbar background
- main.js handles IntersectionObserver reveal animations
- NO external frameworks (no Bootstrap, no jQuery, no Tailwind)
- Use ONLY vanilla HTML5, CSS3, JavaScript
- Every interactive element needs a unique ID for testing

# Silent Pilot Style Guide

## Color Contrast Rules (CRITICAL - READ BEFORE CODING)

### ❌ NEVER DO THIS:
- White text on white background
- Light gray (#666, #888, #999) text on white background
- Any text color lighter than #555 on light backgrounds

### ✅ ALWAYS USE THESE COMBINATIONS:

#### On White or Light Backgrounds (#fff, #f9fafb, #f3f4f6):
- **Primary Text**: `#111827` or `#1f2937` (dark gray/black)
- **Secondary Text**: `#4b5563` (medium-dark gray)
- **Accent Colors**: Only for highlights, not body text

#### On Dark Backgrounds (#1f2937, #111827, dark gradients):
- **Text**: `#ffffff` or `#f9fafb` (white/off-white)
- **Secondary Text**: `#d1d5db` (light gray)

#### On Colored Backgrounds (gradients, brand colors):
- **Text**: Always white `#ffffff`
- **Buttons**: White background with colored text OR solid color with white text

### Testing Contrast
Before deploying, check text is readable:
1. Can you easily read it without squinting?
2. Does it pass WCAG AA contrast ratio (4.5:1 minimum)?
3. Test on both light and dark mode if applicable

### Common Components

**Body Text on White:**
```jsx
<p style={{color: '#1f2937', lineHeight: '1.6'}}>Your text</p>
```

**Secondary Text on White:**
```jsx
<p style={{color: '#4b5563', fontSize: '14px'}}>Secondary info</p>
```

**Text in Colored Section:**
```jsx
<div style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#ffffff'}}>
  <h1 style={{color: '#ffffff'}}>Heading</h1>
  <p style={{color: '#ffffff', opacity: 0.9}}>Body text</p>
</div>
```

**Buttons:**
```jsx
// Light button on dark background
<button style={{background: '#ffffff', color: '#667eea'}}>Click Me</button>

// Dark button on light background
<button style={{background: '#667eea', color: '#ffffff'}}>Click Me</button>
```

## This is a MANDATORY requirement
Any PR or code with poor contrast will be rejected.

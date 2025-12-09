# Customization Guide - Silent Pilot Clone

This guide will help you customize the website to match your brand and needs.

## 🎨 Changing Colors

### Primary Gradient Colors

The main gradient (purple to pink) is used throughout the site. To change it:

**Find and replace in all CSS files:**

```css
/* Current gradient */
background: linear-gradient(135deg, #5865F2 0%, #FF73B3 100%);

/* Change to your colors */
background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
```

**Common locations:**
- Button backgrounds
- Text gradients
- Accent elements
- Hover effects

### Background Colors

```css
/* Main background - src/index.css and App.css */
background: #0a0a0a;  /* Dark background */
background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
```

### Text Colors

```css
/* Primary text */
color: #ffffff;

/* Secondary text */
color: rgba(255, 255, 255, 0.7);  /* 70% opacity */
color: rgba(255, 255, 255, 0.6);  /* 60% opacity */
```

---

## 📝 Changing Content

### Site Title and Description

**public/index.html:**
```html
<title>Your Site Name</title>
<meta name="description" content="Your site description" />
```

### Logo Text

**src/components/Header.js:**
```javascript
<span className="logo-text">Your Brand Name</span>
```

**src/components/Footer.js:**
```javascript
<span className="footer-logo-text">Your Brand Name</span>
```

### Hero Section

**src/components/Hero.js:**
```javascript
// Main headline
<h1 className="hero-title">
  Your Main Headline
  <span className="gradient-text"> With Gradient</span>
</h1>

// Description
<p className="hero-description">
  Your compelling description goes here...
</p>

// Button text
<button className="btn-hero-primary">Your CTA Text</button>
```

### Features

**src/components/Features.js:**
```javascript
const features = [
  {
    icon: '🎯',  // Change emoji or use custom icon
    title: 'Your Feature Title',
    description: 'Your feature description'
  },
  // Add more features...
];
```

### Pricing Plans

**src/components/Pricing.js:**
```javascript
const plans = [
  {
    name: 'Your Plan Name',
    description: 'Plan description',
    monthlyPrice: 29,
    yearlyPrice: 290,
    features: [
      'Feature 1',
      'Feature 2',
      // Add more features...
    ],
    highlighted: false  // Set to true for main plan
  }
];
```

### Testimonials

**src/components/Testimonials.js:**
```javascript
const testimonials = [
  {
    name: 'Customer Name',
    role: 'Job Title',
    company: 'Company Name',
    avatar: '👤',  // Change emoji
    content: 'Their testimonial quote',
    rating: 5
  }
];
```

### FAQ

**src/components/FAQ.js:**
```javascript
const faqs = [
  {
    question: 'Your question?',
    answer: 'Your detailed answer...'
  }
];
```

---

## 🖼️ Adding Custom Images/Icons

### Option 1: Using Image Files

1. **Add images to `public/images/` folder**

2. **Use in components:**
```javascript
<img src="/images/your-image.png" alt="Description" />
```

### Option 2: Using Icon Libraries

1. **Install React Icons:**
```bash
npm install react-icons
```

2. **Use in components:**
```javascript
import { FaRocket, FaLock, FaChartLine } from 'react-icons/fa';

<FaRocket className="feature-icon" />
```

### Option 3: Custom SVG Icons

Replace emoji icons with SVG:
```javascript
<svg width="48" height="48" viewBox="0 0 48 48" fill="none">
  <path d="..." stroke="url(#gradient)" strokeWidth="2"/>
  <defs>
    <linearGradient id="gradient">
      <stop offset="0%" stopColor="#5865F2"/>
      <stop offset="100%" stopColor="#FF73B3"/>
    </linearGradient>
  </defs>
</svg>
```

---

## 🎭 Changing Fonts

### Using Different Google Fonts

1. **Update public/index.html:**
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

2. **Update src/index.css:**
```css
body {
  font-family: 'Poppins', sans-serif;
}
```

### Popular Font Combinations

**Modern & Clean:**
- Headlines: Montserrat
- Body: Open Sans

**Professional:**
- Headlines: Playfair Display
- Body: Source Sans Pro

**Tech/Startup:**
- Headlines: Space Grotesk
- Body: Inter (current)

---

## 📐 Layout Adjustments

### Container Width

**src/App.css:**
```css
.container {
  max-width: 1200px;  /* Change to 1400px for wider layout */
  margin: 0 auto;
  padding: 0 24px;
}
```

### Section Spacing

```css
/* Adjust padding in each section CSS */
.section {
  padding: 120px 0;  /* Change to 80px or 160px */
}
```

### Grid Columns

**Features Grid:**
```css
.features-grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  /* Change to: */
  grid-template-columns: repeat(2, 1fr);  /* Always 2 columns */
  /* Or: */
  grid-template-columns: repeat(4, 1fr);  /* Always 4 columns */
}
```

---

## 🎬 Animation Adjustments

### Speed

**src/App.css:**
```css
@keyframes fadeInUp {
  /* Adjust animation-duration in component CSS */
}

.feature-card {
  animation: fadeInUp 0.8s ease-out;  /* Change to 0.5s for faster */
}
```

### Disable Animations

```css
/* Add to component CSS to disable specific animations */
.feature-card {
  animation: none;
  opacity: 1;
  transform: none;
}
```

---

## 📱 Responsive Breakpoints

Change mobile/tablet breakpoints in any CSS file:

```css
/* Current breakpoints */
@media (max-width: 768px) { }   /* Mobile */
@media (max-width: 1024px) { }  /* Tablet */

/* Adjust as needed */
@media (max-width: 640px) { }   /* Small mobile */
@media (max-width: 992px) { }   /* Tablet */
@media (max-width: 1280px) { }  /* Small desktop */
```

---

## 🔘 Button Styles

### Primary Button

```css
.btn-primary {
  padding: 12px 28px;  /* Adjust size */
  border-radius: 8px;   /* Adjust roundness */
  font-size: 14px;      /* Adjust text size */
}
```

### Add New Button Style

**src/App.css:**
```css
.btn-outline {
  padding: 12px 24px;
  background: transparent;
  border: 2px solid #5865F2;
  color: #5865F2;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  background: #5865F2;
  color: #fff;
}
```

---

## 🌐 Navigation Links

**src/components/Header.js:**
```javascript
<nav className="nav">
  <a href="#home">Home</a>
  <a href="#features">Features</a>
  <a href="#pricing">Pricing</a>
  <a href="#contact">Contact</a>
  {/* Add or remove links as needed */}
</nav>
```

---

## 📊 Adding New Sections

### 1. Create New Component

**src/components/YourSection.js:**
```javascript
import React from 'react';
import './YourSection.css';

function YourSection() {
  return (
    <section className="your-section">
      <div className="container">
        <h2 className="section-title">Your Section Title</h2>
        {/* Your content here */}
      </div>
    </section>
  );
}

export default YourSection;
```

### 2. Create CSS File

**src/components/YourSection.css:**
```css
.your-section {
  padding: 120px 0;
  position: relative;
}

/* Add your styles */
```

### 3. Add to App.js

```javascript
import YourSection from './components/YourSection';

function App() {
  return (
    <div className="App">
      {/* ... other components ... */}
      <YourSection />
      {/* ... rest of components ... */}
    </div>
  );
}
```

---

## 🎨 Glass-Morphism Effect

Used throughout the site. Customize:

```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);  /* Adjust opacity */
  backdrop-filter: blur(10px);            /* Adjust blur amount */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

**More opaque:**
```css
background: rgba(255, 255, 255, 0.15);
```

**More blur:**
```css
backdrop-filter: blur(20px);
```

---

## 🌟 Gradient Text

**Apply to any text:**
```css
.gradient-text {
  background: linear-gradient(135deg, #5865F2 0%, #FF73B3 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

**Or use inline in components:**
```javascript
<span className="gradient-text">Highlighted Text</span>
```

---

## 📦 Component Structure

```
src/components/
├── Header.js / Header.css
├── Hero.js / Hero.css
├── Features.js / Features.css
├── Demo.js / Demo.css
├── Pricing.js / Pricing.css
├── Testimonials.js / Testimonials.css
├── FAQ.js / FAQ.css
├── Newsletter.js / Newsletter.css
├── CTA.js / CTA.css
├── Footer.js / Footer.css
└── ScrollToTop.js / ScrollToTop.css
```

Each component is self-contained with its own styles.

---

## 💡 Pro Tips

1. **Consistency**: Use the same padding/margin values across sections
2. **Color Harmony**: Stick to 2-3 main colors
3. **Typography Scale**: Use consistent font sizes (14px, 16px, 18px, 24px, 32px, 48px)
4. **Spacing Scale**: Use multiples of 4 or 8 (8px, 16px, 24px, 32px, 48px)
5. **Test Changes**: Always test on mobile after making changes
6. **Use Variables**: Consider CSS variables for easier color management

---

## 🔄 CSS Variables (Optional Enhancement)

Add to `src/index.css` for easier customization:

```css
:root {
  --color-primary: #5865F2;
  --color-secondary: #FF73B3;
  --color-bg: #0a0a0a;
  --color-text: #ffffff;
  --spacing-unit: 8px;
  --border-radius: 16px;
}

/* Then use throughout: */
.card {
  background: var(--color-primary);
  padding: calc(var(--spacing-unit) * 3);
  border-radius: var(--border-radius);
}
```

---

## 🎉 Quick Wins

### 1. Change All Gradients at Once
Find and replace: `#5865F2` and `#FF73B3` throughout project

### 2. Adjust All Spacing
Find and replace padding values (e.g., `120px` to `100px`)

### 3. Change All Border Radius
Find and replace `border-radius` values

### 4. Update Brand Name
Find and replace "Silent Pilot" throughout

---

Need help with a specific customization? Check the component's CSS file - everything is well-commented and organized! 🚀

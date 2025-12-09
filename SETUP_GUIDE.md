# Setup Guide for Silent Pilot React Website

## Prerequisites

Before running this project, you need to have Node.js and npm installed on your system.

### Install Node.js and npm

1. **Download Node.js** from [https://nodejs.org/](https://nodejs.org/)
   - Download the LTS (Long Term Support) version
   - This will also install npm (Node Package Manager)

2. **Verify Installation**
   ```bash
   node --version
   npm --version
   ```

## Running the Project

Once Node.js and npm are installed, follow these steps:

### 1. Install Dependencies

In the project directory, run:
```bash
npm install
```

This will install all required packages including React and React Scripts.

### 2. Start Development Server

```bash
npm start
```

This will:
- Start the development server
- Open your default browser to [http://localhost:3000](http://localhost:3000)
- Enable hot-reloading (changes will appear automatically)

### 3. Build for Production

When ready to deploy:
```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Project Structure

```
silent-pilot-clone/
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── components/
│   │   ├── Header.js       # Navigation header
│   │   ├── Header.css
│   │   ├── Hero.js         # Hero section
│   │   ├── Hero.css
│   │   ├── Features.js     # Features grid
│   │   ├── Features.css
│   │   ├── Demo.js         # Interactive demo
│   │   ├── Demo.css
│   │   ├── CTA.js          # Call-to-action
│   │   ├── CTA.css
│   │   ├── Footer.js       # Footer section
│   │   └── Footer.css
│   ├── App.js              # Main app component
│   ├── App.css             # Global app styles
│   ├── index.js            # Entry point
│   └── index.css           # Global styles
├── package.json            # Dependencies and scripts
└── README.md               # Project documentation

## Features

✨ **Modern Design**
- Gradient backgrounds with animated orbs
- Glass-morphism effects
- Smooth animations and transitions

📱 **Responsive Layout**
- Mobile-first design
- Adapts to all screen sizes
- Touch-friendly interactions

🎯 **Interactive Elements**
- Tabbed demo interface
- Hover effects
- Animated components

## Customization Tips

### Change Colors

Edit the gradient colors in any component's CSS:
```css
background: linear-gradient(135deg, #5865F2 0%, #FF73B3 100%);
```

### Modify Content

Update text and content directly in the component files:
- `Hero.js` - Main headline and description
- `Features.js` - Feature cards
- `Demo.js` - Demo content

### Add New Sections

1. Create a new component in `src/components/`
2. Import it in `App.js`
3. Add it to the render method

## Troubleshooting

### Port Already in Use

If port 3000 is busy:
```bash
PORT=3001 npm start
```

### Clear Cache

If you encounter issues:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Deployment Options

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
1. Build the project: `npm run build`
2. Deploy the `build/` folder to Netlify

### GitHub Pages
```bash
npm install gh-pages --save-dev
```

Add to package.json:
```json
"homepage": "https://yourusername.github.io/your-repo",
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d build"
}
```

Then run:
```bash
npm run deploy
```

## Support

For issues or questions:
- Check the React documentation: [https://react.dev/](https://react.dev/)
- Review component code for customization examples
- Ensure all dependencies are properly installed

Enjoy building with Silent Pilot! 🚀

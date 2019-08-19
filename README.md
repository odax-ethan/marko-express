Cortex: Marko + Express + Johnny-five + Bulma
======================================

# Installation

```
git clone https://github.com/marko-js-samples/marko-express.git
cd marko-express
npm install
node server.js
```

# Project Structure

```
.
├── components - Directory containing custom tag implementations
│   ├── app-hud-display -
│   │   └── index.marko
│   └── a-example - a components to duplicate
│       └── index.marko
├── package.json - npm metadata
├── marko-taglib.json - Marko taglib used to discover custom tags
├── Cortex.js - JavaScript entry point for this application
└── static - Folder containing static JavaScript and CSS files
    └── style.css
```


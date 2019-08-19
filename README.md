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
│   │   └── template.marko
│   └── a-example -
│       └── renderer.js
├── package.json - npm metadata
├── marko-taglib.json - Marko taglib used to discover custom tags
├── Cortex.js - JavaScript entry point for this application
└── static - Folder containing static JavaScript and CSS files
    └── style.css
```

# Details

## Page Rendering

This application registers a single "/" route that renders out the main index page using the `index.marko` template.

The template is loaded using the following code:

```javascript
var indexTemplate = require('./index.marko');
```

Later, in the route handler, the template is rendered writable HTTP response stream as shown in the code below:

```javascript
indexTemplate.stream({
        name: 'Frank',
        count: 30,
        colors: ['red', 'green', 'blue']
    }, res);
```

As with all Node.js streams, when piping to a target stream, the target stream is ended when the source stream is done producing data. Since we are piping to an HTTP response stream, the HTTP response stream is ended and the connection is closed.

## Custom Tags

This sample app includes a `marko-taglib.json` in the root that is used to register the custom tags. This taglib file is automatically discovered by searching up the directory tree from a template's location on disk. For this sample, the `marko-taglib.json` is the following:

```json
{
    "tags-dir": "./components"
}
```

This simple taglib tells the Marko compiler to scan the `components` directory to discover custom tags. In this sample app, the following three custom tags will be discovered and registered:

1. `<app-button/>`
2. `<app-header/>`
3. `<app-hello/>`

The `<app-button/>` custom tag uses `marko-tag.json` file to declare which attributes are allowed. This tag definition is shown below:

```javascript
{
    "@label": "string",
    "@href": "string",
    "@variant": "string", // primary | info | success | warning | danger | inverse
    "@size": "string", // large | small | mini
    "@toggle": "boolean",
    "@toggled": "boolean",
    "@dropdown": "boolean",
    "@*": "string"
}
```

## Includes

This sample app also illustrates how to use the `<include>` tag to include another template. In `index.marko` the following code is used to include the footer template:

```html
<include template="./footer.marko"/>
```

_NOTE: Custom tags are often a better choice over using template includes. In this sample app, the header is a custom tag and the footer is an include so that you can see the difference._

# OpenPDFCreator
OpenPDFCreator is a simple application that allows you to generate pdf from images.

![application preview image](https://raw.githubusercontent.com/DaveDeDave/OpenPDFCreator/main/docs/preview.png)

## What can I do?
You can:
- add images to your pdf dragging them on the 'plus' icon (or by clicking on it)
- change the pages order by dragging them
- delete a selected page by clicking on the 'recycle bin' icon
- see a (minimal) pdf preview in the sidebar menu

### How to run?
1. npm install
2. npm start

### Build instructions
If you want to build a portable version of this application just type on your terminal:
- npm run build

### Compile dist javascript through Browserify
Move in **src/public/js/src** and type:
- browserify index.js --standalone openpdfcreator > ../dist/openpdfcreator.bundle.js

## Technologies
- Electron
- PDFKit
- Shopify Draggable
- Browserify

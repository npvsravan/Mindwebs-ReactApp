# 🗺️ Polygon Map Dashboard

A React + TypeScript + Vite + Leaflet-based dashboard for visualizing and interacting with polygon-based map data. Supports per-polygon data source selection and threshold-based coloring rules.

---

## ✅ Setup and Run Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- npm or yarn

### Running Locally

```bash

# Clone the repository
git clone https://github.com/npvsravan/Mindwebs-ReactApp.git

cd mindwebs-dashboard

# Install dependencies
npm install

# Run the app locally
npm run dev
```


# Summary of Libraries Used

Runtime Dependencies
react – Core UI library

react-dom – DOM bindings for React

leaflet – Interactive maps

react-leaflet – React bindings for Leaflet

react-leaflet-draw – Drawing tools on maps

tailwindcss – Utility-first CSS framework

postcss, autoprefixer, @tailwindcss/postcss – CSS tooling

# Dev Dependencies

vite – Development/build tool

@vitejs/plugin-react – Vite plugin for React

typescript – TypeScript support

@types/react, @types/react-dom, @types/leaflet – TypeScript type definitions

# Design & Development Remarks
Modular structure with separate components for map and sidebar controls.

Leaflet is integrated via React-Leaflet for seamless state management.

TailwindCSS is used for styling the sidebar and layout responsiveness.

React-Leaflet-Draw allows users to interactively draw and edit polygons.

Auto-deploy is configured via Netlify, connected to GitHub repository.

Threshold-based coloring and per-polygon source selection logic is modular and scalable.

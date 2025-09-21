// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Wichtig für MUI X Data Grid im Pages Router:
  // Erlaubt das Transpilieren & damit die CSS-Imports aus dem Paket.
  transpilePackages: [
    '@mui/x-data-grid',
    // Falls Sie Pro/Premium nutzen, hier ergänzen:
    // '@mui/x-data-grid-pro',
    // '@mui/x-data-grid-premium',
  ],

  // Optional: Wenn Sie zuvor eine Root-Fehlinterpretation hatten,
  // können Sie outputFileTracingRoot entfernen oder anpassen.
  // outputFileTracingRoot: require('path').join(__dirname, '..'),
};

module.exports = nextConfig;

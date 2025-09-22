// next.config.js
import path from 'path';
/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ['@mui/x-data-grid'],
  // Workspace-Root explizit setzen (anpassen, falls notwendig)
  outputFileTracingRoot: path.join(__dirname, '..'),
};

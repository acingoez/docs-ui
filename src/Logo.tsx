// src/Logo.tsx
import * as React from 'react';
import { Box } from '@mui/material';

/**
 * Schlankes SVG-Logo für "docuMe"
 * - Dokumentblatt + abgerundete Ecken
 * - Wortmarke "docuMe" mit Gewichtung
 */
export default function Logo({ size = 28, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <svg width={size} height={size} viewBox="0 0 64 64" aria-label="docuMe Logo" role="img">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <rect x="8" y="8" rx="12" ry="12" width="48" height="48" fill="url(#g)" />
        <path d="M24 20h14l8 8v16a6 6 0 0 1-6 6H24a6 6 0 0 1-6-6V26a6 6 0 0 1 6-6z" fill="#fff" />
        <rect x="28" y="30" width="16" height="3" rx="1.5" fill="currentColor" opacity="0.55" />
        <rect x="28" y="36" width="12" height="3" rx="1.5" fill="currentColor" opacity="0.45" />
      </svg>
      {withText && (
        <Box
          component="span"
          sx={{
            fontWeight: 800,
            letterSpacing: 0.3,
            fontSize: 18,
            lineHeight: 1,
          }}
        >
          <Box component="span" sx={{ color: 'primary.main' }}>docu</Box>
          <Box component="span" sx={{ color: 'text.primary' }}>Me</Box>
        </Box>
      )}
    </Box>
  );
}

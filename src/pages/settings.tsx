// pages/settings.tsx
import * as React from 'react';
import { Stack, Typography } from '@mui/material';

export default function SettingsPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600}>Einstellungen</Typography>
      <Typography variant="body2">Globale DMS-Konfiguration, Rollen und Richtlinien.</Typography>
    </Stack>
  );
}

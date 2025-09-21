// pages/archiv.tsx
import * as React from 'react';
import { Stack, Typography } from '@mui/material';

export default function ArchivPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600}>Archiv</Typography>
      <Typography variant="body2">Historisierte Dokumente mit Suche & Wiederherstellung.</Typography>
    </Stack>
  );
}

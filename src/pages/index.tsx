// pages/index.tsx
import * as React from 'react';
import { Stack, Typography, Button } from '@mui/material';

export default function HomePage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600}>Übersicht</Typography>
      <Typography variant="body1">Willkommen im Dokumenten-Management-System.</Typography>
      <Stack direction="row" spacing={1}>
        <Button variant="contained">Schnellstart</Button>
        <Button variant="outlined">Hilfe</Button>
      </Stack>
    </Stack>
  );
}

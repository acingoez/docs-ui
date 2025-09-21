// pages/user.tsx
import * as React from 'react';
import { Stack, Typography } from '@mui/material';

export default function UserPage() {
  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={600}>Benutzerprofil</Typography>
      <Typography variant="body2">Profil, Sicherheit, Benachrichtigungen.</Typography>
    </Stack>
  );
}

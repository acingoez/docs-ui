/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/documents.tsx
import * as React from 'react';
import useSWR from 'swr';
import {
  Box,
  Paper,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  LinearProgress,
  Alert,
  Stack,
} from '@mui/material';
import { DocumentCards } from '@/components/DocumentCards';
import { fetchJSON } from '@/lib/api';
import { ApiDocument } from '@/types/document';
import { DocumentTable } from '@/components/DocumentTable';


export default function DocumentsPage() {
  const { data, error, isLoading } = useSWR<ApiDocument[]>(
    '/document/all',
    (path: string) => fetchJSON<ApiDocument[]>(path)
  );

  const [view, setView] = React.useState<'table' | 'cards'>(() =>
    (typeof window !== 'undefined' && (localStorage.getItem('docume:view') as 'table' | 'cards')) || 'table'
  );

  const handleView = (_: any, next: 'table' | 'cards' | null) => {
    if (!next) return;
    setView(next);
    if (typeof window !== 'undefined') localStorage.setItem('docume:view', next);
  };

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 2 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Documents
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Abruf über API: <code>GET {`/document/all`}</code>
            </Typography>
          </Box>
          <ToggleButtonGroup size="small" value={view} exclusive onChange={handleView}>
            <ToggleButton value="table">Tabelle</ToggleButton>
            <ToggleButton value="cards">Kacheln</ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Paper>

      {isLoading && (
        <Paper sx={{ p: 0, overflow: 'hidden', mb: 2 }}>
          <LinearProgress />
        </Paper>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Fehler beim Laden: {String((error as any).message || error)}
        </Alert>
      )}

      <Paper sx={{ p: 2 }}>
        {view === 'table' ? (
          <DocumentTable rows={data || []} />
        ) : (
          <DocumentCards docs={data || []} />
        )}
      </Paper>
    </Box>
  );
}

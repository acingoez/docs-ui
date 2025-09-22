// src/components/DocumentCards.tsx
import * as React from 'react';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Chip,
  IconButton,
  Typography,
  Tooltip,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useRouter } from 'next/router';
import type { ApiDocument } from '../types/document';

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function DocumentCards({ docs }: { docs: ApiDocument[] }) {
  const router = useRouter();

  if (!docs || docs.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">Keine Dokumente gefunden.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        },
      }}
    >
      {docs.map((d) => (
        <Card key={d.id} sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <CardHeader
            avatar={<DescriptionIcon />}
            title={
              <Typography variant="subtitle1" noWrap title={d.title} fontWeight={600}>
                {d.title}
              </Typography>
            }
            subheader={<Chip size="small" label={d.mime} />}
          />
          <CardContent sx={{ pt: 0 }}>
            <Typography variant="body2" color="text.secondary">
              Größe: {formatBytes(d.size)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tenant: {d.tenantId}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Erstellt: {new Date(d.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aktualisiert: {new Date(d.updatedAt).toLocaleString()}
            </Typography>
          </CardContent>
          <Box sx={{ flex: 1 }} />
          <CardActions>
            <Tooltip title="Ansehen">
              <IconButton onClick={() => router.push(`/documents/${d.id}`)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Bearbeiten">
              <IconButton onClick={() => router.push(`/documents/${d.id}/edit`)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Archivieren">
              <IconButton onClick={() => alert(`Dokument ${d.id} archiviert (Demo).`)}>
                <ArchiveIcon />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
}

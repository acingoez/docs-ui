// pages/documents/[id].tsx
import * as React from 'react';
import { useRouter } from 'next/router';
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Chip,
  TextField,
  Drawer,
  Alert,
  Autocomplete,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import IosShareOutlinedIcon from '@mui/icons-material/IosShareOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { PdfViewer } from '@/components/PdfViewer';
import { fetchJSON, API_BASE_URL } from '@/lib/api';
import { ApiDocument } from '@/types/document';


/** schlanke Metazeile ohne <p>-Nesting */
function MetaRow(props: { label: string; value: React.ReactNode }) {
  const { label, value } = props;
  return (
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
      <Typography variant="body2" component="span" sx={{ color: 'text.secondary', minWidth: 120 }}>
        {label}
      </Typography>
      <Divider flexItem orientation="vertical" sx={{ mx: 0.5, opacity: 0.2 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
        {value}
      </Box>
    </Stack>
  );
}

const formatBytes = (bytes?: number) => {
  if (!bytes && bytes !== 0) return '–';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export default function DocumentDetailPage() {
  const router = useRouter();
  const { id } = router.query as { id?: string };

  // Dokument laden (bis dedizierter GET /document/:id verfügbar ist)
  const [docs, setDocs] = React.useState<ApiDocument[] | null>(null);
  React.useEffect(() => {
    let mounted = true;
    if (id) {
      fetchJSON<ApiDocument[]>('/document/all')
        .then((res) => { if (mounted) setDocs(res); })
        .catch(() => { if (mounted) setDocs([]); });
    }
    return () => { mounted = false; };
  }, [id]);

  const doc = React.useMemo(() => docs?.find((d) => d.id === id), [docs, id]);
  const src = id ? `${API_BASE_URL}/document/stream/${id}` : '';

  /** UI-States */
  const [infoOpen, setInfoOpen] = React.useState(false);
  const [locked, setLocked] = React.useState(false);           // rein visuell
  const [lockKey, setLockKey] = React.useState<string>('');    // rein visuell
  const [shareUrl, setShareUrl] = React.useState<string>('');  // rein visuell

  /** Indexdaten (Edit) */
  const [title, setTitle] = React.useState<string>('');
  const [tags, setTags] = React.useState<string[]>([]);
  const [type, setType] = React.useState<string>('');

  React.useEffect(() => {
    if (doc) {
      setTitle(doc.title || '');
      setTags([]);           // Backend liefert noch keine Tags → leer
      setType('');           // Backend liefert noch keinen Typ → leer
    }
  }, [doc]);

  /** Aktionen (UI/Design – noch ohne Backend) */
  const handleLockToggle = () => {
    if (!locked) {
      // „Verschließen“ – Beispielhaft generieren wir einen Key, rein UI
      const generated = Math.random().toString(36).slice(2, 10).toUpperCase();
      setLockKey(generated);
    }
    setLocked((v) => !v);
  };

  const handleShareOnce = () => {
    // rein UI: temporäre URL simulieren
    const url = `${location.origin}/share/once/${id}-${Math.random().toString(36).slice(2, 8)}`;
    setShareUrl(url);
    navigator.clipboard?.writeText(url).catch(() => {});
  };

  const handleSaveIndex = () => {
    // Hier später PUT/PATCH an Ihre API (Indexdaten)
    // Beispiel: await fetchJSON(`/document/${id}`, { method:'PATCH', body: JSON.stringify({ title, tags, type }) });
    alert('Indexdaten gespeichert (Demo – API folgt).');
  };

  return (
    <Box>
      {/* Kopfbereich mit Aktionen */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', md: 'center' }}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h5" fontWeight={700} gutterBottom>
              Dokument ansehen
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID:{' '}
              <Box component="span" sx={{ fontFamily: 'mono', fontSize: '0.86em' }}>
                {id}
              </Box>
            </Typography>
          </Box>

          {/* Aktionsleiste rechts */}
          <Stack direction="row" spacing={1}>
            <Tooltip title="Info (Metadaten)">
              <Button
                variant="outlined"
                startIcon={<InfoOutlinedIcon />}
                onClick={() => setInfoOpen(true)}
              >
                Info
              </Button>
            </Tooltip>

            <Tooltip title={locked ? 'Entsperren' : 'Verschließen (mit Key) – UI-Prototyp'}>
              <Button
                variant={locked ? 'contained' : 'outlined'}
                color={locked ? 'warning' : 'inherit'}
                startIcon={<LockOutlinedIcon />}
                onClick={handleLockToggle}
              >
                {locked ? 'Verschlossen' : 'Verschließen'}
              </Button>
            </Tooltip>

            <Tooltip title="Einmal teilen – UI-Prototyp">
              <Button
                variant="outlined"
                startIcon={<IosShareOutlinedIcon />}
                onClick={handleShareOnce}
              >
                Einmal teilen
              </Button>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Hinweis-Badges (Prototyp-Zustände) */}
        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
          {locked && (
            <Chip
              size="small"
              color="warning"
              icon={<KeyOutlinedIcon />}
              label={`Verschlossen: Key ${lockKey}`}
              variant="outlined"
            />
          )}
          {shareUrl && (
            <Chip
              size="small"
              icon={<ContentCopyOutlinedIcon />}
              label="Einmal-Link kopiert"
              onClick={() => navigator.clipboard?.writeText(shareUrl)}
              variant="outlined"
            />
          )}
        </Stack>
      </Paper>

      {/* Hauptbereich: links Viewer, rechts Indexdaten */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' },
          gap: 2,
        }}
      >
        {/* Viewer */}
        <Box>
          <Paper sx={{ p: 0, overflow: 'hidden' }}>
            {id ? (
              <PdfViewer src={src} height="78vh" />
            ) : (
              <Box sx={{ p: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Keine ID angegeben.
                </Typography>
              </Box>
            )}
          </Paper>
        </Box>

        {/* Rechte Spalte: Indexdaten */}
        <Box>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              Indexdaten
            </Typography>

            {/* kleine Info für den aktuellen Stand */}
            <Alert severity="info" sx={{ mb: 2 }}>
              Diese Felder dienen der Indizierung (Suche/Kategorisierung). Weitere Indexattribute folgen.
            </Alert>

            <Stack spacing={2} sx={{ maxWidth: 520 }}>
              <TextField
                label="Titel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                size="small"
                fullWidth
              />

              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={tags}
                onChange={(_, val) => setTags(val as string[])}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip variant="outlined" label={option} size="small" {...getTagProps({ index })} key={`${option}-${index}`} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} label="Tags" placeholder="Tag hinzufügen und Enter" size="small" />
                )}
              />

              <TextField
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                size="small"
                placeholder="z. B. Rechnung, Vertrag, Beleg …"
                fullWidth
              />

              <Stack direction="row" spacing={1}>
                <Button variant="contained" onClick={handleSaveIndex}>
                  Speichern
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Box>

      {/* INFO-Drawer (Metadaten, Read-only) */}
      <Drawer
        anchor="right"
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        PaperProps={{ sx: { width: { xs: '100%', sm: 420 }, p: 2 } }}
      >
        <Typography variant="h6" fontWeight={800} gutterBottom>
          Metadaten
        </Typography>
        {!doc ? (
          <Typography variant="body2" color="text.secondary">
            Lade…
          </Typography>
        ) : (
          <Box>
            <MetaRow label="Titel" value={<Typography variant="body2" component="span">{doc.title || '–'}</Typography>} />
            <MetaRow label="MIME" value={<Chip size="small" label={doc.mime || '–'} />} />
            <MetaRow label="Größe" value={<Typography variant="body2" component="span">{formatBytes(doc.size)}</Typography>} />
            <MetaRow label="Tenant" value={<Typography variant="body2" component="span">{doc.tenantId || '–'}</Typography>} />
            <MetaRow label="Fingerprint" value={<Typography variant="body2" component="span" sx={{ fontFamily: 'mono' }}>{doc.fingerprint || '–'}</Typography>} />
            <MetaRow label="Key" value={<Typography variant="body2" component="span" sx={{ fontFamily: 'mono' }}>{doc.key || '–'}</Typography>} />
            <MetaRow label="Erstellt" value={<Typography variant="body2" component="span">{new Date(doc.createdAt).toLocaleString()}</Typography>} />
            <MetaRow label="Aktualisiert" value={<Typography variant="body2" component="span">{new Date(doc.updatedAt).toLocaleString()}</Typography>} />
            {doc.deletedAt && (
              <MetaRow label="Gelöscht" value={<Typography variant="body2" component="span">{new Date(doc.deletedAt).toLocaleString()}</Typography>} />
            )}

            <Divider sx={{ my: 2 }} />

            <Alert severity="warning">
              „Verschließen“ und „Einmal teilen“ sind derzeit reine UI-Konzepte. Die Backend-Funktionen folgen.
            </Alert>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}

// src/components/DocumentTable.tsx
import * as React from 'react';
import {
  Box,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  alpha,
  useTheme,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from '@mui/x-data-grid';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';

export type Status = 'draft' | 'in_review' | 'approved' | 'archived';

export interface DocumentRow {
  id: string;
  title: string;
  type: 'PDF' | 'DOCX' | 'XLSX' | 'PPTX' | 'TXT' | string;
  owner: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  status: Status;
  sizeKB: number;
  tags?: string[];
}

export interface DocumentTableProps {
  rows: DocumentRow[];
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onArchive: (id: string) => void;
}

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function formatSizeKB(kb: number) {
  if (kb < 1024) return `${kb} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
}

function StatusChip({ value }: { value: Status }) {
  const theme = useTheme();
  const map: Record<Status, { label: string; color: string }> = {
    draft: { label: 'Entwurf', color: theme.palette.mode === 'light' ? '#64748b' : '#94a3b8' },
    in_review: { label: 'In Prüfung', color: theme.palette.warning.main },
    approved: { label: 'Freigegeben', color: theme.palette.success.main },
    archived: { label: 'Archiviert', color: theme.palette.info.main },
  };

  const { label, color } = map[value] ?? map.draft;

  return (
    <Chip
      size="small"
      label={label}
      sx={{
        bgcolor: alpha(color, 0.12),
        color: theme.palette.getContrastText(alpha(color, 0.12)),
        border: `1px solid ${alpha(color, 0.35)}`,
        fontWeight: 600,
      }}
      variant="filled"
    />
  );
}

function Toolbar() {
  return (
    <GridToolbarContainer sx={{ px: 1, py: 0.5, gap: 1 }}>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport csvOptions={{ utf8WithBom: true, fileName: 'docuMe-documents' }} />
      <Box sx={{ flexGrow: 1 }} />
      {/* Hinweis: In manchen X-Data-Grid-Versionen besitzt GridToolbarQuickFilter kein `placeholder`-Prop */}
      <GridToolbarQuickFilter
        quickFilterParser={(value: string) =>
          value
            .split(',')
            .map(v => v.trim())
            .filter(v => v !== '')
        }
        debounceMs={300}
      />
    </GridToolbarContainer>
  );
}

export default function DocumentTable(props: DocumentTableProps) {
  const { rows, onView, onEdit, onArchive } = props;
  const theme = useTheme();

  const columns = React.useMemo<GridColDef<DocumentRow>[]>(
    () => [
      {
        field: 'title',
        headerName: 'Titel',
        flex: 1.4,
        minWidth: 240,
        renderCell: (params) => (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
            <Box
              component="span"
              aria-hidden
              sx={{
                width: 8,
                height: 8,
                borderRadius: 8,
                bgcolor:
                  params.row.status === 'approved'
                    ? theme.palette.success.main
                    : params.row.status === 'in_review'
                    ? theme.palette.warning.main
                    : params.row.status === 'archived'
                    ? theme.palette.info.main
                    : theme.palette.divider,
              }}
            />
            <Box component="span" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {params.value as string}
            </Box>
          </Stack>
        ),
      },
      {
        field: 'type',
        headerName: 'Typ',
        width: 98,
      },
      {
        field: 'owner',
        headerName: 'Owner',
        width: 160,
        renderCell: (p: GridRenderCellParams<DocumentRow, string>) => (
          <Box component="span" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {String(p.row.owner ?? '').replace('.', ' ')}
          </Box>
        ),
      },
      {
        field: 'createdAt',
        headerName: 'Erstellt',
        width: 160,
        // statt valueFormatter: direkt aus der Row lesen
        renderCell: (p: GridRenderCellParams<DocumentRow, string>) => (
          <Box component="span">{formatDate(p.row.createdAt)}</Box>
        ),
      },
      {
        field: 'updatedAt',
        headerName: 'Geändert',
        width: 160,
        renderCell: (p: GridRenderCellParams<DocumentRow, string>) => (
          <Box component="span">{formatDate(p.row.updatedAt)}</Box>
        ),
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 140,
        sortable: true,
        renderCell: (p: GridRenderCellParams<DocumentRow, Status>) => <StatusChip value={(p.value ?? p.row.status) as Status} />,
      },
      {
        field: 'sizeKB',
        headerName: 'Größe',
        width: 110,
        align: 'right',
        headerAlign: 'right',
        renderCell: (p: GridRenderCellParams<DocumentRow, number>) => (
          <Box component="span" sx={{ width: '100%', textAlign: 'right' }}>
            {formatSizeKB(p.row.sizeKB)}
          </Box>
        ),
      },
      {
        field: 'tags',
        headerName: 'Tags',
        minWidth: 160,
        flex: 1,
        sortable: false,
        renderCell: (p) => {
          const tags = Array.isArray(p.row.tags) ? p.row.tags : [];
          return (
            <Stack direction="row" spacing={0.5} sx={{ overflow: 'hidden' }}>
              {tags.slice(0, 3).map((t) => (
                <Chip key={t} size="small" label={t} variant="outlined" />
              ))}
              {tags.length > 3 && <Chip size="small" label={`+${tags.length - 3}`} />}
            </Stack>
          );
        },
      },
      {
        field: 'actions',
        headerName: 'Aktionen',
        width: 140,
        sortable: false,
        filterable: false,
        disableColumnMenu: true,
        renderCell: (p) => (
          <Stack direction="row" spacing={0.5}>
            <Tooltip title="Ansehen">
              <IconButton size="small" onClick={() => onView(p.row.id)} aria-label={`Ansehen ${p.row.id}`}>
                <VisibilityRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Bearbeiten">
              <IconButton size="small" onClick={() => onEdit(p.row.id)} aria-label={`Bearbeiten ${p.row.id}`}>
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Archivieren">
              <IconButton size="small" onClick={() => onArchive(p.row.id)} aria-label={`Archivieren ${p.row.id}`}>
                <ArchiveRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        ),
      },
    ],
    [onView, onEdit, onArchive, theme.palette],
  );

  return (
    <Box sx={{ height: 560, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        disableRowSelectionOnClick
        slots={{ toolbar: Toolbar }}
        initialState={{
          pagination: { paginationModel: { pageSize: 10, page: 0 } },
          columns: { columnVisibilityModel: { tags: true } },
        }}
        pageSizeOptions={[10, 25, 50]}
        sx={{
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            bgcolor: (t) => (t.palette.mode === 'light' ? alpha(t.palette.primary.main, 0.04) : alpha('#fff', 0.02)),
            borderBottom: (t) => `1px solid ${t.palette.divider}`,
          },
          '& .MuiDataGrid-row:hover': {
            bgcolor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'light' ? 0.03 : 0.06),
          },
        }}
      />
    </Box>
  );
}

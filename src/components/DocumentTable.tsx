// src/components/DocumentTable.tsx
import * as React from 'react';
import {
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
  GridPaginationModel,
} from '@mui/x-data-grid';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useRouter } from 'next/router';
import type { ApiDocument } from '../types/document';

function Toolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport
        csvOptions={{ fileName: 'documents' }}
        printOptions={{ disableToolbarButton: true }}
      />
      <Box sx={{ flex: 1 }} />
      {/* QuickFilter ohne placeholder (kompatibel) */}
      <GridToolbarQuickFilter debounceMs={300} />
    </GridToolbarContainer>
  );
}

const toKB = (bytes: number) => Math.round(bytes / 1024);

export function DocumentTable({ rows }: { rows: ApiDocument[] }) {
  const router = useRouter();

  const columns: GridColDef<ApiDocument>[] = [
    { field: 'title', headerName: 'Titel', flex: 1, minWidth: 240 },
    { field: 'mime', headerName: 'MIME', width: 160 },
    {
      field: 'size',
      headerName: 'Größe (KB)',
      width: 130,
      sortable: true,
      renderCell: (params) => <span>{toKB(params.row.size).toLocaleString()}</span>,
    },
    { field: 'tenantId', headerName: 'Tenant', width: 110 },
    {
      field: 'createdAt',
      headerName: 'Erstellt',
      width: 180,
      sortable: true,
      renderCell: (p) => new Date(p.row.createdAt).toLocaleString(),
    },
    {
      field: 'updatedAt',
      headerName: 'Aktualisiert',
      width: 180,
      sortable: true,
      renderCell: (p) => new Date(p.row.updatedAt).toLocaleString(),
    },
    {
      field: 'actions',
      headerName: 'Aktionen',
      width: 170,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Ansehen">
            <IconButton
              size="small"
              onClick={() => router.push(`/documents/${params.row.id}`)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Bearbeiten">
            <IconButton
              size="small"
              onClick={() => router.push(`/documents/${params.row.id}/edit`)}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Archivieren">
            <IconButton
              size="small"
              onClick={() => alert(`Dokument ${params.row.id} archiviert (Demo).`)}
            >
              <ArchiveIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];

  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });

  return (
    <Box sx={{ height: 640, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(r) => r.id}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[10, 25, 50]}
        disableRowSelectionOnClick
        autoHeight={false}
        slots={{ toolbar: Toolbar }}
        density="standard"
      />
    </Box>
  );
}

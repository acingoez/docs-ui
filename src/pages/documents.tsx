// pages/documents.tsx
import * as React from 'react';
import { Stack, Typography, Paper } from '@mui/material';
import DocumentTable, { DocumentRow } from '@/components/DocumentTable';

const initialRows: DocumentRow[] = [
  {
    id: 'DOC-2025-0001',
    title: 'Projektvertrag – Kunde ACME GmbH',
    type: 'PDF',
    owner: 'maria.schulz',
    createdAt: '2025-03-14T10:25:00Z',
    updatedAt: '2025-06-02T08:10:00Z',
    status: 'approved',
    sizeKB: 842,
    tags: ['Vertrag', 'Kunde', 'Recht'],
  },
  {
    id: 'DOC-2025-0002',
    title: 'Spezifikation Modul DMS-Core',
    type: 'DOCX',
    owner: 'ahmet.koenig',
    createdAt: '2025-02-28T15:40:00Z',
    updatedAt: '2025-05-12T12:12:00Z',
    status: 'in_review',
    sizeKB: 312,
    tags: ['Spezifikation', 'Engineering'],
  },
  {
    id: 'DOC-2025-0003',
    title: 'Onboarding-Checkliste',
    type: 'XLSX',
    owner: 'hr.team',
    createdAt: '2024-12-01T09:00:00Z',
    updatedAt: '2025-01-05T11:30:00Z',
    status: 'draft',
    sizeKB: 96,
    tags: ['HR', 'Template'],
  },
  {
    id: 'DOC-2025-0004',
    title: 'Rechnung #7842 – Q2 Wartung',
    type: 'PDF',
    owner: 'finance',
    createdAt: '2025-07-03T14:00:00Z',
    updatedAt: '2025-07-03T14:00:00Z',
    status: 'approved',
    sizeKB: 228,
    tags: ['Finanzen', 'Rechnung'],
  },
  {
    id: 'DOC-2025-0005',
    title: 'Sicherheitsrichtlinie – Zugriff & Rollen',
    type: 'PDF',
    owner: 'sec.office',
    createdAt: '2025-04-21T07:45:00Z',
    updatedAt: '2025-08-10T10:20:00Z',
    status: 'archived',
    sizeKB: 510,
    tags: ['Security', 'Policy'],
  },
];

export default function DocumentsPage() {
  const [rows, setRows] = React.useState<DocumentRow[]>(initialRows);

  const handleView = (id: string) => {
    // TODO: Routing zu einer Detailseite oder Viewer
    alert(`Ansehen: ${id}`);
  };

  const handleEdit = (id: string) => {
    // TODO: Routing zu Edit-Formular
    alert(`Bearbeiten: ${id}`);
  };

  const handleArchive = (id: string) => {
    // Beispielhafte Statusänderung
    setRows(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'archived', updatedAt: new Date().toISOString() } : r)),
    );
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h5" fontWeight={700}>Dokumente</Typography>

      <Paper variant="outlined" sx={{ p: 0, overflow: 'hidden' }}>
        <DocumentTable
          rows={rows}
          onView={handleView}
          onEdit={handleEdit}
          onArchive={handleArchive}
        />
      </Paper>
    </Stack>
  );
}

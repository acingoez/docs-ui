// src/theme.ts
import { createTheme } from '@mui/material/styles';

// 🔧 WICHTIG: Theme-Augmentation für @mui/x-data-grid aktivieren,
// damit "MuiDataGrid" in theme.components typisiert ist.
import '@mui/x-data-grid/themeAugmentation';

const brand = {
  primary: '#0b6bcb',
};

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      primary: { main: brand.primary },
      secondary: { main: '#7c69ef' },
      background: {
        default: mode === 'light' ? '#f6f8fb' : '#0b1020',
        paper: mode === 'light' ? '#ffffff' : '#0f1424',
      },
      divider: mode === 'light' ? 'rgba(2,6,23,0.08)' : 'rgba(148,163,184,0.16)',
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
      h5: { letterSpacing: 0.2 },
      button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiAppBar: {
        styleOverrides: { root: { backdropFilter: 'saturate(180%) blur(8px)' } },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: (params) => ({
            borderRadius: 10,
            margin: '2px 8px',
            '&.Mui-selected': {
              background:
                params.theme.palette.mode === 'light'
                  ? 'linear-gradient(90deg, rgba(11,107,203,0.10), rgba(11,107,203,0.03))'
                  : 'linear-gradient(90deg, rgba(144,202,249,0.18), rgba(144,202,249,0.06))',
            },
          }),
        },
      },
      // ✅ DataGrid – Typing jetzt korrekt dank themeAugmentation-Import
      MuiDataGrid: {
        styleOverrides: {
          root: {
            '--DataGrid-containerBackground': 'transparent',
            '--DataGrid-rowBorderColor': 'transparent',
            borderRadius: 0,
          },
          columnHeader: {
            fontWeight: 700,
          },
        },
      },
      MuiIconButton: { styleOverrides: { root: { borderRadius: 10 } } },
      MuiTooltip: { styleOverrides: { tooltip: { fontSize: 12, borderRadius: 8 } } },
    },
  });

// src/components/PdfViewer.tsx
import * as React from 'react';
import {
  Box,
  IconButton,
  Tooltip,
  TextField,
  Stack,
  Divider,
  Typography,
  ButtonGroup,
  Button,
  Alert,
} from '@mui/material';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import LastPageIcon from '@mui/icons-material/LastPage';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import SearchIcon from '@mui/icons-material/Search';

// Lokale Minimaltypen – keine pdfjs-dist Types importieren
type TextItem = { str: string };
type TextContent = { items: TextItem[] };
type PDFPageLike = { getTextContent(): Promise<TextContent> };
type PDFDocLike = { numPages: number; getPage(pageNumber: number): Promise<PDFPageLike> };

type PdfViewerProps = {
  src: string;                 // z. B. http://localhost:9900/document/stream/:id
  height?: number | string;    // z. B. '80vh'
  initialPage?: number;        // 1-basiert
  initialScale?: number;       // z. B. 1.0 (nur wenn nicht Fit-Width)
};

export function PdfViewer({
  src,
  height = '80vh',
  initialPage = 1,
  initialScale = 1.0,
}: PdfViewerProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = React.useState(false);

  // Lazy-Load react-pdf
  const [pdfLib, setPdfLib] = React.useState<null | typeof import('react-pdf')>(null);
  React.useEffect(() => {
    setMounted(true);
    (async () => {
      const mod = await import('react-pdf');

      // Worker: bevorzugt .mjs, sonst .js
      try {
        if (mod?.pdfjs?.GlobalWorkerOptions) {
          const prefer = '/pdf.worker.min.mjs';
          const fallback = '/pdf.worker.min.js';
          try {
            const head = await fetch(prefer, { method: 'HEAD' });
            mod.pdfjs.GlobalWorkerOptions.workerSrc = head.ok ? prefer : fallback;
          } catch {
            mod.pdfjs.GlobalWorkerOptions.workerSrc = fallback;
          }
        }
      } catch { /* noop */ }

      setPdfLib(mod);
    })();
  }, []);

  const [numPages, setNumPages] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(initialPage);
  const [scale, setScale] = React.useState<number>(initialScale);
  const [rotate, setRotate] = React.useState<number>(0);
  const [fitWidth, setFitWidth] = React.useState<boolean>(true);
  const [docProxy, setDocProxy] = React.useState<PDFDocLike | null>(null);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  // Suche (seitenweise, ohne TextLayer)
  const pageTextCache = React.useRef<Map<number, string>>(new Map());
  const [query, setQuery] = React.useState<string>('');
  const isSearchingRef = React.useRef(false);

  const minScale = 0.5;
  const maxScale = 3.0;

  const onDocumentLoadSuccess = React.useCallback((doc: unknown) => {
    const pdf = doc as PDFDocLike;
    setNumPages(pdf.numPages);
    setDocProxy(pdf);
    setLoadError(null);
  }, []);

  const onDocumentLoadError = React.useCallback((err: unknown) => {
    setLoadError(String(err));
    setNumPages(0);
    setDocProxy(null);
  }, []);

  const goTo = React.useCallback((p: number) => {
    if (numPages <= 0) return;
    if (p < 1) p = 1;
    if (p > numPages) p = numPages;
    setPage(p);
  }, [numPages]);

  const zoomIn = React.useCallback(() => setScale((s) => Math.min(maxScale, s + 0.1)), []);
  const zoomOut = React.useCallback(() => setScale((s) => Math.max(minScale, s - 0.1)), []);
  const resetZoom = React.useCallback(() => setScale(1.0), []);
  const toggleFitWidth = React.useCallback(() => setFitWidth((v) => !v), []);
  const rotateClockwise = React.useCallback(() => setRotate((r) => ((r + 90) % 360)), []);

  // Containerbreite für Fit-Width
  const [containerWidth, setContainerWidth] = React.useState<number>(0);
  React.useEffect(() => {
    const handler = () => {
      if (containerRef.current) setContainerWidth(containerRef.current.clientWidth);
    };
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Tastaturkürzel
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '+' || e.key === '=') { e.preventDefault(); zoomIn(); }
        else if (e.key === '-')             { e.preventDefault(); zoomOut(); }
      } else {
        if (e.key === 'ArrowLeft')  { e.preventDefault(); goTo(page - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); goTo(page + 1); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [goTo, page, zoomIn, zoomOut]);

  // Text gecacht holen
  const getPageText = React.useCallback(async (p: number): Promise<string> => {
    const cached = pageTextCache.current.get(p);
    if (cached) return cached;
    if (!docProxy) return '';
    const pdfPage = await docProxy.getPage(p);
    const content = await pdfPage.getTextContent();
    const text = content.items.map((it) => it.str).join(' ');
    pageTextCache.current.set(p, text);
    return text;
  }, [docProxy]);

  // Suche: zur nächsten Fundstelle springen
  const findNext = React.useCallback(async () => {
    if (!docProxy || !query?.trim() || numPages <= 0) return;
    if (isSearchingRef.current) return;
    isSearchingRef.current = true;
    try {
      const q = query.trim().toLowerCase();
      for (let offset = 0; offset < numPages; offset++) {
        const p = ((page - 1 + offset) % numPages) + 1;
        const text = (await getPageText(p)).toLowerCase();
        if (text.includes(q)) { goTo(p); break; }
      }
    } finally {
      isSearchingRef.current = false;
    }
  }, [docProxy, query, numPages, page, goTo, getPageText]);

  const openInNewTab = React.useCallback(() => {
    window.open(src, '_blank', 'noopener,noreferrer');
  }, [src]);

  const download = React.useCallback(() => {
    const a = document.createElement('a');
    a.href = src;
    a.download = 'document.pdf';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [src]);

  const print = React.useCallback(() => {
    openInNewTab();
  }, [openInNewTab]);

  // WICHTIG: Optionen als stabilen Hook VOR jedem Early-Return deklarieren
  const docOptions = React.useMemo(() => ({
    standardFontDataUrl: undefined,
    cMapUrl: undefined,
    cMapPacked: true,
  }), []);

  if (!mounted || !pdfLib) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">PDF Viewer lädt…</Typography>
      </Box>
    );
  }

  const { Document, Page } = pdfLib;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', borderRadius: 2, overflow: 'hidden', bgcolor: 'background.paper' }}>
      {/* Toolbar */}
      <Box sx={{ p: 1.5, borderBottom: (t) => `1px solid ${t.palette.divider}`, bgcolor: 'background.paper' }}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title="Erste Seite"><span><IconButton size="small" onClick={() => goTo(1)} disabled={page <= 1}><FirstPageIcon /></IconButton></span></Tooltip>
            <Tooltip title="Zurück"><span><IconButton size="small" onClick={() => goTo(page - 1)} disabled={page <= 1}><NavigateBeforeIcon /></IconButton></span></Tooltip>
            <TextField
              size="small"
              value={page}
              onChange={(e) => {
                const v = parseInt(e.target.value.replace(/\D/g, ''), 10);
                if (!isNaN(v)) setPage(Math.max(1, Math.min(v, numPages || 1)));
                else if (e.target.value === '') setPage(1);
              }}
              inputProps={{ inputMode: 'numeric', style: { width: 56, textAlign: 'center' } }}
            />
            <Typography variant="body2" color="text.secondary">/ {numPages || '-'}</Typography>
            <Tooltip title="Weiter"><span><IconButton size="small" onClick={() => goTo(page + 1)} disabled={page >= numPages}><NavigateNextIcon /></IconButton></span></Tooltip>
            <Tooltip title="Letzte Seite"><span><IconButton size="small" onClick={() => goTo(numPages)} disabled={page >= numPages}><LastPageIcon /></IconButton></span></Tooltip>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title="Hineinzoomen"><IconButton size="small" onClick={zoomIn}><ZoomInIcon /></IconButton></Tooltip>
            <Tooltip title="Herauszoomen"><IconButton size="small" onClick={zoomOut}><ZoomOutIcon /></IconButton></Tooltip>
            <Tooltip title="Zoom zurücksetzen"><IconButton size="small" onClick={resetZoom}><RestartAltIcon /></IconButton></Tooltip>
            <Divider flexItem orientation="vertical" />
            <Tooltip title={fitWidth ? 'Originalgröße' : 'An Breite anpassen'}><IconButton size="small" onClick={toggleFitWidth}><FitScreenIcon /></IconButton></Tooltip>
            <Tooltip title="Drehen (90°)"><IconButton size="small" onClick={rotateClockwise}><Rotate90DegreesCcwIcon /></IconButton></Tooltip>
          </Stack>

          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ minWidth: 280 }}>
            <TextField
              size="small"
              placeholder="Suchen…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              InputProps={{
                endAdornment: (
                  <ButtonGroup size="small" variant="text">
                    <Button onClick={findNext} startIcon={<SearchIcon />}>Finden</Button>
                  </ButtonGroup>
                ),
              }}
              sx={{ flex: 1 }}
            />
            <Tooltip title="Öffnen in neuem Tab"><IconButton size="small" onClick={openInNewTab}><OpenInNewIcon /></IconButton></Tooltip>
            <Tooltip title="Download"><IconButton size="small" onClick={download}><DownloadIcon /></IconButton></Tooltip>
            <Tooltip title="Drucken"><IconButton size="small" onClick={print}><PrintIcon /></IconButton></Tooltip>
          </Stack>
        </Stack>
      </Box>

      {/* Canvas-Bereich */}
      <Box ref={containerRef} sx={{ height, overflow: 'auto', bgcolor: 'background.default', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <Box sx={{ p: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Document
            file={src}
            loading={<Typography variant="body2" color="text.secondary">PDF wird geladen…</Typography>}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            options={docOptions}
          >
            <Page
              pageNumber={page}
              renderAnnotationLayer
              // Deaktiviert: vermeidet TextLayer-Streams & Hydration-Warnungen
              renderTextLayer={false}
              width={fitWidth && containerWidth ? Math.floor(Math.min(containerWidth - 32, 1600)) : undefined}
              scale={!fitWidth ? scale : undefined}
              rotate={rotate}
              loading={<Typography variant="body2" color="text.secondary">Seite wird gerendert…</Typography>}
            />
          </Document>
        </Box>
      </Box>

      {loadError && (
        <Box sx={{ p: 1.5 }}>
          <Alert severity="error">PDF konnte nicht geladen werden: {loadError}</Alert>
        </Box>
      )}
    </Box>
  );
}

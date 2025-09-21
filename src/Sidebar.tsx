// src/Sidebar.tsx
import * as React from 'react';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  useMediaQuery,
  Theme,
  Tooltip,
} from '@mui/material';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ArchiveRoundedIcon from '@mui/icons-material/ArchiveRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import { useRouter } from 'next/router';

const TOP = [
  { href: '/', label: 'Home', icon: <HomeRoundedIcon /> },
  { href: '/documents', label: 'Documents', icon: <DescriptionRoundedIcon /> },
  { href: '/archiv', label: 'Archiv', icon: <ArchiveRoundedIcon /> },
];

const BOTTOM = [
  { href: '/settings', label: 'Settings', icon: <SettingsRoundedIcon /> },
  { href: '/user', label: 'User', icon: <AccountCircleRoundedIcon /> },
];

export interface SidebarProps {
  width?: number;
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ width = 272, open, onClose }: SidebarProps) {
  const isDesktop = useMediaQuery((t: Theme) => t.breakpoints.up('md'));
  const router = useRouter();

  const isActive = (href: string) =>
    href === '/' ? router.pathname === '/' : router.pathname.startsWith(href);

  const navigate = (href: string) => {
    router.push(href);
    if (!isDesktop) onClose();
  };

  const content = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} role="navigation">
      {/* Platzhalter für AppBar-Höhe */}
      <Toolbar />

      {/* KEIN Branding mehr in der Sidebar */}
      <List sx={{ px: 0.5 }}>
        {TOP.map((item) => (
          <Tooltip key={item.href} title={item.label} placement="right" disableInteractive>
            <ListItemButton
              selected={isActive(item.href)}
              aria-current={isActive(item.href) ? 'page' : undefined}
              onClick={() => navigate(item.href)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Divider />

      <List sx={{ px: 0.5, pb: 1 }}>
        {BOTTOM.map((item) => (
          <Tooltip key={item.href} title={item.label} placement="right" disableInteractive>
            <ListItemButton
              selected={isActive(item.href)}
              aria-current={isActive(item.href) ? 'page' : undefined}
              onClick={() => navigate(item.href)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </Tooltip>
        ))}
      </List>
    </Box>
  );

  if (isDesktop) {
    return (
      <Drawer variant="permanent" open PaperProps={{ sx: { width, borderRight: 0 } }}>
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{ sx: { width } }}
    >
      {content}
    </Drawer>
  );
}

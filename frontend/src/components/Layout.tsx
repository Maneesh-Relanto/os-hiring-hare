import { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon as MenuItemIcon,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Description,
  People,
  Assessment,
  Settings,
  Notifications,
  AccountCircle,
  Logout,
  PendingActions,
  SupervisorAccount,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const drawerWidth = 80;

interface LayoutProps {
  children: React.ReactNode;
}

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path: string;
  roles?: string[]; // If specified, only users with these roles can see this item
}

const menuItems: MenuItem[] = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { 
    text: 'Requirements', 
    icon: <Description />, 
    path: '/requirements',
    roles: ['admin', 'hiring_manager', 'approver', 'recruiter', 'viewer']
  },
  { 
    text: 'Pending Approvals', 
    icon: <PendingActions />, 
    path: '/approvals',
    roles: ['admin', 'approver']
  },
  { 
    text: 'Candidates', 
    icon: <People />, 
    path: '/candidates',
    roles: ['admin', 'recruiter', 'interviewer', 'viewer']
  },
  { 
    text: 'Reports', 
    icon: <Assessment />, 
    path: '/reports'
  },
  { 
    text: 'Users', 
    icon: <SupervisorAccount />, 
    path: '/users',
    roles: ['admin']
  },
  { 
    text: 'Settings', 
    icon: <Settings />, 
    path: '/settings',
    roles: ['admin']
  },
];

const Layout = ({ children }: LayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, clearAuth, hasAnyRole } = useAuthStore();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    clearAuth();
    handleMenuClose();
    navigate('/login');
  };

  const drawer = (
    <Box
      sx={{
        height: '100%',
        background: 'linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)',
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 18,
            color: 'white',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          }}
        >
          HH
        </Box>
      </Box>

      <Divider sx={{ opacity: 0.1 }} />

      {/* Navigation */}
      <List sx={{ px: 0.5, py: 1 }}>
        {menuItems.map((item) => {
          // Check if user has required role for this menu item
          if (item.roles && !hasAnyRole(item.roles)) {
            return null;
          }
          
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 1.5,
                  py: 1,
                  px: 0.5,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 64,
                  backgroundColor: isActive
                    ? 'rgba(99, 102, 241, 0.1)'
                    : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'primary.main' : 'transparent',
                  '&:hover': {
                    backgroundColor: isActive
                      ? 'rgba(99, 102, 241, 0.15)'
                      : 'rgba(99, 102, 241, 0.05)',
                    borderColor: isActive ? 'primary.main' : 'rgba(99, 102, 241, 0.2)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Box
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 0.5,
                    '& svg': {
                      fontSize: '1.5rem',
                    },
                  }}
                >
                  {item.icon}
                </Box>
                <Typography
                  sx={{
                    fontWeight: isActive ? 600 : 500,
                    fontSize: '0.65rem',
                    color: isActive ? 'primary.main' : 'text.primary',
                    textAlign: 'center',
                    lineHeight: 1.2,
                  }}
                >
                  {item.text}
                </Typography>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'none',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', ml: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: '1.1rem',
                background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Hiring Hare
            </Typography>
          </Box>

          <IconButton sx={{ color: 'text.primary' }}>
            <Notifications />
          </IconButton>
          
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              ml: 2,
              px: 2,
              py: 0.75,
              borderRadius: 2,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                background: 'rgba(99, 102, 241, 0.05)',
              },
            }}
            onClick={handleMenuOpen}
          >
            <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem', lineHeight: 1.2 }}>
                {user ? `${user.first_name} ${user.last_name}` : 'User'}
              </Typography>
              {user && user.roles.length > 0 && (
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  {user.roles[0].display_name}
                </Typography>
              )}
            </Box>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                fontWeight: 700,
                fontSize: '0.95rem',
              }}
            >
              {user?.first_name?.[0] || 'U'}
            </Avatar>
          </Box>
        </Toolbar>
      </AppBar>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 240,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0, 0, 0, 0.08)' }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {user ? `${user.first_name} ${user.last_name}` : 'User'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.email || 'email@example.com'}
          </Typography>
          {user && user.roles.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
              {user.roles.map((role) => (
                <Chip
                  key={role.id}
                  label={role.display_name}
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.65rem',
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    color: 'primary.main',
                    fontWeight: 600,
                  }}
                />
              ))}
            </Box>
          )}
        </Box>
        {hasAnyRole(['admin']) && (
          <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>
            <MenuItemIcon>
              <Settings fontSize="small" />
            </MenuItemIcon>
            Settings
          </MenuItem>
        )}
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
          <MenuItemIcon>
            <Logout fontSize="small" sx={{ color: 'error.main' }} />
          </MenuItemIcon>
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
          },
        }}
        open
      >
        {drawer}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

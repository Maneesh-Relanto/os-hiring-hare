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
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const drawerWidth = 260;

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
          p: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: 22,
            color: 'white',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          }}
        >
          HH
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Hiring Hare
        </Typography>
      </Box>

      <Divider sx={{ opacity: 0.1 }} />

      {/* Navigation */}
      <List sx={{ px: 2, py: 2 }}>
        {menuItems.map((item) => {
          // Check if user has required role for this menu item
          if (item.roles && !hasAnyRole(item.roles)) {
            return null;
          }
          
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => navigate(item.path)}
                sx={{
                  borderRadius: 2,
                  py: 1.5,
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
                <ListItemIcon
                  sx={{
                    color: isActive ? 'primary.main' : 'text.secondary',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? 'primary.main' : 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      {/* User Profile */}
      <Box
        sx={{
          p: 2.5,
          m: 2,
          borderRadius: 3,
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)',
          border: '1px solid',
          borderColor: 'divider',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(236, 72, 153, 0.12) 100%)',
            borderColor: 'primary.main',
            transform: 'translateY(-2px)',
          },
        }}
        onClick={handleMenuOpen}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
              fontWeight: 700,
              fontSize: '1.1rem',
            }}
          >
            {user?.first_name?.[0] || 'U'}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {user ? `${user.first_name} ${user.last_name}` : 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email || 'email@example.com'}
            </Typography>
          </Box>
        </Box>
        {user && user.roles.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
            {user.roles.slice(0, 2).map((role) => (
              <Chip
                key={role.id}
                label={role.display_name}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  backgroundColor: 'white',
                  color: 'primary.main',
                  fontWeight: 700,
                  border: '1px solid',
                  borderColor: 'primary.main',
                }}
              />
            ))}
            {user.roles.length > 2 && (
              <Chip
                label={`+${user.roles.length - 2}`}
                size="small"
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  backgroundColor: 'white',
                  color: 'primary.main',
                  fontWeight: 700,
                  border: '1px solid',
                  borderColor: 'primary.main',
                }}
              />
            )}
          </Box>
        )}
      </Box>
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

          <Box sx={{ flexGrow: 1 }} />

          <IconButton sx={{ color: 'text.primary' }}>
            <Notifications />
          </IconButton>
          <IconButton sx={{ color: 'text.primary' }} onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
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

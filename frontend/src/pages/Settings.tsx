import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Button,
  IconButton,
  Alert,
  Snackbar,
} from '@mui/material';
import { People, Badge, Security, Edit, Save, Close, Check } from '@mui/icons-material';
import api from '../api/api';

interface Role {
  id: string;
  name: string;
  display_name: string;
  description: string;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  roles: Role[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Settings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Permissions matrix state
  const [editMode, setEditMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  
  // Original permissions data
  const initialPermissions = [
    { feature: 'View Dashboard', permissions: [true, true, true, true, true, true] },
    { feature: 'View Requirements', permissions: [true, true, true, true, false, true] },
    { feature: 'Create Requirements', permissions: [true, true, false, false, false, false] },
    { feature: 'Edit Requirements', permissions: [true, true, false, false, false, false] },
    { feature: 'Delete Requirements', permissions: [true, false, false, false, false, false] },
    { feature: 'Approve Requirements', permissions: [true, false, true, false, false, false] },
    { feature: 'View Candidates', permissions: [true, false, false, true, true, true] },
    { feature: 'Add Candidates', permissions: [true, false, false, true, false, false] },
    { feature: 'Edit Candidates', permissions: [true, false, false, true, false, false] },
    { feature: 'Delete Candidates', permissions: [true, false, false, true, false, false] },
    { feature: 'Schedule Interviews', permissions: [true, true, false, true, true, false] },
    { feature: 'Conduct Interviews', permissions: [true, false, false, false, true, false] },
    { feature: 'Submit Feedback', permissions: [true, true, true, true, true, false] },
    { feature: 'View Reports', permissions: [true, true, true, false, false, true] },
    { feature: 'Export Data', permissions: [true, true, false, false, false, false] },
    { feature: 'Manage Users', permissions: [true, false, false, false, false, false] },
    { feature: 'Manage Roles', permissions: [true, false, false, false, false, false] },
    { feature: 'System Settings', permissions: [true, false, false, false, false, false] },
  ];
  
  const [permissions, setPermissions] = useState(initialPermissions);
  const [originalPermissions, setOriginalPermissions] = useState(initialPermissions);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch users - we'll need to create this endpoint
      // For now, we'll show a placeholder
      setUsers([]);
      setRoles([]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePermission = (featureIndex: number, roleIndex: number) => {
    if (!editMode) return;
    
    const newPermissions = permissions.map((perm, idx) => {
      if (idx === featureIndex) {
        const newPerms = [...perm.permissions];
        newPerms[roleIndex] = !newPerms[roleIndex];
        return { ...perm, permissions: newPerms };
      }
      return perm;
    });
    
    setPermissions(newPermissions);
    setHasChanges(true);
  };

  const handleEnterEditMode = () => {
    setOriginalPermissions(JSON.parse(JSON.stringify(permissions)));
    setEditMode(true);
  };

  const handleSaveChanges = async () => {
    try {
      // TODO: API call to save permissions
      // await api.post('/api/v1/permissions/update', permissions);
      
      setOriginalPermissions(permissions);
      setEditMode(false);
      setHasChanges(false);
      setSnackbar({ open: true, message: 'Permissions saved successfully!', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to save permissions', severity: 'error' });
    }
  };

  const handleCancelEdit = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        setPermissions(originalPermissions);
        setEditMode(false);
        setHasChanges(false);
      }
    } else {
      setEditMode(false);
    }
  };

  const isPermissionChanged = (featureIndex: number, roleIndex: number) => {
    return permissions[featureIndex].permissions[roleIndex] !== originalPermissions[featureIndex].permissions[roleIndex];
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        <Typography variant="h3" sx={{ mb: 1, fontWeight: 800, color: 'text.primary' }}>
          Settings
        </Typography>
        <Typography variant="h6" color="text.secondary" fontWeight={500} sx={{ mb: 4 }}>
          Manage users, roles, and system configuration
        </Typography>

        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              px: 2,
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '0.95rem',
                textTransform: 'none',
              },
            }}
          >
            <Tab icon={<People />} label="Users" iconPosition="start" />
            <Tab icon={<Badge />} label="Roles" iconPosition="start" />
            <Tab icon={<Security />} label="Permissions Matrix" iconPosition="start" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                User Management
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
                Total Users: <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>{users.length}</Box>
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Roles</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                            User management endpoint not yet implemented.
                            <br />
                            Available test users: admin@hiringhare.com, manager@hiringhare.com, 
                            recruiter@hiringhare.com, approver@hiringhare.com, 
                            interviewer@hiringhare.com, viewer@hiringhare.com
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            {user.first_name} {user.last_name}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {user.roles.map((role) => (
                                <Chip
                                  key={role.id}
                                  label={role.display_name}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                />
                              ))}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={user.is_active ? 'Active' : 'Inactive'}
                              size="small"
                              color={user.is_active ? 'success' : 'default'}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                Role Management
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
                Total Roles: <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>7 (System Roles)</Box>
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Role Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Display Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem' }}>Type</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { name: 'super_admin', display_name: 'Super Administrator', description: 'Full system access with all permissions', is_system: true },
                      { name: 'admin', display_name: 'Administrator', description: 'Administrative access to manage system and users', is_system: true },
                      { name: 'hiring_manager', display_name: 'Hiring Manager', description: 'Creates and manages job requirements', is_system: true },
                      { name: 'approver', display_name: 'Approver', description: 'Approves or rejects job requirements', is_system: true },
                      { name: 'recruiter', display_name: 'Recruiter', description: 'Manages candidates and recruitment process', is_system: true },
                      { name: 'interviewer', display_name: 'Interviewer', description: 'Conducts interviews and provides feedback', is_system: true },
                      { name: 'viewer', display_name: 'Viewer', description: 'Read-only access to view requirements and candidates', is_system: true },
                    ].map((role) => (
                      <TableRow key={role.name}>
                        <TableCell>
                          <Typography variant="body2" fontFamily="monospace">
                            {role.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {role.display_name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {role.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={role.is_system ? 'System' : 'Custom'}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                Role Permissions Matrix
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {editMode ? 'Click on permissions to toggle access. Click Save to apply changes.' : 'Overview of all roles and their access to system features'}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {!editMode ? (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={handleEnterEditMode}
                  sx={{
                    background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5558E3 0%, #DB2777 100%)',
                    },
                  }}
                >
                  Edit Permissions
                </Button>
              ) : (
                <>
                  <Button
                    variant="outlined"
                    startIcon={<Close />}
                    onClick={handleCancelEdit}
                    sx={{ fontWeight: 600 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleSaveChanges}
                    disabled={!hasChanges}
                    sx={{
                      background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      },
                      '&:disabled': {
                        background: 'grey.300',
                      },
                    }}
                  >
                    Save Changes
                  </Button>
                </>
              )}
            </Box>
          </Box>

          {hasChanges && editMode && (
            <Alert severity="warning" sx={{ mb: 3, fontWeight: 600 }}>
              You have unsaved changes. Click "Save Changes" to apply or "Cancel" to discard.
            </Alert>
          )}
          
          <TableContainer sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'auto' }}>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell 
                    sx={{ 
                      fontWeight: 700, 
                      fontSize: '0.875rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      position: 'sticky',
                      left: 0,
                      bgcolor: 'grey.50',
                      zIndex: 1,
                      minWidth: 220,
                    }}
                  >
                    Feature / Permission
                  </TableCell>
                  {['Admin', 'Hiring Manager', 'Approver', 'Recruiter', 'Interviewer', 'Viewer'].map((role) => (
                    <TableCell 
                      key={role}
                      align="center"
                      sx={{ 
                        fontWeight: 700, 
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        minWidth: 120,
                      }}
                    >
                      {role}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {permissions.map((row, featureIndex) => (
                  <TableRow 
                    key={row.feature}
                    sx={{ 
                      '&:hover': { bgcolor: editMode ? 'rgba(99, 102, 241, 0.04)' : 'rgba(0, 0, 0, 0.02)' },
                      bgcolor: featureIndex % 2 === 0 ? 'transparent' : 'rgba(0, 0, 0, 0.02)',
                    }}
                  >
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        position: 'sticky',
                        left: 0,
                        bgcolor: featureIndex % 2 === 0 ? 'background.paper' : 'rgba(0, 0, 0, 0.02)',
                        borderRight: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      {row.feature}
                    </TableCell>
                    {row.permissions.map((hasPermission, roleIndex) => {
                      const isChanged = isPermissionChanged(featureIndex, roleIndex);
                      
                      return (
                        <TableCell key={roleIndex} align="center">
                          {editMode ? (
                            <IconButton
                              onClick={() => handleTogglePermission(featureIndex, roleIndex)}
                              sx={{
                                width: 36,
                                height: 36,
                                bgcolor: hasPermission ? 'success.main' : 'grey.200',
                                color: hasPermission ? 'white' : 'grey.500',
                                border: isChanged ? '3px solid' : '1px solid',
                                borderColor: isChanged ? 'warning.main' : 'transparent',
                                boxShadow: isChanged ? '0 0 0 3px rgba(251, 191, 36, 0.2)' : 'none',
                                '&:hover': {
                                  bgcolor: hasPermission ? 'success.dark' : 'grey.300',
                                  transform: 'scale(1.1)',
                                },
                                transition: 'all 0.2s ease',
                              }}
                            >
                              <Check sx={{ fontSize: 18, fontWeight: 700 }} />
                            </IconButton>
                          ) : (
                            <Chip 
                              label={hasPermission ? '✓' : '✗'}
                              size="small" 
                              sx={{ 
                                bgcolor: hasPermission ? 'success.main' : 'grey.200',
                                color: hasPermission ? 'white' : 'grey.500',
                                fontWeight: 700,
                                fontSize: '1rem',
                                width: 32,
                                height: 32,
                                '& .MuiChip-label': {
                                  px: 0,
                                },
                              }}
                            />
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
        </Paper>

        <Paper elevation={0} sx={{ mt: 3, p: 4, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          Test User Credentials
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 2.5 }}>
          {[
            { email: 'admin@hiringhare.com', password: 'Admin@2024', role: 'Administrator' },
            { email: 'manager@hiringhare.com', password: 'Manager@2024', role: 'Hiring Manager' },
            { email: 'approver@hiringhare.com', password: 'Approver@2024', role: 'Approver + Hiring Manager' },
            { email: 'recruiter@hiringhare.com', password: 'Recruiter@2024', role: 'Recruiter' },
            { email: 'interviewer@hiringhare.com', password: 'Interviewer@2024', role: 'Interviewer' },
            { email: 'viewer@hiringhare.com', password: 'Viewer@2024', role: 'Viewer' },
          ].map((user) => (
            <Box
              key={user.email}
              sx={{
                p: 2.5,
                border: 2,
                borderColor: 'divider',
                borderRadius: 2.5,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.03) 0%, rgba(236, 72, 153, 0.03) 100%)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(99, 102, 241, 0.15)',
                },
              }}
            >
              <Typography variant="body1" fontWeight={700} color="primary.main" sx={{ mb: 1.5 }}>
                {user.role}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 600 }}>
                📧 {user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={600}>
                🔑 {user.password}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%', fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      </Container>
    </Box>
  );
};

export default Settings;

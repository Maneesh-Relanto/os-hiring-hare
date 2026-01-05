import { useState, useEffect } from 'react';
import {
  Box,
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
} from '@mui/material';
import { People, Badge } from '@mui/icons-material';
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

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Settings
      </Typography>

      <Paper sx={{ borderRadius: 2 }}>
        <Tabs
          value={tabValue}
          onChange={(_, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<People />} label="Users" iconPosition="start" />
          <Tab icon={<Badge />} label="Roles" iconPosition="start" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>
                User Management
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total Users: {users.length}
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
              <Typography variant="h6" sx={{ mb: 2 }}>
                Role Management
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Total Roles: 7 (System Roles)
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Role Name</TableCell>
                      <TableCell>Display Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Type</TableCell>
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
      </Paper>

      <Paper sx={{ mt: 3, p: 3, borderRadius: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Test User Credentials
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
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
                p: 2,
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                backgroundColor: 'rgba(168, 85, 247, 0.03)',
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                {user.role}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                📧 {user.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                🔑 {user.password}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
};

export default Settings;

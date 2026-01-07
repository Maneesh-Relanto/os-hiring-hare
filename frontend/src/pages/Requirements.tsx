import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Pagination,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add,
  Search,
  FilterList,
  Edit,
  Delete,
  MoreVert,
} from '@mui/icons-material';
import { requirementsApi, RequirementCreate } from '../services/requirementsApi';
import RequirementForm from '../components/RequirementForm';

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case 'draft':
      return 'default';
    case 'pending_approval':
    case 'submitted':
      return 'warning';
    case 'approved':
      return 'info';
    case 'active':
    case 'filled':
      return 'success';
    case 'cancelled':
    case 'rejected':
      return 'error';
    default:
      return 'default';
  }
};

const getPriorityColor = (priority: string) => {
  const priorityLower = priority.toLowerCase();
  switch (priorityLower) {
    case 'urgent':
      return 'error';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'default';
    default:
      return 'default';
  }
};

const formatEnumValue = (value: string) => {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const Requirements = () => {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReq, setSelectedReq] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReq, setEditingReq] = useState<any>(null);
  const pageSize = 10;

  // Fetch requirements with React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ['requirements', page, statusFilter, searchQuery],
    queryFn: () =>
      requirementsApi.list({
        skip: (page - 1) * pageSize,
        limit: pageSize,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        search: searchQuery || undefined,
      }),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: requirementsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      setOpenDialog(false);
      setEditingReq(null);
      alert('Requirement created successfully!');
    },
    onError: (error: any) => {
      console.error('Create requirement error:', error);
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to create requirement';
      alert(`Error: ${errorMessage}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<RequirementCreate> }) =>
      requirementsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      setOpenDialog(false);
      setEditingReq(null);
      alert('Requirement updated successfully!');
    },
    onError: (error: any) => {
      console.error('Update requirement error:', error);
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to update requirement';
      alert(`Error: ${errorMessage}`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: requirementsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      handleMenuClose();
    },
  });

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedReq(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedReq(null);
  };

  const handleEdit = () => {
    const req = data?.items.find((r) => r.id === selectedReq);
    if (req) {
      setEditingReq(req);
      setOpenDialog(true);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (selectedReq && window.confirm('Are you sure you want to delete this requirement?')) {
      deleteMutation.mutate(selectedReq);
    }
  };

  const handleFormSubmit = (formData: RequirementCreate) => {
    console.log('handleFormSubmit called with:', formData);
    if (editingReq) {
      console.log('Updating requirement:', editingReq.id);
      updateMutation.mutate({ id: editingReq.id, data: formData });
    } else {
      console.log('Creating new requirement');
      createMutation.mutate(formData);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReq(null);
  };

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 1,
                letterSpacing: '-0.02em',
              }}
            >
              Requirements
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
              Manage recruitment requirements and job positions
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
            size="large"
            sx={{
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
              px: 3,
              py: 1.5,
              fontWeight: 600,
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5558E3 0%, #DB2777 100%)',
                boxShadow: '0 12px 28px rgba(99, 102, 241, 0.45)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            New Requirement
          </Button>
        </Box>

        {/* Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            background: 'background.paper',
          }}
        >
          <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by title or requirement number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="pending_approval">Pending Approval</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="filled">Filled</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              sx={{ height: '56px' }}
            >
              More Filters
            </Button>
          </Grid>
        </Grid>
        </Paper>

        {/* Loading State */}
        {isLoading && (
          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 12 
            }}
          >
            <CircularProgress 
              size={60} 
              thickness={4}
              sx={{
                color: 'primary.main',
                mb: 3,
              }}
            />
            <Typography variant="h6" color="text.secondary" fontWeight={600}>
              Loading requirements...
            </Typography>
          </Box>
        )}

        {/* Error State */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              '& .MuiAlert-message': {
                fontSize: '1rem',
                fontWeight: 500,
              }
            }}
          >
            Failed to load requirements. Please try again.
          </Alert>
        )}

        {/* Requirements Table */}
        {!isLoading && !error && (
          <>
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                mb: 3,
                overflow: 'hidden',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Req. Number</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Position</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Priority</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
              <TableBody>
                {data?.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">
                        No requirements found. Create your first requirement to get started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.items.map((req) => (
                    <TableRow
                      key={req.id}
                      sx={{
                        '&:hover': {
                          bgcolor: 'rgba(99, 102, 241, 0.04)',
                          transform: 'scale(1.001)',
                        },
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                      }}
                    >
                      <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>{req.requirement_number}</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{req.position_title}</TableCell>
                      <TableCell>
                        <Chip
                          label={formatEnumValue(req.priority)}
                          size="small"
                          color={getPriorityColor(req.priority)}
                          sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatEnumValue(req.status)}
                          size="small"
                          color={getStatusColor(req.status)}
                          sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell>{new Date(req.created_at).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, req.id)}>
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {data && data.total_pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={data.total_pages}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <Edit fontSize="small" sx={{ mr: 1 }} />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* Create/Edit Requirement Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingReq ? 'Edit Requirement' : 'Create New Requirement'}
        </DialogTitle>
        <DialogContent>
          <RequirementForm
            initialData={editingReq}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseDialog}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>
      </Container>
    </Box>
  );
};

export default Requirements;

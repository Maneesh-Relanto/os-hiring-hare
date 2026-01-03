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
    if (editingReq) {
      updateMutation.mutate({ id: editingReq.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingReq(null);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 1,
            }}
          >
            Requirements
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage recruitment requirements and job positions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
          sx={{
            background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #9333EA 0%, #DB2777 100%)',
            },
          }}
        >
          New Requirement
        </Button>
      </Box>

      {/* Filters */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 3,
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
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load requirements. Please try again.
        </Alert>
      )}

      {/* Requirements Table */}
      {!isLoading && !error && (
        <>
          <TableContainer
            component={Paper}
            sx={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 3,
              mb: 3,
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Req. Number</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Position</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 600 }} align="center">
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
                          backgroundColor: 'rgba(168, 85, 247, 0.05)',
                        },
                      }}
                    >
                      <TableCell>{req.requirement_number}</TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{req.position_title}</TableCell>
                      <TableCell>
                        <Chip
                          label={formatEnumValue(req.priority)}
                          size="small"
                          color={getPriorityColor(req.priority)}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={formatEnumValue(req.status)}
                          size="small"
                          color={getStatusColor(req.status)}
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
  );
};

export default Requirements;

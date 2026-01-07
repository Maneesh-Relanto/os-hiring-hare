import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
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
  DialogActions,
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
import { usersApi } from '../services/usersApi';
import RequirementForm from '../components/RequirementForm';
import { useNotification } from '../contexts/NotificationContext';
import { useAuthStore } from '../store/authStore';

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
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedReq, setSelectedReq] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingReq, setEditingReq] = useState<any>(null);
  
  // Dialog states
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [recruiterDialogOpen, setRecruiterDialogOpen] = useState(false);
  const [activationDialogOpen, setActivationDialogOpen] = useState(false);
  const [approvalComments, setApprovalComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedRecruiterId, setSelectedRecruiterId] = useState('');
  
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

  // Fetch recruiters (users with recruiter role)
  const { data: recruiters } = useQuery({
    queryKey: ['recruiters'],
    queryFn: () => usersApi.getByRole('recruiter'),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: requirementsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      setOpenDialog(false);
      setEditingReq(null);
      showNotification('Requirement created successfully!', 'success');
    },
    onError: (error: any) => {
      console.error('Create requirement error:', error);
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to create requirement';
      showNotification(errorMessage, 'error');
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
      showNotification('Requirement updated successfully!', 'success');
    },
    onError: (error: any) => {
      console.error('Update requirement error:', error);
      const errorMessage = error?.response?.data?.detail || error?.message || 'Failed to update requirement';
      showNotification(errorMessage, 'error');
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

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: requirementsApi.submit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      showNotification('Requirement submitted for approval!', 'success');
    },
    onError: (error: any) => {
      console.error('Submit error:', error);
      let errorMessage = 'Failed to submit requirement';
      if (error?.response?.data?.detail) {
        const detail = error.response.data.detail;
        // Handle both string and array of error objects
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      showNotification(errorMessage, 'error');
    },
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: ({ id, comments }: { id: string; comments?: string }) =>
      requirementsApi.approve(id, comments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      showNotification('Requirement approved!', 'success');
    },
    onError: (error: any) => {
      console.error('Approve error:', error);
      let errorMessage = 'Failed to approve requirement';
      if (error?.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      showNotification(errorMessage, 'error');
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, comments }: { id: string; comments: string }) =>
      requirementsApi.reject(id, comments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      showNotification('Requirement rejected', 'warning');
    },
    onError: (error: any) => {
      console.error('Reject error:', error);
      let errorMessage = 'Failed to reject requirement';
      if (error?.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      showNotification(errorMessage, 'error');
    },
  });

  // Assign recruiter mutation
  const assignRecruiterMutation = useMutation({
    mutationFn: ({ id, recruiterId }: { id: string; recruiterId: string }) =>
      requirementsApi.assignRecruiter(id, recruiterId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      showNotification('Recruiter assigned successfully!', 'success');
    },
    onError: (error: any) => {
      console.error('Assign recruiter error:', error);
      let errorMessage = 'Failed to assign recruiter';
      if (error?.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      showNotification(errorMessage, 'error');
    },
  });

  // Activate requirement mutation
  const activateMutation = useMutation({
    mutationFn: (id: string) => requirementsApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      showNotification('Requirement activated successfully!', 'success');
    },
    onError: (error: any) => {
      console.error('Activate requirement error:', error);
      let errorMessage = 'Failed to activate requirement';
      if (error?.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (typeof detail === 'string') {
          errorMessage = detail;
        } else if (Array.isArray(detail)) {
          errorMessage = detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }
      showNotification(errorMessage, 'error');
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
    if (!selectedReq) return;
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedReq) {
      deleteMutation.mutate(selectedReq);
    }
    setDeleteDialogOpen(false);
    handleMenuClose();
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  const handleSubmit = () => {
    if (!selectedReq) {
      handleMenuClose();
      return;
    }
    submitMutation.mutate(selectedReq);
    handleMenuClose();
  };

  const handleApprove = () => {
    if (selectedReq) {
      setApprovalDialogOpen(true);
    }
  };

  const confirmApproval = () => {
    if (selectedReq) {
      approveMutation.mutate({ id: selectedReq, comments: approvalComments || undefined });
    }
    setApprovalDialogOpen(false);
    setApprovalComments('');
    handleMenuClose();
  };

  const cancelApproval = () => {
    setApprovalDialogOpen(false);
    setApprovalComments('');
  };

  const handleReject = () => {
    if (selectedReq) {
      setRejectionDialogOpen(true);
    }
  };

  const confirmRejection = () => {
    if (selectedReq && rejectionReason && rejectionReason.length >= 10) {
      rejectMutation.mutate({ id: selectedReq, comments: rejectionReason });
      setRejectionDialogOpen(false);
      setRejectionReason('');
      handleMenuClose();
    } else {
      showNotification('Rejection reason must be at least 10 characters', 'warning');
    }
  };

  const cancelRejection = () => {
    setRejectionDialogOpen(false);
    setRejectionReason('');
  };

  const handleAssignRecruiter = () => {
    if (selectedReq) {
      setSelectedRecruiterId('');
      setRecruiterDialogOpen(true);
    }
  };

  const confirmAssignRecruiter = () => {
    if (selectedReq && selectedRecruiterId) {
      assignRecruiterMutation.mutate({ id: selectedReq, recruiterId: selectedRecruiterId });
      setRecruiterDialogOpen(false);
      setSelectedRecruiterId('');
      handleMenuClose();
    } else {
      showNotification('Please select a recruiter', 'warning');
    }
  };

  const cancelAssignRecruiter = () => {
    setRecruiterDialogOpen(false);
    setSelectedRecruiterId('');
  };

  const handleActivate = () => {
    if (selectedReq) {
      setActivationDialogOpen(true);
    }
  };

  const confirmActivation = () => {
    if (selectedReq) {
      activateMutation.mutate(selectedReq);
      setActivationDialogOpen(false);
      handleMenuClose();
    }
  };

  const cancelActivation = () => {
    setActivationDialogOpen(false);
  };

  const handleRowClick = (requirementId: string) => {
    navigate(`/requirements/${requirementId}`);
  };

  const canSubmit = (req: any) => req.status.toLowerCase() === 'draft';
  const canApprove = (req: any) => req.status.toLowerCase() === 'submitted';
  const canReject = (req: any) => req.status.toLowerCase() === 'submitted';
  const canAssignRecruiter = (req: any) => req.status.toLowerCase() === 'approved' && !req.assigned_recruiter_id;
  const canActivate = (req: any) => {
    return req.status.toLowerCase() === 'approved' && 
           req.assigned_recruiter_id && 
           currentUser && 
           currentUser.id === req.assigned_recruiter_id;
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
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned To</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Created</TableCell>
                    <TableCell sx={{ fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
              <TableBody>
                {data?.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                      <Typography color="text.secondary">
                        No requirements found. Create your first requirement to get started.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.items.map((req) => (
                    <TableRow
                      key={req.id}
                      onClick={() => handleRowClick(req.id)}
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
                      <TableCell>
                        {req.assigned_recruiter_id ? (
                          (() => {
                            const recruiter = recruiters?.find(r => r.id === req.assigned_recruiter_id);
                            return recruiter ? (
                              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {recruiter.first_name} {recruiter.last_name}
                              </Typography>
                            ) : (
                              <Typography variant="body2" color="text.secondary" fontStyle="italic">
                                Unknown
                              </Typography>
                            );
                          })()
                        ) : (
                          <Typography variant="body2" color="text.secondary" fontStyle="italic">
                            Unassigned
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{new Date(req.created_at).toLocaleDateString()}</TableCell>
                      <TableCell align="center">
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMenuOpen(e, req.id);
                          }}
                        >
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
        {selectedReq && data?.items.find((r) => r.id === selectedReq) && (() => {
          const req = data.items.find((r) => r.id === selectedReq)!;
          return (
            <>
              <MenuItem onClick={handleEdit}>
                <Edit fontSize="small" sx={{ mr: 1 }} />
                Edit
              </MenuItem>
              {canSubmit(req) && (
                <MenuItem onClick={handleSubmit} sx={{ color: 'primary.main' }}>
                  <Typography fontSize="small" sx={{ mr: 1 }}>📤</Typography>
                  Submit for Approval
                </MenuItem>
              )}
              {canApprove(req) && (
                <MenuItem onClick={handleApprove} sx={{ color: 'success.main' }}>
                  <Typography fontSize="small" sx={{ mr: 1 }}>✅</Typography>
                  Approve
                </MenuItem>
              )}
              {canReject(req) && (
                <MenuItem onClick={handleReject} sx={{ color: 'error.main' }}>
                  <Typography fontSize="small" sx={{ mr: 1 }}>❌</Typography>
                  Reject
                </MenuItem>
              )}
              {canAssignRecruiter(req) && (
                <MenuItem onClick={handleAssignRecruiter} sx={{ color: 'info.main' }}>
                  <Typography fontSize="small" sx={{ mr: 1 }}>👤</Typography>
                  Assign Recruiter
                </MenuItem>
              )}
              {canActivate(req) && (
                <MenuItem onClick={handleActivate} sx={{ color: 'success.main' }}>
                  <Typography fontSize="small" sx={{ mr: 1 }}>🚀</Typography>
                  Activate Requirement
                </MenuItem>
              )}
              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                <Delete fontSize="small" sx={{ mr: 1 }} />
                Delete
              </MenuItem>
            </>
          );
        })()}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this requirement? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Approval Comments Dialog */}
      <Dialog
        open={approvalDialogOpen}
        onClose={cancelApproval}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Approve Requirement</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Approval Comments (Optional)"
            fullWidth
            multiline
            rows={3}
            value={approvalComments}
            onChange={(e) => setApprovalComments(e.target.value)}
            placeholder="Add any comments about this approval..."
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={cancelApproval}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={confirmApproval}
          >
            Approve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rejection Reason Dialog */}
      <Dialog
        open={rejectionDialogOpen}
        onClose={cancelRejection}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reject Requirement</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Rejection Reason (Required)"
            fullWidth
            multiline
            rows={3}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            placeholder="Provide a reason for rejection (minimum 10 characters)..."
            error={rejectionReason.length > 0 && rejectionReason.length < 10}
            helperText={
              rejectionReason.length > 0 && rejectionReason.length < 10
                ? `${10 - rejectionReason.length} more characters required`
                : ''
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={cancelRejection}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmRejection}
            disabled={rejectionReason.length < 10}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Recruiter Dialog */}
      <Dialog
        open={recruiterDialogOpen}
        onClose={cancelAssignRecruiter}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Assign Recruiter</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Recruiter</InputLabel>
            <Select
              value={selectedRecruiterId}
              onChange={(e) => setSelectedRecruiterId(e.target.value)}
              label="Select Recruiter"
            >
              {recruiters && recruiters.length > 0 ? (
                recruiters.map((recruiter) => (
                  <MenuItem key={recruiter.id} value={recruiter.id}>
                    {recruiter.first_name} {recruiter.last_name} ({recruiter.email})
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled>No recruiters available</MenuItem>
              )}
            </Select>
          </FormControl>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            The selected recruiter will be responsible for managing this requirement and finding suitable candidates.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={cancelAssignRecruiter}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={confirmAssignRecruiter}
            disabled={!selectedRecruiterId}
          >
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Activation Confirmation Dialog */}
      <Dialog
        open={activationDialogOpen}
        onClose={cancelActivation}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Activate Requirement</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Are you sure you want to activate this requirement? Once activated, you can start sourcing candidates for this position.
          </Typography>
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              <strong>Note:</strong> Activating this requirement will change its status to ACTIVE and set the posted date to today.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={cancelActivation}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={confirmActivation}
            startIcon={<Typography fontSize="small">🚀</Typography>}
          >
            Activate
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </Box>
  );
};

export default Requirements;

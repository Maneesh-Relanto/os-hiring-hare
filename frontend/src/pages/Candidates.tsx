import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Alert,
  TablePagination,
  Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Refresh } from '@mui/icons-material';
import { candidatesApi, CandidateCreate } from '../services/candidatesApi';

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'new': return 'default';
    case 'screening': return 'info';
    case 'interviewing': return 'warning';
    case 'offered': return 'secondary';
    case 'hired': return 'success';
    case 'rejected': return 'error';
    case 'withdrawn': return 'default';
    default: return 'default';
  }
};

const Candidates = () => {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<string | null>(null);
  const [editingCandidate, setEditingCandidate] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [formData, setFormData] = useState<Partial<CandidateCreate>>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    status: 'new',
  });

  // Fetch candidates with pagination
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['candidates', page, rowsPerPage],
    queryFn: () => candidatesApi.list({ skip: page * rowsPerPage, limit: rowsPerPage }),
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: candidatesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      handleCloseDialog();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CandidateCreate> }) =>
      candidatesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
      handleCloseDialog();
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: candidatesApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    },
  });

  const handleOpenDialog = (candidate?: any) => {
    if (candidate) {
      setEditingCandidate(candidate);
      setFormData(candidate);
    } else {
      setEditingCandidate(null);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        status: 'new',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCandidate(null);
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      status: 'new',
    });
  };

  const handleSubmit = () => {
    if (editingCandidate) {
      updateMutation.mutate({ id: editingCandidate.id, data: formData });
    } else {
      createMutation.mutate(formData as CandidateCreate);
    }
  };

  const handleDelete = (id: string) => {
    setCandidateToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (candidateToDelete) {
      deleteMutation.mutate(candidateToDelete);
    }
    setDeleteDialogOpen(false);
    setCandidateToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setCandidateToDelete(null);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load candidates</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Candidates
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Total: {data?.total || 0} candidates
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Refresh">
              <IconButton onClick={() => refetch()} sx={{ border: '1px solid', borderColor: 'divider' }}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleOpenDialog()}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
                background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
              }}
            >
              Add Candidate
            </Button>
          </Box>
        </Box>

        {/* Candidates Table */}
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, overflow: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}>Phone</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}>Current Role</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}>Experience</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }}>Applied On</TableCell>
                <TableCell sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.items.map((candidate) => (
                <TableRow key={candidate.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={600}>
                      {`${candidate.first_name} ${candidate.last_name}`}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {candidate.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {candidate.phone || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {candidate.current_title || '-'}
                    </Typography>
                    {candidate.current_company && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        at {candidate.current_company}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {candidate.total_experience_years ? `${candidate.total_experience_years} years` : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={(candidate.status || 'new').toUpperCase()} 
                      color={getStatusColor(candidate.status || 'new')} 
                      size="small"
                      sx={{ fontWeight: 600, minWidth: 100 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(candidate.created_at)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => handleOpenDialog(candidate)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete(candidate.id)} color="error">
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {data?.items.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No candidates found. Add your first candidate!</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={data?.total || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          />
        </TableContainer>

        {/* Add/Edit Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {editingCandidate ? 'Edit Candidate' : 'Add New Candidate'}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Company"
                  value={formData.current_company || ''}
                  onChange={(e) => setFormData({ ...formData, current_company: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Current Title"
                  value={formData.current_title || ''}
                  onChange={(e) => setFormData({ ...formData, current_title: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <MenuItem value="new">New</MenuItem>
                  <MenuItem value="screening">Screening</MenuItem>
                  <MenuItem value="interviewing">Interviewing</MenuItem>
                  <MenuItem value="offered">Offered</MenuItem>
                  <MenuItem value="hired">Hired</MenuItem>
                  <MenuItem value="rejected">Rejected</MenuItem>
                  <MenuItem value="withdrawn">Withdrawn</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Source"
                  value={formData.source || ''}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="LinkedIn, Indeed, Referral, etc."
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="LinkedIn URL"
                  value={formData.linkedin_url || ''}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes"
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={!formData.first_name || !formData.last_name || !formData.email}
            >
              {editingCandidate ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
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
              Are you sure you want to delete this candidate? This action cannot be undone.
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
      </Container>
    </Box>
  );
};

export default Candidates;

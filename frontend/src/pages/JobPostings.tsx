import React, { useState } from 'react';
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
  TablePagination,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  MoreVert,
  Search,
  PlayArrow,
  Pause,
  Close as CloseIcon,
  Edit,
  Visibility,
  TrendingUp,
  Work,
  CheckCircle,
  PauseCircle,
  Cancel,
  Public,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import postingsApi, { PostingStats } from '../services/postingsApi';
import { useNotification } from '../contexts/NotificationContext';

interface Requirement {
  id: string;
  requirement_number: string;
  position_title: string;
  department: string;
  location: string;
  employment_type: string;
  work_mode: string;
  status: string;
  is_posted: boolean;
  posting_status: string;
  posting_channels: string[];
  job_posting_url: string | null;
  posted_at: string | null;
  posting_details: {
    benefits?: string[];
    custom_description?: string;
    application_instructions?: string;
  } | null;
}

const JobPostings: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showNotification } = useNotification();

  // State
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [channelFilter, setChannelFilter] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPosting, setSelectedPosting] = useState<Requirement | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');

  // Fetch postings
  const { data: postingsData, isLoading } = useQuery({
    queryKey: ['postings', page, rowsPerPage, searchQuery, statusFilter, departmentFilter, channelFilter],
    queryFn: () =>
      postingsApi.list({
        skip: page * rowsPerPage,
        limit: rowsPerPage,
        search: searchQuery || undefined,
        posting_status: statusFilter || undefined,
        department: departmentFilter || undefined,
        channel: channelFilter || undefined,
      }),
  });

  // Fetch stats
  const { data: stats } = useQuery<PostingStats>({
    queryKey: ['postingStats'],
    queryFn: () => postingsApi.getStats(),
  });

  const postings = postingsData?.items || [];
  const total = postingsData?.total || 0;

  // Extract unique values for filters
  const departments = Array.from(new Set(postings.map((p: Requirement) => p.department)));

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => postingsApi.updateStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postings'] });
      queryClient.invalidateQueries({ queryKey: ['postingStats'] });
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      showNotification('Posting status updated successfully', 'success');
      setUpdateDialogOpen(false);
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Failed to update posting status';
      showNotification(message, 'error');
    },
  });

  // Handlers
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, posting: Requirement) => {
    setAnchorEl(event.currentTarget);
    setSelectedPosting(posting);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPosting(null);
  };

  const handleViewRequirement = () => {
    if (selectedPosting) {
      navigate(`/requirements/${selectedPosting.id}`);
      handleMenuClose();
    }
  };

  const handleViewPublic = () => {
    if (selectedPosting?.job_posting_url) {
      window.open(`/careers`, '_blank');
    }
    handleMenuClose();
  };

  const handleUpdateStatus = (status: string) => {
    if (selectedPosting) {
      setNewStatus(status);
      setUpdateDialogOpen(true);
      handleMenuClose();
    }
  };

  const confirmUpdateStatus = () => {
    if (selectedPosting && newStatus) {
      updateStatusMutation.mutate({
        id: selectedPosting.id,
        data: { posting_status: newStatus },
      });
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatEnumValue = (value: string): string => {
    return value
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'paused':
        return 'warning';
      case 'closed':
        return 'error';
      case 'draft':
        return 'default';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle sx={{ fontSize: 18 }} />;
      case 'paused':
        return <PauseCircle sx={{ fontSize: 18 }} />;
      case 'closed':
        return <Cancel sx={{ fontSize: 18 }} />;
      default:
        return <Work sx={{ fontSize: 18 }} />;
    }
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Job Postings Management
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Manage and monitor all your active job postings across channels
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Total Posted
                    </Typography>
                    <Typography variant="h4" fontWeight={700}>
                      {stats?.total_posted || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: 'primary.50',
                      borderRadius: 2,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 32, color: 'primary.main' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Active
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="success.main">
                      {stats?.active || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: 'success.50',
                      borderRadius: 2,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 32, color: 'success.main' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Paused
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="warning.main">
                      {stats?.paused || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: 'warning.50',
                      borderRadius: 2,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PauseCircle sx={{ fontSize: 32, color: 'warning.main' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Closed
                    </Typography>
                    <Typography variant="h4" fontWeight={700} color="error.main">
                      {stats?.closed || 0}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      bgcolor: 'error.50',
                      borderRadius: 2,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Cancel sx={{ fontSize: 32, color: 'error.main' }} />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by title, number, or description..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(0);
                  }}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                  <MenuItem value="draft">Draft</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  onChange={(e) => {
                    setDepartmentFilter(e.target.value);
                    setPage(0);
                  }}
                  label="Department"
                >
                  <MenuItem value="">All</MenuItem>
                  {departments.map((dept) => (
                    <MenuItem key={dept} value={dept}>
                      {formatEnumValue(dept)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <FormControl fullWidth>
                <InputLabel>Channel</InputLabel>
                <Select
                  value={channelFilter}
                  onChange={(e) => {
                    setChannelFilter(e.target.value);
                    setPage(0);
                  }}
                  label="Channel"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="linkedin">LinkedIn</MenuItem>
                  <MenuItem value="naukri">Naukri</MenuItem>
                  <MenuItem value="indeed">Indeed</MenuItem>
                  <MenuItem value="internal">Internal</MenuItem>
                  <MenuItem value="company_website">Company Website</MenuItem>
                  <MenuItem value="glassdoor">Glassdoor</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell><strong>Req #</strong></TableCell>
                <TableCell><strong>Position</strong></TableCell>
                <TableCell><strong>Department</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Channels</strong></TableCell>
                <TableCell><strong>Posted Date</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      Loading postings...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : postings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Work sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No job postings found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Start by posting a job from the Requirements page
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                postings.map((posting: Requirement) => (
                  <TableRow key={posting.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {posting.requirement_number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{posting.position_title}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatEnumValue(posting.employment_type)} • {formatEnumValue(posting.work_mode)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatEnumValue(posting.department)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{posting.location}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(posting.posting_status)}
                        label={formatEnumValue(posting.posting_status)}
                        color={getStatusColor(posting.posting_status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {posting.posting_channels?.slice(0, 2).map((channel: string) => (
                          <Chip
                            key={channel}
                            label={formatEnumValue(channel)}
                            size="small"
                            variant="outlined"
                          />
                        ))}
                        {posting.posting_channels?.length > 2 && (
                          <Chip label={`+${posting.posting_channels.length - 2}`} size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {posting.posted_at
                          ? new Date(posting.posted_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '-'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, posting)}>
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50, 100]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        {/* Action Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleViewRequirement}>
            <Visibility sx={{ mr: 1, fontSize: 20 }} />
            View Requirement
          </MenuItem>
          <MenuItem onClick={handleViewPublic}>
            <Public sx={{ mr: 1, fontSize: 20 }} />
            View on Careers Page
          </MenuItem>
          {selectedPosting?.posting_status === 'active' && (
            <MenuItem onClick={() => handleUpdateStatus('paused')}>
              <Pause sx={{ mr: 1, fontSize: 20 }} />
              Pause Posting
            </MenuItem>
          )}
          {selectedPosting?.posting_status === 'paused' && (
            <MenuItem onClick={() => handleUpdateStatus('active')}>
              <PlayArrow sx={{ mr: 1, fontSize: 20 }} />
              Reactivate Posting
            </MenuItem>
          )}
          {(selectedPosting?.posting_status === 'active' || selectedPosting?.posting_status === 'paused') && (
            <MenuItem onClick={() => handleUpdateStatus('closed')} sx={{ color: 'error.main' }}>
              <CloseIcon sx={{ mr: 1, fontSize: 20 }} />
              Close Posting
            </MenuItem>
          )}
        </Menu>

        {/* Update Status Dialog */}
        <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Confirm Status Update</DialogTitle>
          <DialogContent>
            <Alert severity="info" sx={{ mt: 1 }}>
              Are you sure you want to change the posting status to <strong>{formatEnumValue(newStatus)}</strong>?
            </Alert>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              <strong>Requirement:</strong> {selectedPosting?.requirement_number} - {selectedPosting?.position_title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Current Status:</strong> {selectedPosting?.posting_status && formatEnumValue(selectedPosting.posting_status)}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setUpdateDialogOpen(false)}>Cancel</Button>
            <Button variant="contained" onClick={confirmUpdateStatus} disabled={updateStatusMutation.isPending}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default JobPostings;

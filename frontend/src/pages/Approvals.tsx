import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Visibility,
  AccessTime,
  Person,
  Work,
  LocationOn,
  AttachMoney,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { requirementsApi } from '../services/requirementsApi';
import { useNotification } from '../contexts/NotificationContext';
import { format } from 'date-fns';

interface PendingApproval {
  approval_id: string;
  approval_stage: string;
  submitted_at: string;
  requirement: any;
  submitter_name?: string;
  submitter_email?: string;
}

const Approvals: React.FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null);
  const [comments, setComments] = useState('');
  const [rejectComments, setRejectComments] = useState('');

  // Fetch pending approvals
  const { data: pendingApprovals, isLoading, error } = useQuery<PendingApproval[]>({
    queryKey: ['pendingApprovals'],
    queryFn: requirementsApi.getPendingApprovals,
  });

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: ({ id, comments }: { id: string; comments?: string }) =>
      requirementsApi.approve(id, comments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      showNotification('Requirement approved successfully!', 'success');
      setApproveDialogOpen(false);
      setComments('');
      setSelectedApproval(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Failed to approve requirement';
      showNotification(errorMessage, 'error');
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: ({ id, comments }: { id: string; comments: string }) =>
      requirementsApi.reject(id, comments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingApprovals'] });
      queryClient.invalidateQueries({ queryKey: ['requirements'] });
      showNotification('Requirement rejected', 'info');
      setRejectDialogOpen(false);
      setRejectComments('');
      setSelectedApproval(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Failed to reject requirement';
      showNotification(errorMessage, 'error');
    },
  });

  const handleApprove = (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setApproveDialogOpen(true);
  };

  const handleReject = (approval: PendingApproval) => {
    setSelectedApproval(approval);
    setRejectDialogOpen(true);
  };

  const confirmApprove = () => {
    if (selectedApproval) {
      approveMutation.mutate({
        id: selectedApproval.requirement.id,
        comments: comments || undefined,
      });
    }
  };

  const confirmReject = () => {
    if (selectedApproval && rejectComments.trim().length >= 10) {
      rejectMutation.mutate({
        id: selectedApproval.requirement.id,
        comments: rejectComments,
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent':
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const getDaysAgo = (dateString: string) => {
    try {
      const days = Math.floor(
        (Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)
      );
      if (days === 0) return 'Today';
      if (days === 1) return '1 day ago';
      return `${days} days ago`;
    } catch {
      return '';
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">Failed to load pending approvals</Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4" gutterBottom>
          Pending Approvals
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Review and approve requirements assigned to you
        </Typography>
      </Box>

      {/* Empty State */}
      {!pendingApprovals || pendingApprovals.length === 0 ? (
        <Card>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center" py={4}>
              <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                All caught up!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You have no pending approvals at the moment.
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary */}
          <Alert severity="info" sx={{ mb: 3 }}>
            You have <strong>{pendingApprovals.length}</strong> requirement
            {pendingApprovals.length !== 1 ? 's' : ''} waiting for your approval
          </Alert>

          {/* Approval Cards */}
          <Grid container spacing={3}>
            {pendingApprovals.map((approval) => (
              <Grid item xs={12} key={approval.approval_id}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2}>
                      {/* Left Column - Main Info */}
                      <Grid item xs={12} md={8}>
                        <Stack spacing={2}>
                          {/* Header */}
                          <Box>
                            <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                              <Typography variant="h6" component="div">
                                {approval.requirement.position_title}
                              </Typography>
                              <Chip
                                label={approval.requirement.requirement_number}
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                              <Chip
                                label={approval.requirement.priority}
                                size="small"
                                color={getPriorityColor(approval.requirement.priority)}
                              />
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <AccessTime fontSize="small" color="action" />
                              <Typography variant="caption" color="text.secondary">
                                Submitted {getDaysAgo(approval.submitted_at)} •{' '}
                                {formatDate(approval.submitted_at)}
                                {approval.submitter_name && (
                                  <>
                                    {' • '}
                                    <strong>Pending with: {approval.submitter_name}</strong>
                                  </>
                                )}
                              </Typography>
                            </Stack>
                          </Box>

                          <Divider />

                          {/* Details Grid */}
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Work fontSize="small" color="action" />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Job Level
                                  </Typography>
                                  <Typography variant="body2">
                                    {approval.requirement.job_level}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Grid>
                            <Grid item xs={6}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <LocationOn fontSize="small" color="action" />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Location
                                  </Typography>
                                  <Typography variant="body2">
                                    {approval.requirement.location}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Grid>
                            <Grid item xs={6}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Person fontSize="small" color="action" />
                                <Box>
                                  <Typography variant="caption" color="text.secondary">
                                    Positions
                                  </Typography>
                                  <Typography variant="body2">
                                    {approval.requirement.number_of_positions}
                                  </Typography>
                                </Box>
                              </Stack>
                            </Grid>
                            {approval.requirement.max_salary && (
                              <Grid item xs={6}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <AttachMoney fontSize="small" color="action" />
                                  <Box>
                                    <Typography variant="caption" color="text.secondary">
                                      Salary Range
                                    </Typography>
                                    <Typography variant="body2">
                                      {approval.requirement.currency || '$'}{' '}
                                      {approval.requirement.min_salary?.toLocaleString()} -{' '}
                                      {approval.requirement.max_salary?.toLocaleString()}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Grid>
                            )}
                          </Grid>

                          {/* Justification */}
                          {approval.requirement.justification && (
                            <Box>
                              <Typography variant="caption" color="text.secondary" gutterBottom>
                                Business Justification:
                              </Typography>
                              <Typography variant="body2">
                                {approval.requirement.justification}
                              </Typography>
                            </Box>
                          )}
                        </Stack>
                      </Grid>

                      {/* Right Column - Actions */}
                      <Grid item xs={12} md={4}>
                        <Stack spacing={2} height="100%">
                          <Box
                            sx={{
                              p: 2,
                              bgcolor: 'warning.lighter',
                              borderRadius: 1,
                              border: 1,
                              borderColor: 'warning.light',
                            }}
                          >
                            <Typography variant="caption" color="warning.dark" fontWeight="bold">
                              APPROVAL STAGE
                            </Typography>
                            <Typography variant="body2" color="warning.dark">
                              {approval.approval_stage.replace('_', ' ').toUpperCase()}
                            </Typography>
                          </Box>

                          <Stack spacing={1} flexGrow={1}>
                            <Button
                              fullWidth
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircle />}
                              onClick={() => handleApprove(approval)}
                              disabled={approveMutation.isPending || rejectMutation.isPending}
                            >
                              Approve
                            </Button>
                            <Button
                              fullWidth
                              variant="outlined"
                              color="error"
                              startIcon={<Cancel />}
                              onClick={() => handleReject(approval)}
                              disabled={approveMutation.isPending || rejectMutation.isPending}
                            >
                              Reject
                            </Button>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<Visibility />}
                              onClick={() =>
                                navigate(`/requirements/${approval.requirement.id}`)
                              }
                            >
                              View Details
                            </Button>
                          </Stack>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onClose={() => setApproveDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Approve Requirement</DialogTitle>
        <DialogContent>
          <Box pt={1}>
            <Alert severity="success" sx={{ mb: 2 }}>
              You are about to approve "{selectedApproval?.requirement.position_title}"
            </Alert>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Comments (Optional)"
              placeholder="Add any comments or notes..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setApproveDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="success"
            onClick={confirmApprove}
            disabled={approveMutation.isPending}
          >
            {approveMutation.isPending ? <CircularProgress size={24} /> : 'Confirm Approval'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Requirement</DialogTitle>
        <DialogContent>
          <Box pt={1}>
            <Alert severity="error" sx={{ mb: 2 }}>
              You are about to reject "{selectedApproval?.requirement.position_title}"
            </Alert>
            <TextField
              fullWidth
              required
              multiline
              rows={4}
              label="Rejection Reason"
              placeholder="Please provide a detailed reason for rejection (minimum 10 characters)..."
              value={rejectComments}
              onChange={(e) => setRejectComments(e.target.value)}
              error={rejectComments.length > 0 && rejectComments.length < 10}
              helperText={
                rejectComments.length > 0 && rejectComments.length < 10
                  ? `${10 - rejectComments.length} more characters required`
                  : 'Minimum 10 characters'
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmReject}
            disabled={rejectMutation.isPending || rejectComments.trim().length < 10}
          >
            {rejectMutation.isPending ? <CircularProgress size={24} /> : 'Confirm Rejection'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Approvals;

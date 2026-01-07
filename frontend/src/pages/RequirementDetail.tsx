import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material';
import { ArrowBack, Edit, CalendarToday, Person, AttachMoney } from '@mui/icons-material';
import { requirementsApi } from '../services/requirementsApi';

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

const RequirementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: requirement, isLoading, error } = useQuery({
    queryKey: ['requirement', id],
    queryFn: () => requirementsApi.get(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !requirement) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">Failed to load requirement details</Alert>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/requirements')} sx={{ mt: 2 }}>
          Back to Requirements
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/requirements')}
            sx={{ mb: 2, fontWeight: 600 }}
          >
            Back to Requirements
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                {requirement.position_title}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Chip
                  label={requirement.requirement_number}
                  size="small"
                  color="primary"
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={formatEnumValue(requirement.status)}
                  size="small"
                  color={getStatusColor(requirement.status)}
                  sx={{ fontWeight: 600 }}
                />
                <Chip
                  label={formatEnumValue(requirement.priority)}
                  size="small"
                  color={getPriorityColor(requirement.priority)}
                  sx={{ fontWeight: 600 }}
                />
              </Stack>
            </Box>
            <Button
              variant="contained"
              startIcon={<Edit />}
              onClick={() => navigate(`/requirements?edit=${id}`)}
              sx={{ fontWeight: 600 }}
            >
              Edit
            </Button>
          </Box>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Column - Main Details */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Position Details
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Department
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {requirement.department || 'Not specified'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Location
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {requirement.location || 'Not specified'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Employment Type
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatEnumValue(requirement.employment_type)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Experience Required
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {requirement.min_experience} - {requirement.max_experience} years
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Salary Range
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {requirement.min_salary && requirement.max_salary
                      ? `$${requirement.min_salary.toLocaleString()} - $${requirement.max_salary.toLocaleString()}`
                      : 'Not specified'}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Positions Open
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {requirement.number_of_positions}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Job Description */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Job Description
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {requirement.job_description || 'No description provided'}
              </Typography>
            </Paper>

            {/* Requirements */}
            {requirement.required_skills && requirement.required_skills.length > 0 && (
              <Paper sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Required Skills
                </Typography>
                <Divider sx={{ mb: 3 }} />
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {requirement.required_skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      color="primary"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  ))}
                </Stack>
              </Paper>
            )}
          </Grid>

          {/* Right Column - Metadata */}
          <Grid item xs={12} md={4}>
            {/* Timeline */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Timeline
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Stack spacing={2.5}>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Created
                    </Typography>
                  </Stack>
                  <Typography variant="body1" sx={{ fontWeight: 600, ml: 3.5 }}>
                    {new Date(requirement.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>

                {requirement.target_start_date && (
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                      <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Target Start Date
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ fontWeight: 600, ml: 3.5 }}>
                      {new Date(requirement.target_start_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    <CalendarToday sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      Last Updated
                    </Typography>
                  </Stack>
                  <Typography variant="body1" sx={{ fontWeight: 600, ml: 3.5 }}>
                    {new Date(requirement.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Stack>
            </Paper>

            {/* Additional Info */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Additional Information
              </Typography>
              <Divider sx={{ mb: 3 }} />
              
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Education Level
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {requirement.education_level ? formatEnumValue(requirement.education_level) : 'Not specified'}
                  </Typography>
                </Box>

                {requirement.hiring_manager && (
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                      <Person sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Hiring Manager
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ fontWeight: 600, ml: 3.5 }}>
                      {requirement.hiring_manager}
                    </Typography>
                  </Box>
                )}

                {requirement.budget && (
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                      <AttachMoney sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        Budget
                      </Typography>
                    </Stack>
                    <Typography variant="body1" sx={{ fontWeight: 600, ml: 3.5 }}>
                      ${requirement.budget.toLocaleString()}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default RequirementDetail;

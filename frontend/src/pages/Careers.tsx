import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Divider,
  Stack,
} from '@mui/material';
import { Search, Work, LocationOn, Business, Schedule } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface JobPosting {
  requirement_number: string;
  job_title: string;
  department: string;
  location: string;
  employment_type: string;
  work_mode: string;
  experience_required: string;
  salary_range_min?: number;
  salary_range_max?: number;
  currency?: string;
  job_description: string;
  key_qualifications: string[];
  benefits?: string[];
  application_instructions?: string;
  posted_at: string;
  posting_status: string;
}

interface CareersResponse {
  jobs: JobPosting[];
  total: number;
}

const Careers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [workModeFilter, setWorkModeFilter] = useState<string>('');

  // Fetch jobs from public API
  const { data: careersData, isLoading } = useQuery<CareersResponse>({
    queryKey: ['publicJobs', departmentFilter, locationFilter, workModeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (departmentFilter) params.append('department', departmentFilter);
      if (locationFilter) params.append('location', locationFilter);
      if (workModeFilter) params.append('work_mode', workModeFilter);

      const response = await axios.get(`/api/v1/public/jobs?${params.toString()}`);
      return response.data;
    },
  });

  const jobs = careersData?.jobs || [];
  
  // Filter jobs based on search query
  const filteredJobs = jobs.filter((job) =>
    job.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.job_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Extract unique values for filters
  const departments = Array.from(new Set(jobs.map(j => j.department)));
  const locations = Array.from(new Set(jobs.map(j => j.location)));
  const workModes = Array.from(new Set(jobs.map(j => j.work_mode)));

  const formatEnumValue = (value: string): string => {
    return value
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatSalary = (job: JobPosting): string => {
    if (!job.salary_range_min || !job.salary_range_max) return 'Competitive';
    const currency = job.currency || 'INR';
    return `${currency} ${job.salary_range_min.toLocaleString()} - ${job.salary_range_max.toLocaleString()}`;
  };

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh', py: 6 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            fontWeight={700}
            sx={{
              background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2,
            }}
          >
            Join Our Team
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            Discover exciting career opportunities and be part of something amazing
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search jobs by title, department, or description..."
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
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Department</InputLabel>
                <Select
                  value={departmentFilter}
                  onChange={(e) => setDepartmentFilter(e.target.value)}
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
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Location</InputLabel>
                <Select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  label="Location"
                >
                  <MenuItem value="">All</MenuItem>
                  {locations.map((loc) => (
                    <MenuItem key={loc} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4} md={2}>
              <FormControl fullWidth>
                <InputLabel>Work Mode</InputLabel>
                <Select
                  value={workModeFilter}
                  onChange={(e) => setWorkModeFilter(e.target.value)}
                  label="Work Mode"
                >
                  <MenuItem value="">All</MenuItem>
                  {workModes.map((mode) => (
                    <MenuItem key={mode} value={mode}>
                      {formatEnumValue(mode)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* Results Count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            {isLoading ? 'Loading...' : `${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''} found`}
          </Typography>
        </Box>

        {/* Job Listings */}
        {isLoading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Loading opportunities...
            </Typography>
          </Box>
        ) : filteredJobs.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center' }}>
            <Work sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No jobs found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search criteria or check back later for new opportunities
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredJobs.map((job) => (
              <Grid item xs={12} key={job.requirement_number}>
                <Card
                  sx={{
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h5" fontWeight={600} gutterBottom>
                        {job.job_title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Req #{job.requirement_number}
                      </Typography>
                    </Box>

                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2, gap: 1 }}>
                      <Chip
                        icon={<Business sx={{ fontSize: 18 }} />}
                        label={formatEnumValue(job.department)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<LocationOn sx={{ fontSize: 18 }} />}
                        label={job.location}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<Schedule sx={{ fontSize: 18 }} />}
                        label={formatEnumValue(job.employment_type)}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={formatEnumValue(job.work_mode)}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Stack>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Experience:</strong> {job.experience_required}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      <strong>Salary:</strong> {formatSalary(job)}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {job.job_description}
                    </Typography>

                    {job.key_qualifications && job.key_qualifications.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          Key Qualifications:
                        </Typography>
                        <Box component="ul" sx={{ pl: 2, m: 0 }}>
                          {job.key_qualifications.slice(0, 3).map((qual, index) => (
                            <Typography
                              component="li"
                              key={index}
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 0.5 }}
                            >
                              {qual}
                            </Typography>
                          ))}
                          {job.key_qualifications.length > 3 && (
                            <Typography variant="body2" color="text.secondary" fontStyle="italic">
                              + {job.key_qualifications.length - 3} more...
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )}

                    {job.benefits && job.benefits.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                          Benefits:
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ gap: 1 }}>
                          {job.benefits.map((benefit, index) => (
                            <Chip
                              key={index}
                              label={benefit}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </CardContent>

                  <CardActions sx={{ px: 2, pb: 2, justifyContent: 'space-between' }}>
                    <Typography variant="caption" color="text.secondary">
                      Posted {new Date(job.posted_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Typography>
                    <Button
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #6366F1 0%, #EC4899 100%)',
                      }}
                      onClick={() => {
                        // TODO: Navigate to job detail page or show application form
                        alert(`Apply for ${job.job_title}\n${job.application_instructions || 'Application process details coming soon!'}`);
                      }}
                    >
                      Apply Now
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Footer */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't see a perfect fit? Send us your resume anyway - we're always looking for talented individuals!
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Careers;

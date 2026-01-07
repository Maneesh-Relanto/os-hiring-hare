import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Tabs,
  Tab,
  InputAdornment,
  Chip,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { RequirementCreate } from '../services/requirementsApi';

interface RequirementFormProps {
  initialData?: Partial<RequirementCreate>;
  onSubmit: (data: RequirementCreate) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const RequirementForm = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
}: RequirementFormProps) => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState<Partial<RequirementCreate>>({
    position_title: '',
    department_id: '',
    job_level_id: '',
    location_id: '',
    requirement_type: 'new_headcount',
    employment_type: 'full_time',
    work_mode: 'hybrid',
    number_of_positions: 1,
    priority: 'medium',
    job_description: '',
    required_qualifications: '',
    justification: '',
    required_skills: {},
    currency: 'USD',
    ...initialData,
  });

  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  
  // Fetch reference data from API
  const [departments, setDepartments] = useState<any[]>([]);
  const [jobLevels, setJobLevels] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  useEffect(() => {
    // Fetch departments
    fetch('http://localhost:8000/api/v1/reference-data/departments')
      .then(res => res.json())
      .then(data => setDepartments(data || []))
      .catch(err => console.error('Error fetching departments:', err));

    // Fetch job levels
    fetch('http://localhost:8000/api/v1/reference-data/job-levels')
      .then(res => res.json())
      .then(data => setJobLevels(data || []))
      .catch(err => console.error('Error fetching job levels:', err));

    // Fetch locations
    fetch('http://localhost:8000/api/v1/reference-data/locations')
      .then(res => res.json())
      .then(data => setLocations(data || []))
      .catch(err => console.error('Error fetching locations:', err));
  }, []);

  useEffect(() => {
    if (initialData?.required_skills) {
      const skillsArray = Object.keys(initialData.required_skills);
      setSkills(skillsArray);
    }
  }, [initialData]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      const newSkills = [...skills, skillInput.trim()];
      setSkills(newSkills);
      const skillsObj = newSkills.reduce((acc, skill) => ({ ...acc, [skill]: true }), {});
      handleChange('required_skills', skillsObj);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const newSkills = skills.filter((s) => s !== skillToRemove);
    setSkills(newSkills);
    const skillsObj = newSkills.reduce((acc, skill) => ({ ...acc, [skill]: true }), {});
    handleChange('required_skills', skillsObj);
  };

  const handleSubmit = () => {
    console.log('=== Form Submission Started ===');
    console.log('Form data:', JSON.stringify(formData, null, 2)); // Debug log
    
    // Basic validation
    if (!formData.position_title) {
      alert('Please enter a position title');
      return;
    }
    
    if (!formData.job_description) {
      alert('Please enter a job description');
      return;
    }
    
    if (!formData.required_qualifications) {
      alert('Please enter required qualifications');
      return;
    }
    
    if (!formData.justification) {
      alert('Please enter a justification');
      return;
    }
    
    if (!formData.department_id) {
      alert('Please select a Department');
      return;
    }
    
    if (!formData.job_level_id) {
      alert('Please select a Job Level');
      return;
    }
    
    if (!formData.location_id) {
      alert('Please select a Location');
      return;
    }
    
    console.log('All validations passed. Calling onSubmit...'); // Debug log
    onSubmit(formData as RequirementCreate);
  };

  // Currency options
  const currencies = [
    { code: 'USD', name: 'US Dollar ($)', symbol: '$' },
    { code: 'INR', name: 'Indian Rupee (₹)', symbol: '₹' },
    { code: 'EUR', name: 'Euro (€)', symbol: '€' },
    { code: 'GBP', name: 'British Pound (£)', symbol: '£' },
  ];

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Basic Information" />
          <Tab label="Job Details" />
          <Tab label="Qualifications & Skills" />
          <Tab label="Compensation" />
        </Tabs>

        {/* Tab 1: Basic Information */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Position Title"
                value={formData.position_title}
                onChange={(e) => handleChange('position_title', e.target.value)}
                placeholder="e.g., Senior Software Engineer"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={departments}
                getOptionLabel={(option) => option.name || ''}
                value={departments.find(d => d.id === formData.department_id) || null}
                onChange={(_, newValue) => handleChange('department_id', newValue?.id || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Department"
                    required
                    placeholder="Search departments..."
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={jobLevels}
                getOptionLabel={(option) => option.name || ''}
                value={jobLevels.find(l => l.id === formData.job_level_id) || null}
                onChange={(_, newValue) => handleChange('job_level_id', newValue?.id || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Job Level"
                    required
                    placeholder="Search job levels..."
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                options={locations}
                getOptionLabel={(option) => option.city && option.country ? `${option.city}, ${option.country}` : option.name || ''}
                value={locations.find(l => l.id === formData.location_id) || null}
                onChange={(_, newValue) => handleChange('location_id', newValue?.id || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Location"
                    required
                    placeholder="Search cities worldwide..."
                  />
                )}
                groupBy={(option) => option.country || 'Other'}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Requirement Type</InputLabel>
                <Select
                  value={formData.requirement_type}
                  label="Requirement Type"
                  onChange={(e) => handleChange('requirement_type', e.target.value)}
                >
                  <MenuItem value="new_headcount">New Headcount</MenuItem>
                  <MenuItem value="backfill">Backfill</MenuItem>
                  <MenuItem value="contractor">Contractor</MenuItem>
                  <MenuItem value="intern">Intern</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Employment Type</InputLabel>
                <Select
                  value={formData.employment_type}
                  label="Employment Type"
                  onChange={(e) => handleChange('employment_type', e.target.value)}
                >
                  <MenuItem value="full_time">Full Time</MenuItem>
                  <MenuItem value="part_time">Part Time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                  <MenuItem value="intern">Intern</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Work Mode</InputLabel>
                <Select
                  value={formData.work_mode}
                  label="Work Mode"
                  onChange={(e) => handleChange('work_mode', e.target.value)}
                >
                  <MenuItem value="onsite">On-site</MenuItem>
                  <MenuItem value="remote">Remote</MenuItem>
                  <MenuItem value="hybrid">Hybrid</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={formData.priority}
                  label="Priority"
                  onChange={(e) => handleChange('priority', e.target.value)}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="urgent">Urgent</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Number of Positions"
                value={formData.number_of_positions}
                onChange={(e) => handleChange('number_of_positions', parseInt(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 2: Job Details */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={6}
                label="Job Description"
                value={formData.job_description}
                onChange={(e) => handleChange('job_description', e.target.value)}
                placeholder="Provide a detailed description of the role..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Key Responsibilities"
                value={formData.key_responsibilities || ''}
                onChange={(e) => handleChange('key_responsibilities', e.target.value)}
                placeholder="List the main responsibilities of this position..."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Target Start Date"
                value={formData.target_start_date ? new Date(formData.target_start_date) : null}
                onChange={(date) => handleChange('target_start_date', date?.toISOString().split('T')[0])}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Expected Closure Date"
                value={formData.expected_closure_date ? new Date(formData.expected_closure_date) : null}
                onChange={(date) => handleChange('expected_closure_date', date?.toISOString().split('T')[0])}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Justification"
                value={formData.justification}
                onChange={(e) => handleChange('justification', e.target.value)}
                placeholder="Explain why this position is needed..."
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 3: Qualifications & Skills */}
        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                multiline
                rows={5}
                label="Required Qualifications"
                value={formData.required_qualifications}
                onChange={(e) => handleChange('required_qualifications', e.target.value)}
                placeholder="List the mandatory qualifications..."
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Preferred Qualifications"
                value={formData.preferred_qualifications || ''}
                onChange={(e) => handleChange('preferred_qualifications', e.target.value)}
                placeholder="List the nice-to-have qualifications..."
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Required Skills
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Add a skill (e.g., Python, React, AWS)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <Button variant="contained" onClick={handleAddSkill}>
                  Add
                </Button>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    onDelete={() => handleRemoveSkill(skill)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Tab 4: Compensation */}
        <TabPanel value={tabValue} index={3}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Currency</InputLabel>
                <Select
                  value={formData.currency}
                  label="Currency"
                  onChange={(e) => handleChange('currency', e.target.value)}
                >
                  {currencies.map((curr) => (
                    <MenuItem key={curr.code} value={curr.code}>
                      {curr.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Minimum Salary"
                value={formData.min_salary || ''}
                onChange={(e) => handleChange('min_salary', parseFloat(e.target.value))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {currencies.find(c => c.code === formData.currency)?.symbol || '$'}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Maximum Salary"
                value={formData.max_salary || ''}
                onChange={(e) => handleChange('max_salary', parseFloat(e.target.value))}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      {currencies.find(c => c.code === formData.currency)?.symbol || '$'}
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Additional Compensation"
                value={formData.additional_compensation || ''}
                onChange={(e) => handleChange('additional_compensation', e.target.value)}
                placeholder="Bonuses, equity, benefits, etc..."
              />
            </Grid>
          </Grid>
        </TabPanel>

        {/* Form Actions */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {tabValue > 0 && (
              <Button onClick={() => setTabValue(tabValue - 1)}>Previous</Button>
            )}
            {tabValue < 3 ? (
              <Button variant="contained" onClick={() => setTabValue(tabValue + 1)}>
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{
                  background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #9333EA 0%, #DB2777 100%)',
                  },
                }}
              >
                {isLoading ? 'Saving...' : 'Create Requirement'}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default RequirementForm;

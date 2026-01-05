import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Container,
  Stack,
  Divider,
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon, WorkOutline } from '@mui/icons-material';
import { authApi } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleLogin = async (email: string, password: string) => {
    setError('');
    setLoading(true);

    console.log('🔐 Login attempt with:', email);

    try {
      console.log('📡 Calling authApi.login...');
      const response = await authApi.login(email, password);
      console.log('✅ Login response received:', { token_type: response.token_type });
      
      // Store tokens FIRST so axios interceptor can use them
      setAuth(response.access_token, response.refresh_token, null);
      console.log('💾 Tokens stored in auth store');
      
      // Now fetch current user with roles (interceptor will add token)
      console.log('👤 Fetching current user...');
      const user = await authApi.getCurrentUser();
      console.log('✅ User data received:', { email: user.email, roles: user.roles.length });
      
      // Update user info in store
      setAuth(response.access_token, response.refresh_token, user);
      console.log('🎉 Login successful, redirecting to dashboard...');
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err: unknown) {
      console.error('❌ Login error:', err);
      if (err && typeof err === 'object' && 'response' in err) {
        console.error('Response data:', (err as any).response?.data);
        console.error('Response status:', (err as any).response?.status);
      }
      const errorMessage = err instanceof Error && 'response' in err 
        ? (err as any).response?.data?.detail 
        : 'Invalid email or password. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(formData.email, formData.password);
  };

  const handleQuickLogin = async (email: string, password: string) => {
    setFormData({ email, password });
    await handleLogin(email, password);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.3), transparent 50%), radial-gradient(circle at bottom left, rgba(236, 72, 153, 0.3), transparent 50%)',
        },
      }}
    >
      <Container maxWidth="sm">
        <Card
          elevation={0}
          sx={{
            position: 'relative',
            zIndex: 1,
            backdropFilter: 'blur(20px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            {/* Logo and Title */}
            <Stack alignItems="center" spacing={2} sx={{ mb: 4 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)',
                }}
              >
                <WorkOutline sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textAlign: 'center',
                }}
              >
                Hiring Hare
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'center',
                  fontWeight: 500,
                }}
              >
                Streamline your recruitment process
              </Typography>
            </Stack>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: '24px',
                  },
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(248, 250, 252, 0.8)',
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          size="large"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LoginIcon />}
                  sx={{
                    py: 1.75,
                    fontSize: '1rem',
                    fontWeight: 600,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    boxShadow: '0 8px 20px rgba(99, 102, 241, 0.35)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #6a4192 100%)',
                      boxShadow: '0 12px 28px rgba(99, 102, 241, 0.45)',
                      transform: 'translateY(-2px)',
                    },
                    '&:disabled': {
                      background: 'linear-gradient(135deg, #94a3b8 0%, #64748b 100%)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </Stack>
            </Box>

            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                Quick Access
              </Typography>
            </Divider>

            {/* Test Credentials */}
            <Box
              sx={{
                p: 2.5,
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(236, 72, 153, 0.08) 100%)',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Demo Accounts:
              </Typography>
              <Stack spacing={0.75} sx={{ mt: 1.5 }}>
                {[
                  { email: 'admin@hiringhare.com', role: 'Administrator', password: 'Admin@2024' },
                  { email: 'manager@hiringhare.com', role: 'Hiring Manager', password: 'Manager@2024' },
                  { email: 'recruiter@hiringhare.com', role: 'Recruiter', password: 'Recruiter@2024' },
                ].map((account) => (
                  <Box
                    key={account.email}
                    onClick={() => handleQuickLogin(account.email, account.password)}
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      backgroundColor: 'white',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      border: '1px solid transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(99, 102, 241, 0.05)',
                        borderColor: 'primary.main',
                        transform: 'translateX(4px)',
                      },
                    }}
                  >
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      {account.role}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {account.email}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}

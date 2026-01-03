/**
 * Design System Theme Configuration
 * Based on Hiring Hare UI/UX Design System
 */
import { createTheme, ThemeOptions } from '@mui/material/styles';

// Color palette from design system
const colors = {
  primary: {
    50: '#F3E8FF',
    100: '#E9D5FF',
    200: '#D8B4FE',
    300: '#C084FC',
    400: '#A855F7',
    500: '#9333EA',
    600: '#7E22CE',
    700: '#6B21A8',
    800: '#581C87',
    900: '#3B0764',
  },
  secondary: {
    50: '#ECFEFF',
    100: '#CFFAFE',
    200: '#A5F3FC',
    300: '#67E8F9',
    400: '#22D3EE',
    500: '#06B6D4',
    600: '#0891B2',
    700: '#0E7490',
    800: '#155E75',
    900: '#164E63',
  },
  success: {
    light: '#D1FAE5',
    main: '#10B981',
    dark: '#047857',
  },
  warning: {
    light: '#FED7AA',
    main: '#F59E0B',
    dark: '#D97706',
  },
  error: {
    light: '#FEE2E2',
    main: '#EF4444',
    dark: '#DC2626',
  },
  info: {
    light: '#DBEAFE',
    main: '#3B82F6',
    dark: '#1D4ED8',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
};

// Gradients from design system
export const gradients = {
  primary: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
  secondary: 'linear-gradient(135deg, #22D3EE 0%, #3B82F6 100%)',
  success: 'linear-gradient(135deg, #10B981 0%, #14B8A6 100%)',
  hero: 'linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #F093FB 100%)',
  hover: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
};

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: colors.primary[400],
      light: colors.primary[300],
      dark: colors.primary[600],
      contrastText: '#ffffff',
    },
    secondary: {
      main: colors.secondary[400],
      light: colors.secondary[300],
      dark: colors.secondary[600],
      contrastText: '#ffffff',
    },
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    grey: colors.gray,
    background: {
      default: colors.gray[50],
      paper: '#ffffff',
    },
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[600],
      disabled: colors.gray[400],
    },
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontFamily: '"Poppins", "Inter", sans-serif',
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.25,
    },
    h2: {
      fontFamily: '"Poppins", "Inter", sans-serif',
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.25,
    },
    h3: {
      fontFamily: '"Poppins", "Inter", sans-serif',
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h4: {
      fontFamily: '"Poppins", "Inter", sans-serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h5: {
      fontFamily: '"Poppins", "Inter", sans-serif',
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontFamily: '"Poppins", "Inter", sans-serif',
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0, 0, 0, 0.05)',
    '0 4px 6px rgba(0, 0, 0, 0.05)',
    '0 4px 14px rgba(0, 0, 0, 0.08)',
    '0 8px 20px rgba(0, 0, 0, 0.08)',
    '0 8px 30px rgba(168, 85, 247, 0.15)',
    '0 12px 40px rgba(0, 0, 0, 0.12)',
    '0 16px 50px rgba(0, 0, 0, 0.15)',
    '0 20px 60px rgba(0, 0, 0, 0.18)',
    '0 4px 14px rgba(168, 85, 247, 0.4)',
    '0 6px 20px rgba(168, 85, 247, 0.6)',
    ...Array(14).fill('none'),
  ] as any,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 32px',
          fontSize: '1rem',
          fontWeight: 600,
          transition: 'all 0.3s ease',
        },
        contained: {
          boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
          '&:hover': {
            boxShadow: '0 6px 20px rgba(168, 85, 247, 0.6)',
            transform: 'translateY(-2px)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid',
          borderColor: colors.gray[200],
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(168, 85, 247, 0.15)',
            transform: 'translateY(-4px)',
            borderColor: colors.primary[400],
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderWidth: '2px',
            },
            '&:hover fieldset': {
              borderColor: colors.primary[400],
            },
            '&.Mui-focused fieldset': {
              borderWidth: '2px',
              boxShadow: `0 0 0 4px ${colors.primary[100]}`,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '0.875rem',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
};

export const theme = createTheme(themeOptions);
export default theme;

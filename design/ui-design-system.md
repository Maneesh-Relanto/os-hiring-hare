# Hiring Hare - UI/UX Design System
**Version:** 1.0  
**Date:** January 3, 2026  
**Design Philosophy:** Modern, Vibrant, Professional

---

## 🎨 Design Principles

### Core Values
1. **Modern & Fresh** - Contemporary design that feels current and innovative
2. **Vibrant & Energetic** - Bold colors that inspire action and positivity
3. **Professional & Trustworthy** - Credible for enterprise HR environments
4. **Intuitive & Efficient** - Clear information hierarchy and quick actions
5. **Accessible** - WCAG 2.1 AA compliant for all users

---

## 🌈 Color Palette

### Primary Colors
```css
/* Main Brand Color - Energetic Purple */
--primary-50: #F3E8FF;
--primary-100: #E9D5FF;
--primary-200: #D8B4FE;
--primary-300: #C084FC;
--primary-400: #A855F7;  /* Main Primary */
--primary-500: #9333EA;
--primary-600: #7E22CE;
--primary-700: #6B21A8;
--primary-800: #581C87;
--primary-900: #3B0764;
```

### Secondary Colors
```css
/* Vibrant Teal - For accents */
--secondary-50: #ECFEFF;
--secondary-100: #CFFAFE;
--secondary-200: #A5F3FC;
--secondary-300: #67E8F9;
--secondary-400: #22D3EE;  /* Main Secondary */
--secondary-500: #06B6D4;
--secondary-600: #0891B2;
--secondary-700: #0E7490;
--secondary-800: #155E75;
--secondary-900: #164E63;
```

### Accent Colors
```css
/* Success - Vibrant Green */
--success-light: #D1FAE5;
--success-main: #10B981;
--success-dark: #047857;

/* Warning - Energetic Orange */
--warning-light: #FED7AA;
--warning-main: #F59E0B;
--warning-dark: #D97706;

/* Error - Bold Red */
--error-light: #FEE2E2;
--error-main: #EF4444;
--error-dark: #DC2626;

/* Info - Bright Blue */
--info-light: #DBEAFE;
--info-main: #3B82F6;
--info-dark: #1D4ED8;
```

### Neutral Colors
```css
/* Grayscale */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-300: #D1D5DB;
--gray-400: #9CA3AF;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-800: #1F2937;
--gray-900: #111827;

/* Background */
--bg-primary: #FFFFFF;
--bg-secondary: #F9FAFB;
--bg-tertiary: #F3F4F6;
--bg-dark: #1F2937;

/* Text */
--text-primary: #111827;
--text-secondary: #6B7280;
--text-tertiary: #9CA3AF;
--text-inverse: #FFFFFF;
```

### Gradient Combinations
```css
/* Primary Gradient - Purple to Pink */
--gradient-primary: linear-gradient(135deg, #A855F7 0%, #EC4899 100%);

/* Secondary Gradient - Teal to Blue */
--gradient-secondary: linear-gradient(135deg, #22D3EE 0%, #3B82F6 100%);

/* Success Gradient */
--gradient-success: linear-gradient(135deg, #10B981 0%, #14B8A6 100%);

/* Hero Gradient - Multi-color */
--gradient-hero: linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #F093FB 100%);

/* Card Hover Gradient */
--gradient-hover: linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%);
```

---

## 📐 Typography

### Font Families
```css
/* Primary Font - Modern Sans-Serif */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

/* Headings Font - Bold & Impactful */
--font-heading: 'Poppins', 'Inter', sans-serif;

/* Monospace - For code/data */
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### Font Sizes (Responsive)
```css
/* Desktop */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */
--text-5xl: 3rem;      /* 48px */
--text-6xl: 3.75rem;   /* 60px */

/* Headings */
--h1: var(--text-5xl);  /* 48px */
--h2: var(--text-4xl);  /* 36px */
--h3: var(--text-3xl);  /* 30px */
--h4: var(--text-2xl);  /* 24px */
--h5: var(--text-xl);   /* 20px */
--h6: var(--text-lg);   /* 18px */
```

### Font Weights
```css
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Line Heights
```css
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
--leading-loose: 2;
```

---

## 🎯 Spacing System

### Base Unit: 4px
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

---

## 🔲 Components Library

### Buttons

#### Primary Button
```tsx
<Button 
  variant="contained"
  sx={{
    background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
    boxShadow: '0 4px 14px rgba(168, 85, 247, 0.4)',
    borderRadius: '12px',
    padding: '12px 32px',
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '16px',
    '&:hover': {
      background: 'linear-gradient(135deg, #9333EA 0%, #DB2777 100%)',
      boxShadow: '0 6px 20px rgba(168, 85, 247, 0.6)',
      transform: 'translateY(-2px)',
    },
    transition: 'all 0.3s ease',
  }}
>
  Create Requirement
</Button>
```

#### Secondary Button
```tsx
<Button 
  variant="outlined"
  sx={{
    borderColor: 'primary.main',
    color: 'primary.main',
    borderRadius: '12px',
    borderWidth: '2px',
    padding: '12px 32px',
    fontWeight: 600,
    textTransform: 'none',
    '&:hover': {
      borderWidth: '2px',
      background: 'rgba(168, 85, 247, 0.05)',
      transform: 'translateY(-2px)',
    },
  }}
>
  Cancel
</Button>
```

### Cards

#### Standard Card
```tsx
<Card
  sx={{
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: '1px solid',
    borderColor: 'gray.200',
    transition: 'all 0.3s ease',
    '&:hover': {
      boxShadow: '0 8px 30px rgba(168, 85, 247, 0.15)',
      transform: 'translateY(-4px)',
      borderColor: 'primary.main',
    },
  }}
>
  {/* Card content */}
</Card>
```

#### Gradient Card (Featured)
```tsx
<Card
  sx={{
    borderRadius: '20px',
    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
    border: '2px solid',
    borderColor: 'primary.main',
    boxShadow: '0 8px 32px rgba(168, 85, 247, 0.2)',
    overflow: 'hidden',
  }}
>
  {/* Featured content */}
</Card>
```

### Status Badges

```tsx
const statusStyles = {
  draft: {
    bg: '#F3F4F6',
    color: '#6B7280',
    icon: '📝',
  },
  active: {
    bg: '#D1FAE5',
    color: '#047857',
    icon: '✨',
  },
  approved: {
    bg: '#DBEAFE',
    color: '#1D4ED8',
    icon: '✓',
  },
  filled: {
    bg: '#D1FAE5',
    color: '#047857',
    icon: '🎉',
  },
  rejected: {
    bg: '#FEE2E2',
    color: '#DC2626',
    icon: '✗',
  },
};

<Chip
  label="Active"
  icon={<span>✨</span>}
  sx={{
    background: statusStyles.active.bg,
    color: statusStyles.active.color,
    fontWeight: 600,
    fontSize: '14px',
    padding: '4px 8px',
    borderRadius: '8px',
  }}
/>
```

### Input Fields

```tsx
<TextField
  fullWidth
  variant="outlined"
  sx={{
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: 'white',
      '& fieldset': {
        borderColor: 'gray.300',
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: 'primary.main',
      },
      '&.Mui-focused fieldset': {
        borderColor: 'primary.main',
        borderWidth: '2px',
        boxShadow: '0 0 0 4px rgba(168, 85, 247, 0.1)',
      },
    },
  }}
/>
```

---

## 🎭 Animations

### Transitions
```css
/* Standard easing */
--transition-fast: 0.15s ease;
--transition-base: 0.3s ease;
--transition-slow: 0.5s ease;

/* Cubic bezier for smooth animations */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out-circ: cubic-bezier(0.85, 0, 0.15, 1);
```

### Keyframe Animations
```css
/* Fade in up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Slide in right */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Scale fade in */
@keyframes scaleFadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Pulse */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

/* Shimmer loading */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
--breakpoint-xs: 0px;       /* Extra small devices */
--breakpoint-sm: 640px;     /* Small devices (mobile) */
--breakpoint-md: 768px;     /* Medium devices (tablet) */
--breakpoint-lg: 1024px;    /* Large devices (desktop) */
--breakpoint-xl: 1280px;    /* Extra large (wide desktop) */
--breakpoint-2xl: 1536px;   /* 2X large (ultra-wide) */
```

---

## 🏗️ Layout Patterns

### Dashboard Grid
```tsx
<Grid container spacing={3}>
  <Grid item xs={12} md={6} lg={3}>
    {/* Stat Card */}
  </Grid>
  <Grid item xs={12} md={6} lg={3}>
    {/* Stat Card */}
  </Grid>
  <Grid item xs={12} md={6} lg={3}>
    {/* Stat Card */}
  </Grid>
  <Grid item xs={12} md={6} lg={3}>
    {/* Stat Card */}
  </Grid>
</Grid>
```

### Sidebar + Content Layout
```tsx
<Box sx={{ display: 'flex', minHeight: '100vh' }}>
  {/* Sidebar */}
  <Box sx={{ width: 280, background: 'white', borderRight: '1px solid #E5E7EB' }}>
    {/* Navigation */}
  </Box>
  
  {/* Main Content */}
  <Box sx={{ flex: 1, background: '#F9FAFB', p: 4 }}>
    {/* Page content */}
  </Box>
</Box>
```

---

## 🎨 Page-Specific Designs

### Login Page
- Full-screen gradient background
- Centered glassmorphic card
- Vibrant primary button
- Social login options with icons
- Smooth transitions

### Dashboard
- Welcome banner with gradient
- 4-column stat cards with icons
- Chart widgets with colorful visualizations
- Quick action floating button
- Recent activity timeline

### Requirement Form
- Multi-step wizard with progress indicator
- Section cards with subtle shadows
- Inline validation with smooth messages
- Draft auto-save indicator
- Preview mode before submit

### Approval Queue
- Kanban-style board layout
- Drag-and-drop cards
- Priority color coding
- Quick approve/reject actions
- Filter sidebar with badges

---

## 🌟 Micro-interactions

### Loading States
```tsx
<Skeleton 
  variant="rectangular" 
  sx={{ 
    borderRadius: '12px',
    background: 'linear-gradient(90deg, #F3F4F6 0%, #E5E7EB 50%, #F3F4F6 100%)',
    animation: 'shimmer 2s infinite',
  }} 
/>
```

### Empty States
- Vibrant illustration
- Encouraging message
- Clear call-to-action button
- Optional onboarding tips

### Success Feedback
- Confetti animation
- Success checkmark with bounce
- Toast notification with gradient
- Smooth page transition

---

## 🎯 Component Examples

### Stat Card (Dashboard)
```tsx
<Card sx={{ 
  borderRadius: '16px', 
  p: 3,
  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
  border: '2px solid',
  borderColor: 'primary.100',
}}>
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Box sx={{ 
      width: 64, 
      height: 64, 
      borderRadius: '16px',
      background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
    }}>
      📋
    </Box>
    <Box>
      <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
        24
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Active Requirements
      </Typography>
    </Box>
  </Box>
</Card>
```

---

## 🔍 Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 for normal text)
- Interactive elements have 3:1 contrast
- Focus indicators are clearly visible

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order
- Skip navigation links
- ARIA labels on icons

### Screen Readers
- Semantic HTML
- ARIA landmarks
- Alt text for images
- Live regions for dynamic content

---

## 📋 Design Checklist

- [ ] Use vibrant gradients for primary actions
- [ ] Add subtle hover animations on interactive elements
- [ ] Include loading skeletons for async content
- [ ] Add empty states with illustrations
- [ ] Use status badges with icons and colors
- [ ] Implement smooth page transitions
- [ ] Add micro-interactions for feedback
- [ ] Ensure mobile responsiveness
- [ ] Test color contrast for accessibility
- [ ] Add keyboard navigation support

---

**Design System Owner:** UI/UX Team  
**Last Updated:** January 3, 2026  
**Version:** 1.0

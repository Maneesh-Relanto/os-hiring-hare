# UI Design System - Hiring Hare

## 🎨 Color Palette

### Primary Colors
- **Primary (Indigo)**: `#6366F1` - Main brand color, buttons, links
- **Secondary (Pink)**: `#EC4899` - Accents, gradients
- **Background**: `#F8FAFC` - Page background
- **Paper**: `#FFFFFF` - Card backgrounds

### Semantic Colors
- **Success (Emerald)**: `#10B981` - Positive actions, completed states
- **Warning (Amber)**: `#F59E0B` - Pending actions, cautionary states  
- **Error (Red)**: `#EF4444` - Errors, destructive actions
- **Info (Blue)**: `#3B82F6` - Informational states

### Text Colors
- **Primary Text**: `#1E293B` - Main content
- **Secondary Text**: `#64748B` - Supporting text
- **Divider**: `#E2E8F0` - Borders and separators

## 🔤 Typography

### Font Family
```css
font-family: "Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif
```

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **SemiBold**: 600
- **Bold**: 700
- **ExtraBold**: 800

### Headings
- **H1**: 2.5rem (40px), Weight 700, -0.02em letter-spacing
- **H2**: 2rem (32px), Weight 700, -0.01em letter-spacing
- **H3**: 1.75rem (28px), Weight 600
- **H4**: 1.5rem (24px), Weight 600
- **H5**: 1.25rem (20px), Weight 600
- **H6**: 1.125rem (18px), Weight 600

### Body Text
- **Body1**: 1rem (16px), Line-height 1.6
- **Body2**: 0.875rem (14px), Line-height 1.6
- **Button**: 0.875rem (14px), Weight 600, 0.02em letter-spacing

## 📐 Spacing & Layout

### Border Radius
- **Default**: 12px
- **Buttons**: 10px
- **Cards**: 16px
- **Chips**: 8px
- **Large Containers**: 20px

### Shadows
- **Elevation 1**: `0 1px 3px rgba(0,0,0,0.08)`
- **Elevation 2**: `0 4px 6px rgba(0,0,0,0.08)`
- **Elevation 3**: `0 10px 15px rgba(0,0,0,0.08)`
- **Elevation 4**: `0 20px 25px rgba(0,0,0,0.08)`

### Container Widths
- **xl**: 1536px (Dashboard, Settings)
- **lg**: 1280px
- **md**: 960px
- **sm**: 600px (Login page)

## 🎭 Component Styles

### Buttons
```tsx
- Padding: 10px 24px
- Border Radius: 10px
- Font Weight: 600
- No text transform (Natural case)
- Hover: Elevated shadow
- Transition: all 0.3s ease
```

### Cards
```tsx
- Border Radius: 16px
- Shadow: Subtle elevation
- Hover: Increased shadow + slight scale
- Transition: all 0.3s ease
```

### Stat Cards (Dashboard)
```tsx
- Height: 100%
- Gradient Background
- Icon: 36px in frosted glass container
- Numbers: h3, Weight 800, 2.5rem
- Hover: translateY(-8px) + scale(1.02)
- Shadow on hover: Large, colored
```

### Navigation Items
```tsx
- Border Radius: 12px
- Padding: 12px (vertical)
- Active: Indigo background (10%) + border
- Hover: Light background + border fade-in
- Icon: 40px min-width
- Font Weight: 700 (active), 500 (inactive)
```

### Tables
```tsx
- Header Background: #F8FAFC
- Header Text: Uppercase, 0.875rem, Weight 600
- Row Hover: Light background
- Cell Padding: 16px
```

### Chips (Role Badges)
```tsx
- Border Radius: 8px
- Height: 22px
- Font Size: 0.7rem
- Font Weight: 700
- Style: White bg + Primary border + Primary text
```

## 🌈 Gradients

### Brand Gradient
```css
linear-gradient(135deg, #6366F1 0%, #EC4899 100%)
```

### Background Gradients
```css
/* Login Background */
linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)

/* Sidebar */
linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%)

/* Card Accents */
linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(236,72,153,0.08) 100%)
```

### Stat Card Gradients
```css
/* Indigo */
linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)

/* Amber */
linear-gradient(135deg, #F59E0B 0%, #D97706 100%)

/* Blue */
linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)

/* Emerald */
linear-gradient(135deg, #10B981 0%, #059669 100%)
```

## ✨ Animations & Transitions

### Standard Transitions
```css
transition: all 0.2s ease; /* UI elements */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); /* Cards, buttons */
```

### Hover Effects
- **Cards**: translateY(-4px) to translateY(-8px)
- **Buttons**: Increased shadow
- **Navigation**: Background color fade + border
- **Activity Items**: translateX(6px)
- **Credential Cards**: translateY(-4px) + border color + shadow

### Loading States
- **CircularProgress**: 20px size in buttons
- **LinearProgress**: 12px height, rounded ends
- **Backdrop**: blur(20px) with opacity

## 📱 Responsive Breakpoints

- **xs**: 0px - Mobile phones
- **sm**: 600px - Small tablets
- **md**: 900px - Tablets  
- **lg**: 1200px - Desktops
- **xl**: 1536px - Large screens

### Sidebar Behavior
- Mobile (< sm): Temporary drawer overlay
- Desktop (≥ sm): Permanent drawer
- Width: 260px fixed

## 🎯 Design Patterns

### Glass Morphism (Login Page)
```tsx
backdropFilter: 'blur(20px)'
backgroundColor: 'rgba(255, 255, 255, 0.95)'
border: '1px solid rgba(255, 255, 255, 0.3)'
```

### Modern Card Pattern
```tsx
elevation={0}
border: '1px solid'
borderColor: 'divider'
borderRadius: 3 (24px)
```

### Hover Interaction Pattern
```tsx
cursor: 'pointer'
transition: 'all 0.2s ease'
'&:hover': {
  transform: 'translateY(-4px)',
  borderColor: 'primary.main',
  boxShadow: '...',
}
```

## 🎨 Inspiration

The design system is inspired by modern HR/recruitment platforms:
- **Greenhouse**: Clean cards, vibrant colors
- **Workday**: Professional typography, clear hierarchy
- **BambooHR**: Friendly gradients, smooth animations
- **Lever**: Modern stat cards, glassmorphism

## 📋 Implementation Checklist

✅ Created `theme.ts` with complete MUI theme
✅ Updated Login page with gradient background + glassmorphism
✅ Enhanced Dashboard stat cards with 3D hover effects
✅ Modernized sidebar with cleaner styling
✅ Improved Settings page with better typography
✅ Added Inter font family throughout
✅ Implemented consistent spacing system
✅ Applied smooth transitions everywhere
✅ Created modern component overrides
✅ Used semantic color scheme

## 🚀 Future Enhancements

- [ ] Add dark mode support
- [ ] Implement skeleton loaders
- [ ] Add micro-interactions (confetti, success animations)
- [ ] Create custom illustrations
- [ ] Add animated page transitions
- [ ] Implement advanced charts/graphs
- [ ] Add more gradient variations
- [ ] Create component library documentation

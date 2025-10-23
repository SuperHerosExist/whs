/**
 * Willard High School Tigers Branding Configuration
 *
 * This file contains all branding elements extracted from willardschools.net
 * Colors, typography, and design guidelines for the bowling team website
 */

export const branding = {
  school: {
    name: 'Willard High School',
    teamName: 'Tigers',
    fullName: 'Willard Tigers Bowling',
    motto: 'Focused. Connected. Driven.',
    tagline: 'Crafting Careers. Forging Futures.',
    address: '500 East Kime Street, Willard, MO 65781',
    phone: '(417) 742-2294',
    website: 'https://www.willardschools.net/',
  },

  colors: {
    // Primary school colors (conservative, professional palette)
    primary: {
      black: '#000000',         // Main school color
      taupe: '#c3c0be',        // Secondary school color (warm neutral)
    },

    // Tiger spirit colors (for accents only)
    tiger: {
      darkRed: '#8B0000',      // Dark red for tiger spirit
      gold: '#D4AF37',         // Gold for achievements/awards
    },

    // Neutral grays (for backgrounds and text)
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Semantic colors
    success: '#10b981',        // Green for achievements
    warning: '#f59e0b',        // Amber for alerts
    error: '#ef4444',          // Red for errors
    info: '#3b82f6',           // Blue for information
  },

  typography: {
    fontFamily: {
      display: ['Montserrat', 'Inter', 'sans-serif'],  // Bold headers
      body: ['Inter', 'system-ui', 'sans-serif'],      // Body text
    },
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
    },
  },

  layout: {
    maxWidth: '1280px',
    containerPadding: '1.5rem',
    borderRadius: {
      sm: '0.25rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      '2xl': '1.5rem',
    },
  },

  components: {
    // Button styles aligned with school branding
    button: {
      primary: {
        bg: '#000000',
        text: '#ffffff',
        hover: '#1f2937',
      },
      secondary: {
        bg: '#c3c0be',
        text: '#000000',
        hover: '#a8a5a3',
      },
      accent: {
        bg: '#8B0000',
        text: '#ffffff',
        hover: '#6B0000',
      },
    },

    // Card styles
    card: {
      bg: '#ffffff',
      border: '#e5e7eb',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },

    // Navigation
    nav: {
      bg: '#000000',
      text: '#ffffff',
      activeAccent: '#D4AF37',
    },
  },

  mascot: {
    name: 'Tigers',
    description: 'The Willard Tigers represent strength, determination, and excellence',
    colors: ['#000000', '#D4AF37'], // Black and gold
  },

  // Logos configuration
  logos: {
    primary: '/assets/logos/tiger-logo.jpg',
    secondary: '/assets/logos/W-logo.png',
    activeLogo: 'primary' as 'primary' | 'secondary', // Which logo to use by default
    fallback: '/assets/logos/tiger-logo.jpg', // Fallback if no logo is available
  },

  // Social media
  social: {
    facebook: 'https://www.facebook.com/groups/702783571642868',
    twitter: '',
    instagram: '',
  },

  // Contact information
  contact: {
    coach: {
      name: 'David Collins',
      email: 'willard.bowlingcoach@gmail.com',
      phone: '417-987-3551',
    },
  },
} as const;

export type Branding = typeof branding;

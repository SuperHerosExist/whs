/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Willard Schools Official Colors: BLACK, WHITE, GREY
        // Professional, bold, athletic design with monochrome palette
        willard: {
          // Primary: Pure black (school color)
          black: '#000000',
          // Secondary: Warm taupe (official Willard color)
          taupe: '#c3c0be',
          // Accent: White for contrast
          white: '#FFFFFF',
          // Grey scale for depth and sophistication
          grey: {
            50: '#FAFAFA',    // Almost white - backgrounds
            100: '#F5F5F5',   // Light grey - subtle backgrounds
            200: '#E5E5E5',   // Lighter grey - borders
            300: '#D4D4D4',   // Light grey - dividers
            400: '#A3A3A3',   // Medium grey - muted text
            500: '#737373',   // Grey - secondary text
            600: '#525252',   // Dark grey - primary text
            700: '#404040',   // Darker grey - headings
            800: '#262626',   // Very dark grey - strong elements
            900: '#171717',   // Almost black - deep contrast
          },
        },
        // Tiger theme (for components using tiger- prefix)
        tiger: {
          'primary-black': '#000000',
          'primary-taupe': '#c3c0be',
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
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'tiger': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'tiger-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'tiger-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'tiger-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-30px) rotate(5deg)' },
        },
        spin: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'float-slow': 'float-slow 4s ease-in-out infinite',
        'spin-slow': 'spin 10s linear infinite',
      },
    },
  },
  plugins: [],
}

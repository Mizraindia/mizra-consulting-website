import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // "primary" and "beige" are used by the older pages (About, Contact, master
        // classes, legal pages). They now map to the brand violet palette, so those
        // pages match the new design without any wording changes.
        primary: {
          50: '#F5F2FB',
          100: '#EDE7F7',
          200: '#DDD3EE',
          300: '#C9BEE0',
          400: '#8B6CC7',
          500: '#4C1D95', // brand accent violet
          600: '#33007A',
          700: '#2A0F52',
          800: '#1F0A40',
          900: '#1A0036',
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
          900: '#1A0036', // brand ink, for headings on the older pages
        },
        beige: {
          50: '#FBFAFD',
          100: '#F1EEF8',
          200: '#E4DFEE',
          300: '#D4CCE4',
          400: '#C9BEE0',
        },
        // Brand colours from the approved design (docs/revamp/design/Main.dc.html)
        mz: {
          ink: '#1A0036',
          night: '#2A0F52',
          line: '#46307A',
          deep: '#33007A',
          accent: '#4C1D95',
          amber: '#F8A90B',
          cream: '#F8F7FB',
          soft: '#F1EEF8',
          lilac: '#C9BEE0',
          mist: '#DDD3EE',
          chip: '#D4CCE4',
          border: '#E4DFEE',
          body: '#4A4062',
          muted: '#574D70',
          field: '#8B82A3',
        },
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-body)', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-in': 'slideIn 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

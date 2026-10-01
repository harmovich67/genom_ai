/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        genome: {
          bg: '#07090E',
          surface: '#0D121F',
          card: '#12192B',
          cardHover: '#182138',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
          emerald: '#10B981',
          emeraldMuted: 'rgba(16, 185, 129, 0.15)',
          purple: '#8B5CF6',
          purpleMuted: 'rgba(139, 92, 246, 0.15)',
          cyan: '#06B6D4',
          cyanMuted: 'rgba(6, 182, 212, 0.15)',
          amber: '#F59E0B',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        sans: ['Alexandria', 'IBM Plex Sans Arabic', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Alexandria', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'tactile': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'tactile-hover': '0 12px 30px -4px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.15)',
        'glow-emerald': '0 0 25px -3px rgba(16, 185, 129, 0.3)',
        'glow-purple': '0 0 25px -3px rgba(139, 92, 246, 0.3)',
        'glow-cyan': '0 0 25px -3px rgba(6, 182, 212, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}

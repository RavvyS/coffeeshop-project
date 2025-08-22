module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Coffee Shop Brand Colors
        coffee: {
          50: '#fdf8f3',
          100: '#f8ead1',
          200: '#f1d0a3',
          300: '#e8b075',
          400: '#de8b47',
          500: '#d67329', // Primary coffee color
          600: '#b85d1f',
          700: '#9a4919',
          800: '#7c3914',
          900: '#5e2b10',
        },
        cream: {
          50: '#fefcf8',
          100: '#fef7e7',
          200: '#fcecc7',
          300: '#f9dc9f',
          400: '#f5c576',
          500: '#f0a84d',
          600: '#d8903d',
          700: '#b8732d',
          800: '#95581e',
          900: '#6f4015',
        },
        // Status Colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'coffee': '0 4px 20px -2px rgba(214, 115, 41, 0.2)',
      },
    },
  },
  plugins: [
  require('@tailwindcss/forms'),
  require('@tailwindcss/typography'),
  ],
}
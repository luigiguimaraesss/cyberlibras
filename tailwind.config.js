/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#101827',
        surface: { DEFAULT: '#172338', raised: '#1E2D47' },
        brand: { DEFAULT: '#2563EB', light: '#60A5FA' },
        ok: { DEFAULT: '#16A34A', light: '#4ADE80' },
        bad: { DEFAULT: '#DC2626', light: '#F87171' },
        ink: { DEFAULT: '#F8FAFC', soft: '#CBD5E1' },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(2, 6, 23, 0.6)',
        glow: '0 8px 24px -8px rgba(37, 99, 235, 0.6)',
      },
    },
  },
  plugins: [],
};

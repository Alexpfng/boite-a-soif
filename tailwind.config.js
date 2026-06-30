/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'bleu-900': 'var(--bleu-900)',
        'bleu-700': 'var(--bleu-700)',
        'bleu-500': 'var(--bleu-500)',
        'bleu-100': 'var(--bleu-100)',
        'orange-600': 'var(--orange-600)',
        'orange-400': 'var(--orange-400)',
        'orange-100': 'var(--orange-100)',
        'sable-50': 'var(--sable-50)',
        'vert-ok': 'var(--vert-ok)',
        'rouge-non': 'var(--rouge-non)',
        texte: 'var(--texte)',
        'texte-2': 'var(--texte-2)',
        surface: 'var(--surface)',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        carte: '20px',
      },
      boxShadow: {
        carte: '0 2px 12px rgba(14, 58, 77, 0.08)',
      },
    },
  },
  plugins: [],
};

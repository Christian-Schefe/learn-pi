/** @type {import('tailwindcss').Config} */
export default {
  content: ['./indeex.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      gridTemplateColumns: {
        15: 'repeat(15, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
};

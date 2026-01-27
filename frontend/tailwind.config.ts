import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#A50034',
          secondary: '#1D1D1D',
        },
        state: {
          initial: '#3b82f6',
          deep: '#8b5cf6',
          reachable: '#10b981',
        },
        status: {
          strengthening: '#10b981',
          maintaining: '#f59e0b',
          weakening: '#ef4444',
        },
        signal: {
          green: '#10b981',
          yellow: '#f59e0b',
          orange: '#f97316',
          red: '#ef4444',
        },
      },
    },
  },
  plugins: [],
};

export default config;

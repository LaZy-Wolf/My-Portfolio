import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        substrate: {
          DEFAULT: '#0a0a0a',
          surface: '#121212',
          elevated: '#1a1a1a',
        },
        signal: {
          DEFAULT: '#e61919', // Aviation/Hazard Red
          dim: '#991111',
          bright: '#ff2a2a',
        },
        terminal: {
          DEFAULT: '#4af626', // Monospace Phosphor Green
          dim: '#2b9e15',
        },
        telemetry: {
          border: '#262626',
          muted: '#737373',
          faint: '#404040',
        },
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'monospace'],
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        none: '0px', // Strict 90-degree corners per industrial-brutalist spec
      },
    },
  },
  plugins: [],
};

export default config;

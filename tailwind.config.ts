import type { Config } from 'tailwindcss';

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: ['selector', '[data-theme="dark"]'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Public site: the line map. Values live in globals.css (day and night maps).
        paper: { DEFAULT: token('paper'), raised: token('paper-raised') },
        ink: { DEFAULT: token('ink'), 2: token('ink-2'), 3: token('ink-3') },
        rule: { DEFAULT: token('rule'), strong: token('rule-strong') },
        line: {
          red: token('line-red'),
          blue: token('line-blue'),
          green: token('line-green'),
          amber: token('line-amber'),
          violet: token('line-violet'),
        },

        // Admin panel (unchanged).
        substrate: {
          DEFAULT: '#0a0a0a',
          surface: '#121212',
          elevated: '#1a1a1a',
        },
        signal: {
          DEFAULT: '#e61919',
          dim: '#991111',
          bright: '#ff2a2a',
        },
        terminal: {
          DEFAULT: '#4af626',
          dim: '#2b9e15',
        },
        telemetry: {
          border: '#262626',
          muted: '#737373',
          faint: '#404040',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        hand: ['var(--font-hand)', 'cursive'],
        display: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.23, 1, 0.32, 1)',
      },
      zIndex: {
        nav: '40',
        assistant: '50',
        palette: '60',
      },
    },
  },
  plugins: [],
};

export default config;

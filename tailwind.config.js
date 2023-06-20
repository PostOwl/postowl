import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    fontFamily: {
      sans: ['Jost', 'system-ui']
    },
    extend: {
      typography: {
        DEFAULT: {
          css: {
            blockquote: {
              fontWeight: 'normal',
              fontStyle: 'normal',
              color: '',
              borderLeftWidth: '0.25rem',
              borderLeftColor: 'var(--tw-prose-quote-borders)',
              quotes: ''
            },
            'blockquote p:first-of-type::before': {
              content: ''
            },
            'blockquote p:last-of-type::after': {
              content: ''
            }
          }
        }
      }
    }
  },
  plugins: [forms, typography]
};

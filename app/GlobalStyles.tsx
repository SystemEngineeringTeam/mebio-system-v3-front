import { GlobalStyles as RestyleGlobalStyles } from 'restyle';

export default function GlobalStyles() {
  return (
    <RestyleGlobalStyles>
      {{
        '*': {
          'margin': 'unset',
          'padding': 'unset',
          'boxSizing': 'border-box',

          '--primary-color': '#1890FF',
          '--on-primary-color': '#ffffff',
          '--text-color': '#1c1c1c',
          '--background-color': '#ffffff',
          '--background-color-dark': '#f0f2f5',
          '--on-background-color': '#002766',
          '--shadow-color': 'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',

          '--fontsize-xs': '0.6rem',
          '--fontsize-sm': '0.8rem',
          '--fontsize-md': '1rem',
          '--fontsize-lg': '1.2rem',
          '--fontsize-xl': '1.6rem',

          '--radius-xs': '2px',
          '--radius-sm': '4px',
          '--radius-md': '8px',
          '--radius-lg': '16px',

          '--header-height': '50px',
        },
        ':root': {
          fontSize: '16px',
        },
        'header': {
          height: 'var(--header-height)',
        },
        'main': {
          minHeight: 'calc(100vh - var(--header-height))',
        },
        'main:has([data-scrollable="false"])': {
          height: 'calc(100vh - var(--header-height))',
        },
      }}
    </RestyleGlobalStyles>
  );
}

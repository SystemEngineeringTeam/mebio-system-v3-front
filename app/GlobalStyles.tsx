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
          '--background-color': '#ffffff',
          '--on-background-color': '#002766',

          '--fontsize-xs': '0.6rem',
          '--fontsize-sm': '0.8rem',
          '--fontsize-md': '1rem',
          '--fontsize-lg': '1.2rem',
          '--fontsize-xl': '1.6rem',

          '--radius-xs': '2px',
          '--radius-sm': '4px',
          '--radius-md': '8px',
          '--radius-lg': '16px',

          '--header-height': '45px',
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

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
      }}
    </RestyleGlobalStyles>
  );
}

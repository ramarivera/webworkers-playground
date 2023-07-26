import React from 'react';

import type { Preview } from '@storybook/react';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { withThemeFromJSXProvider } from '@storybook/addon-styling';
import { lightTheme, darkTheme } from '../src/core/ui/Themes';
import { RecoilRoot } from 'recoil';
import { NotificationsContainer } from '../src/core/notifications/NotificationsContainer';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  decorators: [
    // Adds global styles and theme switching support.
    withThemeFromJSXProvider({
      GlobalStyles: CssBaseline,
      themes: {
        light: lightTheme,
        dark: darkTheme,
      },
      defaultTheme: 'light',
      Provider: ThemeProvider,
    }),

    // Adds Recoil state management support.
    (Story) => (
      <RecoilRoot>
        <NotificationsContainer>
          <Story />
        </NotificationsContainer>
      </RecoilRoot>
    ),
  ],
};

export default preview;

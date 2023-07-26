import { PropsWithChildren } from 'react';

import { ThemeProvider } from '@mui/material/styles';
import { RecoilRoot } from 'recoil';

import { NotificationsContainer } from './notifications/NotificationsContainer';
import { lightTheme } from './ui/Themes';

export const AppWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider theme={lightTheme}>
      <RecoilRoot>
        <NotificationsContainer>{children}</NotificationsContainer>
      </RecoilRoot>
    </ThemeProvider>
  );
};

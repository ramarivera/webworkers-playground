import React from 'react';

import { Decorator } from '@storybook/react';

export const withRedBorder: Decorator = (Story) => (
  <div
    style={{ border: '2px solid red', borderRadius: '5px', padding: '10px' }}
  >
    <Story />
  </div>
);

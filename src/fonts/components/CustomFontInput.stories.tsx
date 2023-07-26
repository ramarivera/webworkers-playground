// Write a StoryBook story for the CustomFontInput component.

// Write a CustomFontInput.stories.tsx file that contains a story for the CustomFontInput component.

import { Meta, StoryObj } from '@storybook/react';

import { CustomFontInput } from './CustomFontInput';

const meta = {
  title: 'Example/CustomFontInput',
  component: CustomFontInput,
  argTypes: {
    onFontRegistered: {
      table: {
        disable: true,
      },
    },
    isLoading: { control: 'boolean' },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof CustomFontInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const Empty: Story = {
  args: {
    initialValues: {
      name: '',
      url: '',
      displayName: '',
      isBold: false,
      isItalic: false,
    },
    isLoading: false,
    onFontRegistered: () => {},
  },
};

export const Loading: Story = {
  ...Empty,
  args: {
    ...Empty.args,
    isLoading: true,
  },
};

export const WithFontRegistering: Story = {
  ...Empty,
  args: {
    ...Empty.args,
    onFontRegistered: (url, isBold, isItalic) => {
      alert(`Registered font ${url} bold: ${isBold} italic: ${isItalic}`);
    },
  },
};

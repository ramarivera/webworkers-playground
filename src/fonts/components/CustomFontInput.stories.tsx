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

export const Empty: Story = {
  args: {
    onFontRegistered: () => {},
    isLoading: false,
  },
};

export const Loading: Story = {
  ...Empty,
  args: {
    ...Empty.args,
    isLoading: true,
  },
};

export const WithFont: Story = {
  ...Empty,
  args: {
    ...Empty.args,
    onFontRegistered: (url, isBold, isItalic) => {
      alert(`Registered font ${url} bold: ${isBold} italic: ${isItalic}`);
    },
  },
};

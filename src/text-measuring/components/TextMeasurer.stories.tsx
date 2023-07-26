import { Meta, StoryObj } from '@storybook/react';

import { TextMeasurer } from './TextMeasurer';

const meta = {
  title: 'Example/TextMeasurer',
  component: TextMeasurer,
  argTypes: {
    text: { control: 'text' },
    measurementResult: {
      table: {
        disable: true,
      },
    },
    onMeasureClicked: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TextMeasurer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    text: '',
    cssFontString: '',
    measurementResult: null,
    isLoading: false,
    onMeasureClicked: () => {},
  },
};

export const HelloWorld: Story = {
  ...Empty,
  args: {
    ...Empty.args,
    text: 'Hello World',
  },
};

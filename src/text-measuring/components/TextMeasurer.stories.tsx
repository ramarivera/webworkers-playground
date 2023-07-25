import { Meta, StoryObj } from '@storybook/react';
import { TextMeasurer } from './TextMeasurer';

const meta = {
  title: 'Example/TextMeasurer',
  component: TextMeasurer,
  argTypes: {
    initialText: { control: 'text' },
    measurerType: {
      control: 'select',
      options: ['canvas', 'offscreen-canvas', 'html'],
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
    initialText: '',
    measurerType: 'canvas',
  },
};

export const HelloWorld: Story = {
  ...Empty,
  args: {
    ...Empty.args,
    initialText: 'Hello World',
  },
};

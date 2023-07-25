import { Meta, StoryObj } from '@storybook/react';
import { TextMeasurer } from './TextMeasurer';

const meta = {
  title: 'Example/TextMeasurer',
  component: TextMeasurer,
  argTypes: {
    initialText: { control: 'text' },
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
  },
};

export const HelloWorld: Story = {
  args: {
    initialText: 'Hello World',
  },
};

import { Meta, StoryObj } from '@storybook/react';
import { TextMeasurer, TextMeasurerProps } from './TextMeasurer';

const meta = {
  title: 'Example/TextMeasurer',
  component: TextMeasurer,
  argTypes: {
    text: { control: 'text' },
  },
} satisfies Meta<typeof TextMeasurer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    text: '',
  },
};

export const HelloWorld: Story = {
  args: {
    text: 'Hello World',
  },
};

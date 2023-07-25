import { Meta, StoryObj } from '@storybook/react';
import { TextMeasurerUI } from './TextMeasurerUI';

const meta = {
  title: 'Example/TextMeasurerUI',
  component: TextMeasurerUI,
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
} satisfies Meta<typeof TextMeasurerUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    text: '',
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

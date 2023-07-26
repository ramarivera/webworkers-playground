import { Meta, StoryObj } from '@storybook/react';

import {
  PREDEFINED_FONTS,
  CUSTOM_FONT_DISPLAY_KEY,
} from '../../fonts/constants';

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
    selectedFont: {
      control: 'select',
      options: [
        ...PREDEFINED_FONTS.map((fontData) => fontData.display),
        CUSTOM_FONT_DISPLAY_KEY,
      ],
    },
    customFontUrl: {
      control: 'text',
      if: { arg: 'selectedFont', eq: CUSTOM_FONT_DISPLAY_KEY },
    },
    customFontIsBold: {
      control: 'boolean',
      if: { arg: 'selectedFont', eq: CUSTOM_FONT_DISPLAY_KEY },
    },
    customFontIsItalic: {
      control: 'boolean',
      if: { arg: 'selectedFont', eq: CUSTOM_FONT_DISPLAY_KEY },
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
    selectedFont: PREDEFINED_FONTS[0].display,
  },
};

export const HelloWorld: Story = {
  ...Empty,
  args: {
    ...Empty.args,
    initialText: 'Hello World',
  },
};

export const WithBangers: Story = {
  ...Empty,
  args: {
    ...Empty.args,
    initialText: 'Testing BANGERS',
    selectedFont: CUSTOM_FONT_DISPLAY_KEY,
    customFontUrl:
      'https://fonts.googleapis.com/css2?family=Bangers&display=swap',
    customFontIsItalic: false,
    customFontIsBold: false,
  },
};

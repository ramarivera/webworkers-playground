import { Meta, StoryObj } from '@storybook/react';

import {
  PREDEFINED_FONTS,
  CUSTOM_FONT_DISPLAY_KEY,
} from '../../fonts/constants';
import {
  convertPredefinedFontToFontRegistrationData,
  generateIdForFontRegistrationData,
} from '../../fonts/utils';

import { TextMeasurerPage } from './TextMeasurerPage';

const availableFonts = PREDEFINED_FONTS.map((font) => {
  const fontData = convertPredefinedFontToFontRegistrationData(font);

  return {
    ...fontData,
    id: generateIdForFontRegistrationData(fontData),
  };
});

const meta = {
  title: 'Example/TextMeasurerPage',
  component: TextMeasurerPage,
  argTypes: {
    initialText: { control: 'text' },
    measurerType: {
      control: 'select',
      options: ['canvas', 'offscreen-canvas', 'html'],
    },
    selectedFontId: {
      control: 'select',
      options: availableFonts.map((font) => font.id),
    },
    customFontsEnabled: {
      control: 'boolean',
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
} satisfies Meta<typeof TextMeasurerPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    initialText: '',
    measurerType: 'canvas',
    selectedFontId: availableFonts[0].id,
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
    customFontsEnabled: true,
    customFontUrl:
      'https://fonts.googleapis.com/css2?family=Bangers&display=swap',
    customFontIsItalic: false,
    customFontIsBold: false,
  },
};

import { Meta, StoryObj } from '@storybook/react';

import { withRedBorder } from '../../core/utils/storybook';
import { DEFAULT_FONT_SIZE, PREDEFINED_FONTS } from '../constants';
import {
  convertPredefinedFontToFontRegistrationData,
  generateIdForFontRegistrationData,
} from '../utils';

import { FontInput } from './FontInput';

const meta = {
  title: 'Example/FontList',
  component: FontInput,
  argTypes: {
    fonts: {
      table: {
        disable: true,
      },
    },
    fontSize: {
      control: 'number',
    },
    onFontSelected: {
      table: {
        disable: true,
      },
    },
    onFontSizeChanged: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [withRedBorder],
} satisfies Meta<typeof FontInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const Empty: Story = {
  args: {
    fonts: [],
    fontSize: DEFAULT_FONT_SIZE,
    onFontSelected: () => {},
    onFontSizeChanged: () => {},
  },
};

export const StaticFonts: Story = {
  ...Empty,
  args: {
    ...Empty.args,
    fonts: PREDEFINED_FONTS.map((font) => {
      const fontData = convertPredefinedFontToFontRegistrationData(font);
      return {
        ...fontData,
        id: generateIdForFontRegistrationData(fontData),
      };
    }),
  },
};

export const WithAlert: Story = {
  ...StaticFonts,
  args: {
    ...StaticFonts.args,
    onFontSelected: (fontData) => {
      alert(
        `Font selected ${fontData.displayName}(${fontData.id}) bold: ${fontData.isBold} italic: ${fontData.isItalic}}`,
      );
    },
  },
};

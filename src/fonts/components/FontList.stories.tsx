import { Meta, StoryObj } from '@storybook/react';

import { withRedBorder } from '../../core/utils/storybook';
import { PREDEFINED_FONTS } from '../constants';
import {
  convertPredefinedFontToFontRegistrationData,
  generateIdForFontRegistrationData,
} from '../utils';

import { FontList } from './FontList';

const meta = {
  title: 'Example/FontList',
  component: FontList,
  argTypes: {
    fonts: {
      table: {
        disable: true,
      },
    },
    onFontSelected: {
      table: {
        disable: true,
      },
    },
  },
  parameters: {
    layout: 'centered',
  },
  decorators: [withRedBorder],
} satisfies Meta<typeof FontList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    fonts: [],
    onFontSelected: () => {},
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

import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';

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

function getParentElementUntilBody(element: HTMLElement): HTMLElement | null {
  if (element.tagName === 'BODY') {
    return element;
  }

  const parentElement = element.parentElement;

  if (!parentElement) {
    return null;
  }

  return getParentElementUntilBody(parentElement);
}

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

export const NormalFlowAutoplay: Story = {
  ...Empty,
  args: {
    ...Empty.args,
    initialText: 'Hello World',
  },
  async play({ canvasElement, step }) {
    const canvas = within(canvasElement);

    await step('Component is ready', async () => {
      await waitFor(
        () => {
          expect(canvas.getByText('Welcome')).toBeVisible();
        },
        { timeout: 5000 },
      );
    });

    await step('Select "Roboto bold italic"', async () => {
      const maybeDocument = getParentElementUntilBody(canvasElement);

      if (!maybeDocument) {
        throw new Error('Could not find document element');
      }

      const document = within(maybeDocument);

      await userEvent.click(canvas.getByLabelText('Font'));

      const listBox = document.getByRole('listbox');

      await waitFor(() => {
        expect(listBox).toBeVisible();
      });

      await userEvent.click(within(listBox).getByText('Roboto (italic bold)'));
    });

    await step('Type "Canvas basics"', async () => {
      await userEvent.clear(canvas.getByLabelText('Text to measure:'));
      await userEvent.type(
        canvas.getByLabelText('Text to measure:'),
        'Canvas basics',
      );
    });

    await step('Click on "Measure"', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Measure' }));
    });

    await step('Compare results', async () => {
      expect(canvas.getByLabelText('Measurement result:')).toHaveValue(
        '85.2578125',
      );
    });
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

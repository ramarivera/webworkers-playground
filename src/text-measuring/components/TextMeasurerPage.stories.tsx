/* eslint-disable storybook/context-in-play-function */
import { expect } from '@storybook/jest';
import { Meta, StoryObj } from '@storybook/react';
import { userEvent, waitFor, within } from '@storybook/testing-library';

import { PREDEFINED_FONTS } from '../../fonts/predefinedFonts';
import {
  convertPredefinedFontToFontRegistrationData,
  generateIdForFontRegistrationData,
} from '../../fonts/utils';
import { TEXT_MEASURER_TYPES } from '../measurers/types';

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
      options: TEXT_MEASURER_TYPES,
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
      if: { arg: 'customFontsEnabled', truthy: true },
    },
    customFontIsBold: {
      control: 'boolean',
      if: { arg: 'customFontsEnabled', truthy: true },
    },
    customFontIsItalic: {
      control: 'boolean',
      if: { arg: 'customFontsEnabled', truthy: true },
    },
    initialFontSize: {
      control: 'number',
    },
  },
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TextMeasurerPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const Empty: Story = {
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

const NormalFlowAutoplay: Story = {
  ...HelloWorld,
  args: {
    ...HelloWorld.args,
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

export const NormalFlowDocumentCanvas: Story = {
  ...HelloWorld,
  args: {
    ...HelloWorld.args,
    measurerType: 'canvas',
  },
  async play(context) {
    return await NormalFlowAutoplay.play?.(context);
  },
};

export const NormalFlowOffscreenCanvas: Story = {
  ...HelloWorld,
  args: {
    ...HelloWorld.args,
    measurerType: 'offscreen-canvas',
  },
  async play(context) {
    return await NormalFlowAutoplay.play?.(context);
  },
};

export const CustomFontPanel: Story = {
  ...HelloWorld,
  args: {
    ...HelloWorld.args,
    customFontsEnabled: true,
    customFontUrl: 'https://fonts.cdnfonts.com/s/15017/Bangers-Regular.woff',
    customFontIsItalic: false,
    customFontIsBold: false,
    measurerParams: {
      canvasTransferMode: 'created',
    },
  },
};

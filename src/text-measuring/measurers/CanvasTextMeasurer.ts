/* eslint-disable @typescript-eslint/no-use-before-define */
import { isDefined } from '../../core/utils/assertions';
import { buildCssStringForFont } from '../../fonts/utils';

import { TextMeasurerInterface } from './types';

export class CanvasTextMeasurer implements TextMeasurerInterface {
  private text: string;
  private font: string;
  private size: number;
  private bold: boolean;
  private italic: boolean;
  private canvasContext: CanvasRenderingContext2D | null;
  private cache = new Map<string, number>();

  constructor() {
    this.text = '';
    this.font = '';
    this.size = 0;
    this.bold = false;
    this.italic = false;
    this.canvasContext = null;
  }

  withText(text: string) {
    this.text = text;
    return this;
  }

  withFont(font: string) {
    this.font = font;
    return this;
  }

  withSize(size: number) {
    this.size = size;
    return this;
  }

  withBold(bold: boolean = true) {
    this.bold = bold;
    return this;
  }

  withItalic(italic: boolean = true) {
    this.italic = italic;
    return this;
  }

  withCanvasContext(canvasContext: CanvasRenderingContext2D) {
    this.canvasContext = canvasContext;
    return this;
  }

  // This method must be called last, to return the calculated width of the text.
  calculateWidth() {
    const fontString = buildCssStringForFont(
      this.font,
      this.bold,
      this.italic,
      this.size,
    );

    const key = `${fontString}<>!&%${this.text}`;

    // If the cache does not contain the key (fontString + text), then calculate the width and add it to the cache.
    if (!this.cache.has(key)) {
      this.cache.set(key, this.doWidthCalculation(this.text, fontString));
    }

    return this.cache.get(key)!;
  }

  // Calculate the width of the text using the canvasContext.measureText() method.
  private doWidthCalculation(text: string, font: string) {
    isDefined(this.canvasContext, 'Canvas context is not set');

    this.canvasContext.font = font;
    return this.canvasContext.measureText(text).width;
  }
}

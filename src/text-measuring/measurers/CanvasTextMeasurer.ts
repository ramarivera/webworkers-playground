/* eslint-disable @typescript-eslint/no-use-before-define */
import { isDefined } from '../../core/utils/assertions';
import { buildCssStringForFont } from '../../fonts/utils';

import { BaseTextMeasurer } from './BaseTextMeasurer';
import { TextMeasurerInterface } from './types';

export type RenderingContext =
  | CanvasRenderingContext2D
  | OffscreenCanvasRenderingContext2D;

export class CanvasTextMeasurer
  extends BaseTextMeasurer
  implements TextMeasurerInterface
{
  private canvasContext: RenderingContext | null;
  private cache = new Map<string, number>();

  constructor() {
    super();
    this.canvasContext = null;
  }

  withCanvasContext(canvasContext: RenderingContext) {
    this.canvasContext = canvasContext;
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyParams?(params?: Record<string, unknown>): void {}

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

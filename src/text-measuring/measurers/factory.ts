import { CanvasTextMeasurer } from './CanvasTextMeasurer';
import { TextMeasurerInterface, TextMeasurerType } from './types';

export function getTextMeasurer(type: TextMeasurerType): TextMeasurerInterface {
  switch (type) {
    case 'canvas': {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      return new CanvasTextMeasurer().withCanvasContext(context);
    }
    // case 'offscreen-canvas':
    //   return new OffscreenCanvasTextMeasurer();
    // case 'html':
    //   return new HtmlTextMeasurer();
  }

  throw new Error(`Unknown text measurer type: ${type}`);
}

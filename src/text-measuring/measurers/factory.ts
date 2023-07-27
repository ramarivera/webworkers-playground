import { Services } from '../../Services';

import { CanvasTextMeasurer } from './CanvasTextMeasurer';
import { TextMeasurerInterface, TextMeasurerType } from './types';
import { WebWorkerTextMeasurer } from './WebWorkerTextMeasurer';

export function getTextMeasurer(type: TextMeasurerType): TextMeasurerInterface {
  switch (type) {
    case 'canvas': {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      console.log(canvas.width, canvas.height);
      return new CanvasTextMeasurer().withCanvasContext(context);
    }
    case 'offscreen-canvas': {
      const canvas = new OffscreenCanvas(300, 150);
      const context = canvas.getContext('2d')!;
      return new CanvasTextMeasurer().withCanvasContext(context);
    }
    case 'webworker': {
      return new WebWorkerTextMeasurer()
        .withCanvasFactory(() => new OffscreenCanvas(300, 150))
        .withWorkersService(Services.TextMeasurerWorkersService);
    }
  }

  throw new Error(`Unknown text measurer type: ${type}`);
}

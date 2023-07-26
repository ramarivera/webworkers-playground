/* eslint-disable @typescript-eslint/no-use-before-define */
import { isDefined } from '../../core/utils/assertions';
import {
  isCanvasDetached,
  isMessageOfType,
  postTypedMessage,
} from '../../webworkers/utils';

import { BaseTextMeasurer } from './BaseTextMeasurer';
import { TextMeasurerInterface } from './types';

export interface WorkerMessage {
  message: string;
  result?: number;
}

export class WebWorkerTextMeasurer
  extends BaseTextMeasurer
  implements TextMeasurerInterface
{
  private canvasFactory: (() => OffscreenCanvas) | null;

  constructor() {
    super();
    this.canvasFactory = null;
  }

  withCanvasFactory(canvasFactory: () => OffscreenCanvas) {
    this.canvasFactory = canvasFactory;
    return this;
  }

  // This method must be called last, to return the calculated width of the text.
  calculateWidth() {
    isDefined(this.canvasFactory, 'CanvasFactory is not set');

    const canvas = this.canvasFactory();

    if (isCanvasDetached(canvas)) {
      throw new Error('Canvas is detached');
    }

    const worker = new Worker(
      new URL('../../webworkers/workers/SimpleWebWorker.ts', import.meta.url),
      { type: 'module' },
    );

    return new Promise<number>((resolve, reject) => {
      isDefined(canvas, 'Canvas is not defined');

      worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
        if (isMessageOfType(event, 'measureText:result')) {
          resolve(event.data.params.result as number);
          return;
        }
      };

      worker.onerror = (error) => {
        reject(error);
      };

      postTypedMessage(
        worker,
        'measureText',
        {
          text: this.text,
          font: this.font,
          size: this.size,
          bold: this.bold,
          italic: this.italic,
          canvas: canvas,
          canvasMode: 'transferred',
        },
        [canvas],
      );
    });
  }
}

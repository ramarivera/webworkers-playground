/* eslint-disable @typescript-eslint/no-use-before-define */
import { isDefined } from '../../core/utils/assertions';
import {
  isCanvasDetached,
  isMessageOfType,
  postTypedMessage,
} from '../../webworkers/utils';
import { WorkersService } from '../../webworkers/WorkersService';

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
  private workerService: WorkersService | null;

  constructor() {
    super();
    this.canvasFactory = null;
    this.workerService = null;
  }

  withCanvasFactory(canvasFactory: () => OffscreenCanvas) {
    this.canvasFactory = canvasFactory;
    return this;
  }

  withWorkersService(workerService: WorkersService) {
    this.workerService = workerService;
    return this;
  }

  // This method must be called last, to return the calculated width of the text.
  calculateWidth() {
    isDefined(this.canvasFactory, 'CanvasFactory is not set');
    isDefined(this.workerService, 'WorkerService is not set');

    const canvas = this.canvasFactory();

    if (isCanvasDetached(canvas)) {
      throw new Error('Canvas is detached');
    }

    const worker = this.workerService.getWorker();

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

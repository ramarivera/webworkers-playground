/* eslint-disable @typescript-eslint/no-use-before-define */
import { isDefined } from '../../core/utils/assertions';
import { Services } from '../../Services';
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
  private canvasTransferMode: string | null;

  constructor() {
    super();
    this.canvasFactory = null;
    this.workerService = null;
    this.canvasTransferMode = null;
  }

  withCanvasFactory(canvasFactory: () => OffscreenCanvas) {
    this.canvasFactory = canvasFactory;
    return this;
  }

  withWorkersService(workerService: WorkersService) {
    this.workerService = workerService;
    return this;
  }

  applyParams?(params?: Record<string, unknown>): void {
    if (!params) {
      return;
    }

    if ('canvasTransferMode' in params) {
      this.canvasTransferMode = params.canvasTransferMode as string;
    }
  }

  // This method must be called last, to return the calculated width of the text.
  async calculateWidth() {
    isDefined(this.canvasFactory, 'CanvasFactory is not set');
    isDefined(this.workerService, 'WorkerService is not set');

    const canvas = this.canvasFactory();

    if (isCanvasDetached(canvas)) {
      throw new Error('Canvas is detached');
    }

    const worker = this.workerService.getWorker();

    await this.waitForFontSynchronization(worker);

    return await this.waitForTextMeasurement(worker, canvas);
  }

  private async waitForTextMeasurement(
    worker: Worker,
    canvas: OffscreenCanvas,
  ) {
    return new Promise<number>((resolve, reject) => {
      isDefined(canvas, 'Canvas is not defined');

      worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
        if (isMessageOfType(event, 'measureText:result')) {
          resolve(event.data.params.result);
          return;
        }
      };

      worker.onerror = (error) => {
        reject(error);
      };

      if (this.canvasTransferMode === 'transferred') {
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
      } else {
        postTypedMessage(worker, 'measureText', {
          text: this.text,
          font: this.font,
          size: this.size,
          bold: this.bold,
          italic: this.italic,
          canvasMode: 'created',
        });
      }
    });
  }

  private async waitForFontSynchronization(worker: Worker) {
    isDefined(this.workerService, 'WorkerService is not set');

    const fonts = await Services.FontRegistry.getFontsData();

    return new Promise<void>((resolve, reject) => {
      worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
        if (isMessageOfType(event, 'fonts:synchronize:result')) {
          resolve();
          return;
        }
      };

      worker.onerror = (error) => {
        reject(error);
      };

      postTypedMessage(worker, 'fonts:synchronize', {
        fonts: fonts.map((font) => ({
          fontName: font.font,
          url: font.url,
          isBold: font.isBold,
          isItalic: font.isItalic,
        })),
      });
    });
  }
}

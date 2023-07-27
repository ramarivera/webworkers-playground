/* eslint-disable @typescript-eslint/no-use-before-define */
import { isDefined } from '../../core/utils/assertions';
import { Services } from '../../Services';
import { isCanvasDetached } from '../../webworkers/utils';
import { handleMessageFromMainThread } from '../../webworkers/workers/worker-utils';
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

    const worker = await this.workerService.getWorker();

    await this.waitForFontSynchronization(worker);

    const results = await this.waitForTextMeasurementResult(worker, canvas);

    return results.result;
  }

  private async waitForTextMeasurementResult(
    worker: Worker,
    canvas: OffscreenCanvas,
  ) {
    const commonParams = {
      text: this.text,
      font: this.font,
      size: this.size,
      bold: this.bold,
      italic: this.italic,
    };

    if (this.canvasTransferMode === 'transferred') {
      return handleMessageFromMainThread(
        worker,
        'measureText',
        {
          ...commonParams,
          canvas: canvas,
          canvasMode: 'transferred',
        },
        undefined,
        [canvas],
      );
    } else {
      return handleMessageFromMainThread(worker, 'measureText', {
        ...commonParams,
        canvasMode: 'created',
      });
    }
  }

  private async waitForFontSynchronization(worker: Worker) {
    isDefined(this.workerService, 'WorkerService is not set');

    const fonts = await Services.FontRegistry.getFontsData();

    const params = {
      fonts: fonts.map((font) => ({
        fontName: font.font,
        url: font.url,
        isBold: font.isBold,
        isItalic: font.isItalic,
      })),
    };

    return handleMessageFromMainThread(worker, 'fonts:synchronize', params);
  }
}

// Define a type for the message that the worker will receive

import { isDefined } from '../../../core/utils/assertions';
import { FontFaceFontAwaiter } from '../../../fonts/registry/dependencies/awaiters/FontFaceFontAwaiter';
import { WorkerAdderFontObserver } from '../../../fonts/registry/dependencies/observers/WorkerAdderFontObserver';
import { FontRegistry } from '../../../fonts/registry/FontRegistry';
import { CanvasTextMeasurer } from '../../../text-measuring/measurers/CanvasTextMeasurer';
import { Message } from '../../messages';
import { isMessageOfType, logObjectKeys, postTypedMessage } from '../../utils';

let workerId: string | null = null;
let fontRegistry: FontRegistry | null = null;

function log(...args: unknown[]): void {
  console.log(`[SimpleWebWorker ${workerId}]`, ...args);
}

// Define a function that will handle the message received by the worker
async function handleWorkerMessage(
  event: MessageEvent<Message>,
): Promise<void> {
  const { message } = event.data;

  if (isMessageOfType(event, 'initialize')) {
    workerId = event.data.params.id;
    log(`Worker initialized with ID ${workerId}`);
    return;
  }

  if (isMessageOfType(event, 'fontLoaded')) {
    log(`Received fontLoaded message`);

    if (!fontRegistry) {
      log('Creating font registry');
      fontRegistry = new FontRegistry({
        fontAwaiter: new FontFaceFontAwaiter(),
        observers: [new WorkerAdderFontObserver()],
      });
    }

    const data = event.data.params;

    log(`Registering font ${data.fontName} from ${data.url}`);

    await fontRegistry.registerFont({
      font: data.fontName,
      url: data.url,
      isBold: data.isBold,
      isItalic: data.isItalic,
      displayName: `${data.fontName} [webworker]`,
      isCustom: true,
    });

    // Send the result back to the main thread
    postTypedMessage(self, 'fontLoaded:result', {
      status: 'loaded',
    });

    return;
  }

  if (isMessageOfType(event, 'measureText')) {
    log(`Received measureText message`);

    logObjectKeys(event.data.params, (key, value) =>
      log(`- event.data.params.${key}=${value}`),
    );

    const data = event.data;
    let canvas: undefined | OffscreenCanvas;

    if (data.params.canvasMode === 'transferred') {
      log('Using canvas transferred from main thread');
      canvas = data.params.canvas;
    } else if (data.params.canvasMode === 'created') {
      log('Creating canvas in worker');
      canvas = new OffscreenCanvas(100, 100);
    }

    isDefined(canvas, 'Canvas is not set');

    const context = canvas.getContext('2d')!;

    log('before context.font=', context.font);

    // Just to reuse something from the main application
    const measurer = new CanvasTextMeasurer()
      .withText(data.params.text)
      .withFont(data.params.font)
      .withBold(data.params.bold)
      .withItalic(data.params.italic)
      .withSize(data.params.size)
      .withCanvasContext(context);

    const result = measurer.calculateWidth();

    log('after context.font=', context.font);

    log(`Sending result: ${result}`);

    // Send the result back to the main thread
    postTypedMessage(self, 'measureText:result', {
      text: data.params.text,
      result,
    });

    return;
  }

  log(`Unknown message: ${message}`);
}

// Add an event listener to the worker to handle incoming messages
self.addEventListener('message', handleWorkerMessage);

// Define a type for the message that the worker will receive

import { isDefined } from '../../../core/utils/assertions';
import { FontFaceFontAwaiter } from '../../../fonts/registry/dependencies/awaiters/FontFaceFontAwaiter';
import { WorkerAdderFontObserver } from '../../../fonts/registry/dependencies/observers/WorkerAdderFontObserver';
import { FontRegistry } from '../../../fonts/registry/FontRegistry';
import { CanvasTextMeasurer } from '../../../text-measuring/measurers/CanvasTextMeasurer';
import { Message } from '../../messages';
import { logObjectKeys, postTypedMessage } from '../../utils';
import { handleMessageFromWorker } from '../worker-utils';

let workerId: string | null = null;

const fontRegistry: FontRegistry = new FontRegistry({
  fontAwaiter: new FontFaceFontAwaiter(),
  observers: [new WorkerAdderFontObserver()],
});

function log(...args: unknown[]): void {
  console.log(`[SimpleWebWorker ${workerId}]`, ...args);
}

async function handleInitializeMessage(
  event: MessageEvent<Message>,
): Promise<boolean> {
  return await handleMessageFromWorker('initialize', event, async (params) => {
    workerId = params.id;
    log(`Worker initialized with ID ${workerId}`);
    return { id: workerId };
  });
}

async function handleFontLoadedMessage(
  event: MessageEvent<Message>,
): Promise<boolean> {
  return await handleMessageFromWorker('fontLoaded', event, async (params) => {
    log(`Received fontLoaded message`);

    log(`Registering font ${params.fontName} from ${params.url}`);

    await fontRegistry.registerFont({
      font: params.fontName,
      url: params.url,
      isBold: params.isBold,
      isItalic: params.isItalic,
      displayName: `${params.fontName} [webworker]`,
      isCustom: true,
    });

    return {
      status: 'loaded',
    };
  });
}

async function handleFontSynchronizeMessage(event: MessageEvent<Message>) {
  return await handleMessageFromWorker(
    'fonts:synchronize',
    event,
    async (params) => {
      log('Received fontSynchronize message');

      log('Synchronizing fonts');

      const fontsSynchronizedPromise = params.fonts.map(async (font) => {
        return await fontRegistry.registerFont({
          font: font.fontName,
          url: font.url,
          isBold: font.isBold,
          isItalic: font.isItalic,
          displayName: `${font.fontName} [webworker]`,
          isCustom: true,
        });
      });

      await Promise.all(fontsSynchronizedPromise);

      log('Synchronized fonts');

      return {
        status: 'success',
      };
    },
  );
}

async function handleMeasureTextMessage(
  event: MessageEvent<Message>,
): Promise<boolean> {
  return await handleMessageFromWorker('measureText', event, async (params) => {
    log(`Received measureText message`);

    logObjectKeys(params, (key, value) => log(`- params.${key}=${value}`));

    let canvas: undefined | OffscreenCanvas;

    if (params.canvasMode === 'transferred') {
      log('Using canvas transferred from main thread');
      canvas = params.canvas;
    } else if (params.canvasMode === 'created') {
      log('Creating canvas in worker');
      canvas = new OffscreenCanvas(300, 150);
    }

    isDefined(canvas, 'Canvas is not set');

    const context = canvas.getContext('2d')!;

    // log('before context.font=', context.font);

    // Just to reuse something from the main application
    const measurer = new CanvasTextMeasurer()
      .withText(params.text)
      .withFont(params.font)
      .withBold(params.bold)
      .withItalic(params.italic)
      .withSize(params.size)
      .withCanvasContext(context);

    const result = measurer.calculateWidth();

    // log('after context.font=', context.font);

    log(`Sending result: ${result}`);

    // Send the result back to the main thread
    return {
      text: params.text,
      result,
    };
  });
}

async function handleWorkerMessage(
  event: MessageEvent<Message>,
): Promise<void> {
  const { message } = event.data;

  if (await handleInitializeMessage(event)) {
    return;
  }

  if (await handleFontLoadedMessage(event)) {
    return;
  }

  if (await handleFontSynchronizeMessage(event)) {
    return;
  }

  if (await handleMeasureTextMessage(event)) {
    return;
  }

  log(`Unknown message: ${message}`);
}

// Add an event listener to the worker to handle incoming messages
self.addEventListener('message', handleWorkerMessage);

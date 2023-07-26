// Define a type for the message that the worker will receive

import { isDefined } from '../../core/utils/assertions';
import { CanvasTextMeasurer } from '../../text-measuring/measurers/CanvasTextMeasurer';
import { Message } from '../messages';
import { isMessageOfType, postTypedMessage } from '../utils';

function log(...args: unknown[]): void {
  console.log(`[SimpleWebWorker]`, ...args);
}

// Define a function that will handle the message received by the worker
function handleWorkerMessage(event: MessageEvent<Message>): void {
  const { message } = event.data;

  log(`Received message: ${message}`);
  log(`Received data: ${event.data}`);

  if (!isMessageOfType(event, 'measureText')) {
    log(`Unknown message: ${message}`);
    return;
  }

  log(`Received measureText message`);

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

  // Just to reuse something from the main application
  const measurer = new CanvasTextMeasurer()
    .withText(data.params.text)
    .withFont(data.params.font)
    .withBold(data.params.bold)
    .withItalic(data.params.italic)
    .withSize(data.params.size)
    .withCanvasContext(context);

  const result = measurer.calculateWidth();

  log(`Sending result: ${result}`);

  // Send the result back to the main thread
  postTypedMessage(self, 'measureText:result', {
    text: data.params.text,
    result,
  });
}

// Add an event listener to the worker to handle incoming messages
self.addEventListener('message', handleWorkerMessage);

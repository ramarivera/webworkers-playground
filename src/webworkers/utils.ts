import { AllMessages, MessagePayloads } from './messages';

type WorkerPort = Pick<Worker, 'postMessage'>;
type SelfPort = Pick<Window & typeof globalThis, 'postMessage'>;

type MessagePort = WorkerPort | SelfPort;

function isRunningInWorker(): boolean {
  return typeof self.postMessage === 'function';
}

export function postTypedMessage<TMessage extends AllMessages>(
  messagePort: MessagePort,
  message: TMessage,
  params: MessagePayloads[TMessage]['params'],
  transferrables?: Transferable[],
  targetOrigin?: string,
): void {
  if (!transferrables || transferrables.length === 0) {
    messagePort.postMessage({ message, params });
    return;
  }

  if (isRunningInWorker()) {
    (messagePort as WorkerPort).postMessage(
      { message, params },
      transferrables,
    );
  } else {
    (messagePort as SelfPort).postMessage(
      { message, params },
      targetOrigin ?? '/',
      transferrables,
    );
  }
}

export function isMessageOfType<TMessage extends AllMessages>(
  event: MessageEvent<unknown>,
  message: TMessage,
): event is MessageEvent<MessagePayloads[TMessage]> {
  return (event.data as MessagePayloads[TMessage]).message === message;
}

export function isCanvasDetached(canvas: OffscreenCanvas): boolean {
  try {
    canvas.transferControlToOffscreen();
    return false;
  } catch (e) {
    return (e as { code: number }).code === DOMException.INVALID_STATE_ERR;
  }
}

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
  postUntypedMessage(
    messagePort,
    message,
    params,
    transferrables,
    targetOrigin,
  );
}

export function postUntypedMessage(
  messagePort: MessagePort,
  message: string,
  params: Record<string, unknown>,
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

export function isMessageOfTypeUntyped(
  event: MessageEvent<unknown>,
  message: string,
): event is MessageEvent<Record<string, unknown>> {
  return (event.data as { message: string }).message === message;
}

export function logObjectKeys(
  obj: Record<string, unknown>,
  logFn: (key: string, value: unknown) => void,
  excludeKeysRegex: RegExp = /canvas/,
): void {
  for (const [key, value] of Object.entries(obj)) {
    if (excludeKeysRegex.test(key)) {
      continue;
    }

    logFn(key, value);

    if (typeof value === 'object' && value !== null) {
      logObjectKeys(value as Record<string, unknown>, logFn);
    }
  }
}

export function isCanvasDetached(canvas: OffscreenCanvas): boolean {
  try {
    canvas.transferControlToOffscreen();
    return false;
  } catch (e) {
    return (e as { code: number }).code === DOMException.INVALID_STATE_ERR;
  }
}

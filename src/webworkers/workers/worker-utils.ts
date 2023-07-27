import {
  WorkerMessageType,
  MessageParams,
  ResultKey,
  Message,
  getResultKey,
} from '../messages';
import {
  isMessageOfType,
  isMessageOfTypeUntyped,
  postTypedMessage,
  postUntypedMessage,
} from '../utils';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type MessageHandlerReturnType<TMessage extends WorkerMessageType> =
  MessageParams<ResultKey<TMessage>> extends never
    ? Promise<void>
    : Promise<MessageParams<ResultKey<TMessage>>>;

/**
 * This method is to be used INSIDE WEBWORKERS.
 * It handles incoming messages from the main thread, and apply the message
 * handler function to generate and send the result message pair
 * @param message message type to process
 * @param event message event
 * @param messageHandler function to be called when the message is received, with the incoming message
 * params. It should return a promise that resolves to the result message params.
 * @returns promise resolving to true if the message was handled, false otherwise
 */
export async function handleMessageFromWorker<
  TMessage extends WorkerMessageType,
>(
  message: TMessage,
  event: MessageEvent<Message /*<MessageParams<TMessage>>*/>,
  messageHandler: (
    params: MessageParams<TMessage>,
  ) => Promise<MessageParams<ResultKey<TMessage>>>,
) {
  if (!isMessageOfType(event, message)) {
    return false;
  }

  // log(`Received ${message} message`);

  const data = event.data;

  // logObjectKeys(data.params, (key, value) =>
  //   log(`- data.params.${key}=${value}`),
  // );

  const resultPayload = await messageHandler(data.params);

  if (resultPayload) {
    postTypedMessage(
      event.target as Worker,
      getResultKey(message),
      resultPayload,
    );
  }

  return true;
}

/**
 * This method is to be used IN THE MAIN THREAD.
 * It handles sending a message to a given web worker, and waits for the result message in a promise.
 * @param worker worker to send the message to
 * @param message message type
 * @param params message params
 * @param resultCallback optional callback to be called when the result message is received, to manually convert data if necessary.
 * @param transferrables optional list of transferrable objects to be sent to the worker.
 * @returns promise resolving to the result message params.
 */
export async function handleMessageFromMainThread<
  TMessage extends WorkerMessageType,
>(
  worker: Worker,
  message: TMessage,
  params: MessageParams<TMessage>,
  resultCallback?: (
    params: MessageParams<TMessage>,
    result: MessageParams<ResultKey<TMessage>>,
    resolve: (value: MessageParams<ResultKey<TMessage>>) => void,
    reject: (reason?: unknown) => void,
  ) => Promise<void>,
  transferrables?: Transferable[],
): Promise<MessageParams<ResultKey<TMessage>>> {
  return await (handleMessageFromMainThreadUntyped(
    worker,
    message,
    params,
    // @ts-expect-error conversion between too specific and too generic types
    resultCallback,
    transferrables,
  ) as Promise<MessageParams<ResultKey<TMessage>>>);
}

/**
 * This method is to be used IN THE MAIN THREAD.
 * It handles sending a message to a given web worker, and waits for the result message in a promise.
 * @param worker worker to send the message to
 * @param message message type
 * @param params message params
 * @param resultCallback optional callback to be called when the result message is received, to manually convert data if necessary.
 * @param transferrables optional list of transferrable objects to be sent to the worker.
 * @returns promise resolving to the result message params.
 */
export async function handleMessageFromMainThreadUntyped(
  worker: Worker,
  message: string,
  params: unknown,
  resultCallback?: (
    params: unknown,
    result: unknown,
    resolve: (value: unknown) => void,
    reject: (reason?: unknown) => void,
  ) => Promise<void>,
  transferrables?: Transferable[],
): Promise<unknown> {
  return new Promise<unknown>((resolve, reject) => {
    worker.onmessage = (event: MessageEvent<Message>) => {
      if (!isMessageOfTypeUntyped(event, getResultKey(message))) {
        return;
      }

      if (resultCallback) {
        resultCallback(params, event.data.params, resolve, reject);
        return;
      }

      resolve(event.data.params);
    };

    worker.onerror = (error) => {
      reject(error);
    };

    postUntypedMessage(
      worker,
      message,
      params as Record<string, unknown>,
      transferrables,
    );
  });
}

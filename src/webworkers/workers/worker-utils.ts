import {
  WorkerMessageType,
  MessageParams,
  ResultKey,
  Message,
  getResultKey,
} from '../messages';
import { isMessageOfType, postTypedMessage } from '../utils';

type MessageHandlerReturnType<TMessage extends WorkerMessageType> =
  MessageParams<ResultKey<TMessage>> extends never
    ? Promise<void>
    : Promise<MessageParams<ResultKey<TMessage>>>;

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

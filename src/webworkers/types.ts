import { MessageParams, WorkerMessageType } from './messages';

export type Broadcaster = <TMessage extends WorkerMessageType>(
  message: TMessage,
  params: MessageParams<TMessage>,
  savedMessages?: boolean,
  waitForResponses?: boolean,
) => void;

import { AllMessages, MessagePayloads } from './messages';

export type Broadcaster = <TMessage extends AllMessages>(
  message: TMessage,
  params: MessagePayloads[TMessage]['params'],
) => void;

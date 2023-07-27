const RESULT_STRING_KEY = ':result' as const;

export type ResultKey<T extends string> = `${T}${typeof RESULT_STRING_KEY}`;

export function getResultKey<T extends string>(key: T): ResultKey<T> {
  return `${key}${RESULT_STRING_KEY}` as ResultKey<T>;
}

/**
 * Message keys to be SENT to web workers
 */
export type WorkerMessageType =
  | 'initialize'
  | 'measureText'
  | 'fontLoaded'
  | 'fonts:synchronize';

/**
 * Message keys to be RECEIVED from web workers
 */
export type MainThreadMessageType =
  | ResultKey<'initialize'>
  | ResultKey<'measureText'>
  | ResultKey<'fontLoaded'>
  | ResultKey<'fonts:synchronize'>;

export type AllMessages = WorkerMessageType | MainThreadMessageType;

export interface Message<TParams = unknown> {
  message: WorkerMessageType;
  params: TParams;
}

export type InitializeMessage = Message<{
  id: string;
}>;

/**
 * Dummy type
 */
export type InitializeResultMessage = Message<{
  id: string;
}>;

export type MeasureTextMessage = Message<{
  text: string;
  font: string;
  size: number;
  bold: boolean;
  italic: boolean;
  canvas?: OffscreenCanvas;
  canvasMode: 'transferred' | 'created';
}>;

export type MeasureTextResultMessage = Message<{
  text: string;
  result: number;
}>;

export type FontLoadedMessage = Message<{
  fontName: string;
  url: string;
  isBold: boolean;
  isItalic: boolean;
}>;

export type FontLoadedResultMessage = Message<{
  status: 'loaded' | 'error';
}>;

export type SynchronizeFontsMessage = Message<{
  fonts: {
    fontName: string;
    url: string;
    isBold: boolean;
    isItalic: boolean;
  }[];
}>;

export type SynchronizeFontsMessageResult = Message<{
  status: 'success' | 'error';
}>;

export interface MessagePayloads {
  initialize: InitializeMessage;
  ['initialize:result']: InitializeResultMessage;
  measureText: MeasureTextMessage;
  ['measureText:result']: MeasureTextResultMessage;
  ['fontLoaded']: FontLoadedMessage;
  ['fontLoaded:result']: FontLoadedResultMessage;
  ['fonts:synchronize']: SynchronizeFontsMessage;
  ['fonts:synchronize:result']: SynchronizeFontsMessageResult;
}

export type MessageParams<TMessage extends keyof MessagePayloads> =
  MessagePayloads[TMessage]['params'];

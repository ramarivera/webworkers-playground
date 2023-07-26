/**
 * Message keys to be SENT to web workers
 */
export type WorkerMessageType = 'initialize' | 'measureText' | 'fontLoaded';

/**
 * Message keys to be RECEIVED from web workers
 */
export type MainThreadMessageType = 'measureText:result' | 'fontLoaded:result';

export type AllMessages = WorkerMessageType | MainThreadMessageType;

export interface Message<TParams = unknown> {
  message: WorkerMessageType;
  params: TParams;
}

export type InitializeMessage = Message<{
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

export interface MessagePayloads {
  initialize: InitializeMessage;
  measureText: MeasureTextMessage;
  ['measureText:result']: MeasureTextResultMessage;
  ['fontLoaded']: FontLoadedMessage;
  ['fontLoaded:result']: FontLoadedResultMessage;
}

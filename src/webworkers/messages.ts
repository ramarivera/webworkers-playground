export type WorkerMessageType = 'measureText';

export type MainThreadMessageType = 'measureText:result';

export type AllMessages = WorkerMessageType | MainThreadMessageType;

export interface Message<TParams = unknown> {
  message: WorkerMessageType;
  params: TParams;
}

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

export interface MessagePayloads {
  measureText: MeasureTextMessage;
  ['measureText:result']: MeasureTextResultMessage;
}

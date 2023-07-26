export interface TextMeasurerInterface {
  withText(text: string): TextMeasurerInterface;
  withFont(font: string): TextMeasurerInterface;
  withSize(size: number): TextMeasurerInterface;
  withBold(bold?: boolean): TextMeasurerInterface;
  withItalic(italic?: boolean): TextMeasurerInterface;
  calculateWidth(): number | Promise<number>;
}

export const TEXT_MEASURER_TYPES = [
  'canvas',
  'offscreen-canvas',
  'html',
  'webworker',
  'webworker-pool',
  'webworker-clink',
] as const;

export type TextMeasurerType = (typeof TEXT_MEASURER_TYPES)[number];

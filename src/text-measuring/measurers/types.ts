export interface TextMeasurerInterface {
  withText(text: string): TextMeasurerInterface;
  withFont(font: string): TextMeasurerInterface;
  withSize(size: number): TextMeasurerInterface;
  withBold(bold?: boolean): TextMeasurerInterface;
  withItalic(italic?: boolean): TextMeasurerInterface;
  calculateWidth(): number | Promise<number>;
}

export type TextMeasurerType = 'canvas' | 'offscreen-canvas' | 'html';

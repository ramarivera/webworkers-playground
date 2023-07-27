import { TextMeasurerInterface } from './types';

export abstract class BaseTextMeasurer implements TextMeasurerInterface {
  protected text: string;
  protected font: string;
  protected size: number;
  protected bold: boolean;
  protected italic: boolean;

  constructor() {
    this.text = '';
    this.font = '';
    this.size = 0;
    this.bold = false;
    this.italic = false;
  }

  withText(text: string) {
    this.text = text;
    return this;
  }

  withFont(font: string) {
    this.font = font;
    return this;
  }

  withSize(size: number) {
    this.size = size;
    return this;
  }

  withBold(bold: boolean = true) {
    this.bold = bold;
    return this;
  }

  withItalic(italic: boolean = true) {
    this.italic = italic;
    return this;
  }

  withParams(params?: Record<string, unknown>) {
    this.applyParams?.(params);
    return this;
  }

  abstract applyParams?(params?: Record<string, unknown>): void;

  // This method must be called last, to return the calculated width of the text.
  abstract calculateWidth(): number | Promise<number>;
}

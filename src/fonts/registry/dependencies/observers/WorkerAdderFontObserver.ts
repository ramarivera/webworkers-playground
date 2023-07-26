/* eslint-disable @typescript-eslint/no-unused-vars */
import { FontObserver } from './FontObserver';

/**
 * This Observer just reacts to loaded fonts and adds them to the worker context so they can be used.
 */
export class WorkerAdderFontObserver implements FontObserver {
  loaded(
    fontName: string,
    url: string,
    isBold: boolean,
    isItalic: boolean,
    fontFace: FontFace,
  ): void {
    self.fonts.add(fontFace);
  }
}

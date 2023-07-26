/* eslint-disable @typescript-eslint/no-unused-vars */
import { buildFontFace } from '../../../utils';

import { FontObserver } from './FontObserver';

/**
 * This Observer just reacts to loaded fonts and adds them to the document so they can be used.
 */
export class DocumentAdderFontObserver implements FontObserver {
  loading(
    fontName: string,
    url: string,
    isBold: boolean,
    isItalic: boolean,
  ): void {
    document.fonts.add(buildFontFace(fontName, url, isBold, isItalic));
  }
}

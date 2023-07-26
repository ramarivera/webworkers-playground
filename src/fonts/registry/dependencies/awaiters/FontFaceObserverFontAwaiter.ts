import FontFaceObserver from 'fontfaceobserver';

import { buildFontMetadata } from '../../../utils';

import { BaseFontAwaiter } from './BaseFontAwaiter';
import { FontAwaiter } from './FontAwaiter';

/**
 * Font awaiter based in the FontFaceObserver library.
 * Can be used only in the DOM, since FontFaceObserver is not available in Worker contexts.
 */
export class FontFaceObserverFontAwaiter
  extends BaseFontAwaiter
  implements FontAwaiter
{
  protected async doWaitForFontToLoad(
    font: string,
    _url: string,
    isBold: boolean,
    isItalic: boolean,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _fontFace: FontFace,
  ): Promise<void> {
    const fontMetadata = this.buildFontMetadata(isBold, isItalic);
    const observer = new FontFaceObserver(font, fontMetadata);

    try {
      await observer.load();
    } catch (error) {
      throw new Error(
        `FontFaceObserverFontAwaiter: failed to load font ${font} bold=${isBold} italic=${isItalic} (error: ${error}))`,
      );
    }
  }

  private buildFontMetadata(isBold: boolean, isItalic: boolean) {
    return buildFontMetadata(isBold, isItalic);
  }
}

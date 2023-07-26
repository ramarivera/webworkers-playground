import { BaseFontAwaiter } from './BaseFontAwaiter';
import { FontAwaiter } from './FontAwaiter';

/**
 * Font awaiter based on the FontFace interface.
 * In theory can be used in both DOM and Worker contexts.
 */
export class FontFaceFontAwaiter
  extends BaseFontAwaiter
  implements FontAwaiter
{
  protected async doWaitForFontToLoad(
    font: string,
    _url: string,
    isBold: boolean,
    isItalic: boolean,
    fontFace: FontFace,
  ): Promise<void> {
    try {
      await fontFace.load();
    } catch (error) {
      console.error(
        `FontFaceFontAwaiter: failed to load font ${font} bold=${isBold} italic=${isItalic}`,
        error,
      );
      throw error;
    }
  }
}

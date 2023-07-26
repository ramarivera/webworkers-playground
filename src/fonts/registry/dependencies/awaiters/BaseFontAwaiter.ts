import { isDefined } from '../../../../core/utils/assertions';
import {
  buildFontFace,
  generateIdForFontRegistrationData,
} from '../../../utils';

import { FontAwaiter } from './FontAwaiter';

export abstract class BaseFontAwaiter implements FontAwaiter {
  protected fonts = new Map<string, FontFace | Promise<FontFace>>();

  async waitForFontFaceToLoad(
    font: string,
    isBold: boolean,
    isItalic: boolean,
    url: string,
    fontFace: FontFace,
  ): Promise<FontFace | null> {
    return await this.getOrLoadFontFromCache(
      font,
      url,
      isBold,
      isItalic,
      fontFace,
    );
  }

  async waitForFontToLoad(
    font: string,
    url: string,
    isBold: boolean,
    isItalic: boolean,
  ): Promise<FontFace | null> {
    return await this.getOrLoadFontFromCache(font, url, isBold, isItalic);
  }

  protected abstract doWaitForFontToLoad(
    font: string,
    url: string,
    isBold: boolean,
    isItalic: boolean,
    fontFace: FontFace,
  ): Promise<void>;

  /**
   * This method does cache management for the BaseFontAwaiter.
   * If a fontFace is passed as argument, it will be awaited by the corresponding Awaiter implementation.
   * If no fontFace is passed, then font face loading will start from zero by creating the instance of fontFace.
   *
   * @param font
   * @param url
   * @param isBold
   * @param isItalic
   * @param fontFace
   * @returns
   */
  private async getOrLoadFontFromCache(
    font: string,
    url: string,
    isBold: boolean,
    isItalic: boolean,
    fontFace?: FontFace,
  ): Promise<FontFace | null> {
    const fontKey = this.buildFontKey(font, isBold, isItalic, url);

    if (this.fonts.has(fontKey)) {
      const fontOrPromise = this.fonts.get(fontKey)!;
      return fontOrPromise;
    }

    fontFace ??= buildFontFace(font, url, isBold, isItalic);

    await this.doWaitForFontToLoad(font, url, isBold, isItalic, fontFace).then(
      () => {
        isDefined(fontFace, 'FontFace is not defined');
        this.fonts.set(fontKey, fontFace);
        return fontFace;
      },
    );

    this.fonts.set(fontKey, fontFace);

    return fontFace;
  }

  private buildFontKey(
    font: string,
    isBold: boolean,
    isItalic: boolean,
    url: string,
  ) {
    return generateIdForFontRegistrationData({
      font,
      isBold,
      isItalic,
      url,
      displayName: undefined,
    });
  }
}

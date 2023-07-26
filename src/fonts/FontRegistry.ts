// Write a typescript class called FontRegistry
// that has a method to return all registered fonts
// that has a method to register a new font (and when calling it, registers the font in the current document)

import FontFaceObserver from 'fontfaceobserver';

import { FontRegistrationData, RegisteredFontData } from './types';
import { buildFontMetadata, generateIdForFontRegistrationData } from './utils';

export class FontRegistry {
  private static instance: FontRegistry;
  private fonts = new Map<string, RegisteredFontData>();

  private constructor() {}

  public static getInstance(): FontRegistry {
    if (!FontRegistry.instance) {
      FontRegistry.instance = new FontRegistry();
    }
    return FontRegistry.instance;
  }

  public async registerFont(registrationData: FontRegistrationData) {
    const { font, isBold, isItalic, url, displayName } = registrationData;

    // Update registry internal state to match only manually registered fonts
    const registryKey = this.buildFontKey(
      font,
      displayName,
      isBold,
      isItalic,
      url,
    );

    if (this.fonts.has(registryKey)) {
      return;
    }

    // Add the font to the document and start loading it
    const fontFace = new FontFace(font, `url(${url})`, {
      weight: isBold ? 'bold' : 'normal',
      style: isItalic ? 'italic' : 'normal',
    });

    document.fonts.add(fontFace);
    await fontFace.load();

    // return watcher promise that will resolve when font is loaded
    return await this.getObserverPromiseForFont(font, isBold, isItalic).then(
      () => {
        this.fonts.set(registryKey, {
          ...registrationData,
          id: registryKey,
        });
      },
    );
  }

  // https://fonts.cdnfonts.com/s/15017/Bangers-Regular.woff

  public async getFontsData(): Promise<RegisteredFontData[]> {
    const fontStatusPromises = Array.from(this.fonts.values()).map(
      (fontData: RegisteredFontData) => {
        const observer = this.getObserverPromiseForFont(
          fontData.font,
          fontData.isBold,
          fontData.isItalic,
        );

        return observer.then((font) => {
          return {
            ...fontData,
            status: font ? 'loaded' : 'error',
          };
        });
      },
    );

    const promiseResults = await Promise.all(fontStatusPromises);

    return promiseResults;
  }

  private async getObserverPromiseForFont(
    font: string,
    isBold: boolean,
    isItalic: boolean,
  ) {
    const fontMetadata = this.buildFontMetadata(isBold, isItalic);
    const observer = new FontFaceObserver(font, fontMetadata);

    try {
      await observer.load();
      return font;
    } catch (error) {
      console.error(
        `Failed to load font ${font} bold=${isBold} italic=${isItalic}`,
        error,
      );
      return null;
    }
  }

  private buildFontMetadata(isBold: boolean, isItalic: boolean) {
    return buildFontMetadata(isBold, isItalic);
  }

  private buildFontKey(
    font: string,
    displayName: string,
    isBold: boolean,
    isItalic: boolean,
    url: string,
  ) {
    return generateIdForFontRegistrationData({
      font,
      displayName,
      isBold,
      isItalic,
      url,
    });
  }
}

import { FontRegistrationData, RegisteredFontData } from '../types';
import { generateIdForFontRegistrationData } from '../utils';

import { FontAwaiter } from './dependencies/awaiters/FontAwaiter';
import { FontObserver } from './dependencies/observers/FontObserver';

export interface FontRegistryConfiguration {
  fontAwaiter: FontAwaiter;
  observers?: FontObserver[];
}

export class FontRegistry {
  private fonts = new Map<string, RegisteredFontData>();

  constructor(private configuration: FontRegistryConfiguration) {}

  public async registerFontFace(
    font: string,
    isBold: boolean,
    isItalic: boolean,
    url: string,
    isCustom: boolean,
    fontFace: FontFace,
  ) {
    return await this.tryGetFromCacheOrLoadFont(
      font,
      `${font} [externally loaded]`,
      isBold,
      isItalic,
      url,
      isCustom,
      fontFace,
    );
  }

  public async registerFont(registrationData: FontRegistrationData) {
    const { font, isBold, isItalic, url, displayName, isCustom } =
      registrationData;

    return await this.tryGetFromCacheOrLoadFont(
      font,
      displayName,
      isBold,
      isItalic,
      url,
      isCustom,
    );
  }

  public async getFontsData(): Promise<RegisteredFontData[]> {
    const fontStatusPromises = Array.from(this.fonts.values()).map(
      async (fontData: RegisteredFontData) => {
        const font = await this.configuration.fontAwaiter.waitForFontToLoad(
          fontData.font,
          fontData.url,
          fontData.isBold,
          fontData.isItalic,
        );

        return {
          ...fontData,
          status: font ? 'loaded' : 'error',
        };
      },
    );

    const promiseResults = (await Promise.all(fontStatusPromises)).sort(
      (a, b) => a.displayName.localeCompare(b.displayName),
    );

    return promiseResults;
  }

  public async tryGetFromCacheOrLoadFont(
    font: string,
    displayName: string,
    isBold: boolean,
    isItalic: boolean,
    url: string,
    isCustom: boolean,
    fontFace?: FontFace,
  ) {
    // Create internal cache key
    const registryKey = this.buildFontKey(
      font,
      displayName,
      isBold,
      isItalic,
      url,
    );

    // Early exit if the font is already in the cache
    if (this.fonts.has(registryKey)) {
      return;
    }

    let loadedFontFace: FontFace | null = null;

    try {
      for (const observer of this.configuration.observers ?? []) {
        observer.loading?.(font, url, isBold, isItalic);
      }

      // If we are loading fonts via an instance of FontFace, then just in case do an await for it
      // If not, then try to load the font and construct the FontFace from scratch
      loadedFontFace = fontFace
        ? await this.configuration.fontAwaiter.waitForFontFaceToLoad(
            font,
            isBold,
            isItalic,
            url,
            fontFace,
          )
        : await this.configuration.fontAwaiter.waitForFontToLoad(
            font,
            url,
            isBold,
            isItalic,
          );

      if (!loadedFontFace) {
        throw new Error(
          `FontRegistry: could not await font ${font} bold=${isBold} italic=${isItalic}`,
        );
      }
    } catch (error) {
      for (const observer of this.configuration.observers ?? []) {
        observer.errored?.(font, url, isBold, isItalic, fontFace);
      }
      throw error;
    }

    // Finally, if the font or fontFace was loaded correctly, set information in the cache.
    this.fonts.set(registryKey, {
      id: registryKey,
      font,
      displayName: displayName,
      isBold,
      isItalic,
      url,
      isCustom,
    });

    for (const observer of this.configuration.observers ?? []) {
      observer.loaded?.(font, url, isBold, isItalic, loadedFontFace);
    }
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

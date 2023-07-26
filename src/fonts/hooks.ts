import { useCallback, useMemo, useState } from 'react';

import { useExecuteExactlyOnce } from '../core/utils/hooks';

import { PREDEFINED_FONTS } from './constants';
import { FontRegistry } from './FontRegistry';
import { FontRegistrationData } from './types';

export function useFontRegistry(selectedFont: string) {
  const fontRegistry = FontRegistry.getInstance();

  const initializeFontRegistry = useCallback(async () => {
    const initializationPromises = PREDEFINED_FONTS.map(async (font) => {
      await fontRegistry.registerFont({
        font: font.name,
        isBold: font.bold,
        isItalic: font.italic,
        url: font.url,
        displayName: font.display,
      });
    });

    await Promise.all(initializationPromises);
  }, [fontRegistry]);

  const { isDone: isInitialized } = useExecuteExactlyOnce(
    initializeFontRegistry,
  );

  const [registeredFonts, setRegisteredFonts] = useState<
    FontRegistrationData[]
  >([]);

  const fontDataByDisplayKey = useMemo(
    () =>
      registeredFonts.reduce(
        (acc, fontData) => ({
          ...acc,
          [fontData.displayName]: fontData,
        }),
        {} as Record<string, FontRegistrationData>,
      ),
    [registeredFonts],
  );

  const selectedFontData = useMemo(
    () => fontDataByDisplayKey[selectedFont],
    [fontDataByDisplayKey, selectedFont],
  );

  return {
    selectedFontData,

    fonts: fontDataByDisplayKey,

    registerFont: async (registrationData: FontRegistrationData) => {
      await fontRegistry.registerFont(registrationData);
      const fontsData = await fontRegistry.getFontsData();
      setRegisteredFonts(fontsData);
    },

    isInitialized,
  };
}

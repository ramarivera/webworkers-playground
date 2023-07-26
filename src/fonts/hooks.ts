import { useCallback, useMemo, useState } from 'react';

import { useExecuteExactlyOnce } from '../core/utils/hooks';

import { PREDEFINED_FONTS } from './constants';
import { FontRegistry } from './FontRegistry';
import { FontRegistrationData, RegisteredFontData } from './types';
import { convertPredefinedFontToFontRegistrationData } from './utils';

export function useFontRegistry(selectedFontId: string) {
  const [registeredFonts, setRegisteredFonts] = useState<RegisteredFontData[]>(
    [],
  );

  const fontRegistry = FontRegistry.getInstance();

  const registerFontAndUpdateState = useCallback(
    async (registrationData: FontRegistrationData) => {
      await fontRegistry.registerFont(registrationData);
      const fontsData = await fontRegistry.getFontsData();
      setRegisteredFonts(fontsData);
    },
    [fontRegistry],
  );

  const initializeFontRegistry = useCallback(async () => {
    console.log('Initializing font registry');

    const initializationPromises = PREDEFINED_FONTS.map(
      async (font) =>
        await registerFontAndUpdateState(
          convertPredefinedFontToFontRegistrationData(font),
        ),
    );

    await Promise.all(initializationPromises);
  }, [registerFontAndUpdateState]);

  const { isDone: isInitialized } = useExecuteExactlyOnce(
    initializeFontRegistry,
  );

  const fontDataById = useMemo(
    () =>
      registeredFonts.reduce(
        (acc, fontData) => ({
          ...acc,
          [fontData.id]: fontData,
        }),
        {} as Record<string, RegisteredFontData>,
      ),
    [registeredFonts],
  );

  const selectedFontData = useMemo(
    () => fontDataById[selectedFontId],
    [fontDataById, selectedFontId],
  );

  return {
    selectedFontData,

    fonts: registeredFonts,

    fontById: fontDataById,

    registerFont: registerFontAndUpdateState,

    isInitialized,
  };
}

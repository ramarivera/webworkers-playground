import { useCallback, useMemo, useRef, useState } from 'react';

import { useExecuteExactlyOnce } from '../core/utils/hooks';
import { textMeasurerWorkersService } from '../webworkers/workers/text-measuring/TextMeasurerWorkerService';

import { PREDEFINED_FONTS } from './predefinedFonts';
import { FontFaceObserverFontAwaiter } from './registry/dependencies/awaiters/FontFaceObserverFontAwaiter';
import { DocumentAdderFontObserver } from './registry/dependencies/observers/DocumentAdderFontObserver';
import { NotifyWorkersObserver } from './registry/dependencies/observers/NotifySharedWorkerFontObserver';
import { FontRegistry } from './registry/FontRegistry';
import { FontRegistrationData, RegisteredFontData } from './types';
import { convertPredefinedFontToFontRegistrationData } from './utils';

export function useFontRegistry(selectedFontId: string) {
  const fontRegistryRef = useRef<FontRegistry | null>(null);

  if (!fontRegistryRef.current) {
    fontRegistryRef.current = new FontRegistry({
      fontAwaiter: new FontFaceObserverFontAwaiter(),
      observers: [
        new DocumentAdderFontObserver(),
        new NotifyWorkersObserver(
          textMeasurerWorkersService.broadcastMessage.bind(
            textMeasurerWorkersService,
          ),
        ),
      ],
    });
  }

  const fontRegistry = fontRegistryRef.current;

  const [registeredFonts, setRegisteredFonts] = useState<RegisteredFontData[]>(
    [],
  );

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

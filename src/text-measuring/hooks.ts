import { useCallback, useEffect, useState } from 'react';

import { getTextMeasurer } from './measurers/factory';
import { TextMeasurerInterface, TextMeasurerType } from './measurers/types';

export function useTextMeasurer(
  textMeasurerType: TextMeasurerType,
  textMeasurerParams?: Record<string, unknown>,
) {
  const buildTextMeasurer = useCallback(() => {
    return getTextMeasurer(textMeasurerType).withParams(textMeasurerParams);
  }, [textMeasurerType, textMeasurerParams]);

  const [textMeasurer, setTextMeasurer] = useState<TextMeasurerInterface>(() =>
    buildTextMeasurer(),
  );

  useEffect(() => {
    console.log('Updating text measurer type to ', textMeasurerType);
    setTextMeasurer(buildTextMeasurer());
  }, [buildTextMeasurer, textMeasurerType]);

  return textMeasurer;
}

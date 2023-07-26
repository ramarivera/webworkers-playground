import { useEffect, useState } from 'react';

import { getTextMeasurer } from './measurers/factory';
import { TextMeasurerInterface, TextMeasurerType } from './measurers/types';

export function useTextMeasurer(textMeasurerType: TextMeasurerType) {
  const [textMeasurer, setTextMeasurer] = useState<TextMeasurerInterface>(() =>
    getTextMeasurer(textMeasurerType),
  );

  useEffect(() => {
    console.log('Updating text measurer type to ', textMeasurerType);
    setTextMeasurer(getTextMeasurer(textMeasurerType));
  }, [textMeasurerType]);

  return textMeasurer;
}

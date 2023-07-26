import { useState } from 'react';

import { getTextMeasurer } from './measurers/factory';
import { TextMeasurerInterface, TextMeasurerType } from './measurers/types';

export function useTextMeasurer(type: TextMeasurerType) {
  const [textMeasurer] = useState<TextMeasurerInterface>(getTextMeasurer(type));
  return textMeasurer;
}

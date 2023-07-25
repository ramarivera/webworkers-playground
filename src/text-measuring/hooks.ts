import { useState } from 'react';
import { TextMeasurerInterface, TextMeasurerType } from './measurers/types';
import { getTextMeasurer } from './measurers/factory';

export function useTextMeasurer(type: TextMeasurerType) {
  const [textMeasurer] = useState<TextMeasurerInterface>(getTextMeasurer(type));
  return textMeasurer;
}

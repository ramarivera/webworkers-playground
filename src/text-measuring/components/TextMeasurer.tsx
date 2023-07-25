import { useState } from 'react';

import { TextMeasurerType } from '../measurers/types';
import { TextMeasurerUI } from './TextMeasurerUI';
import { useTextMeasurer } from '../hooks';
import { isPromise } from '../../utils/checkers';

export type TextMeasurerProps = {
  initialText: string;
  measurerType: TextMeasurerType;
};

export const TextMeasurer: React.FC<TextMeasurerProps> = ({
  initialText,
  measurerType,
}) => {
  const [text, setText] = useState<string>(initialText);
  const [measurementResult, setMeasurementResult] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const textMeasurer = useTextMeasurer(measurerType);

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  const handleMeasureClicked = async (textToMeasure: string) => {
    setIsLoading(true);

    const result = textMeasurer.withText(textToMeasure).calculateWidth();

    if (isPromise(result)) {
      const measurement = await result;
      setMeasurementResult(measurement);
    } else {
      setMeasurementResult(result);
    }

    setIsLoading(false);
  };

  return (
    <TextMeasurerUI
      text={text}
      measurementResult={measurementResult}
      onMeasureClicked={handleMeasureClicked}
      onTextChanged={handleTextChange}
      isLoading={isLoading}
    />
  );
};

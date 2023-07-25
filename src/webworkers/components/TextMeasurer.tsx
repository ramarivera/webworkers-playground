import { useState } from 'react';

export interface TextMeasurerProps {
  text: string;
}

export const TextMeasurer: React.FC<TextMeasurerProps> = ({ text }) => {
  const [measurementResult, setMeasurementResult] = useState<number | null>(
    null,
  );

  const measureText = (text: string) => {
    // Implement your text measurement logic here
    // For example, we can measure the length of the text
    setMeasurementResult(text.length);
  };

  return (
    <div>
      <label>
        Text to measure:
        <input value={text} readOnly />
      </label>
      <label>
        Measurement result:
        <input value={measurementResult || ''} readOnly />
      </label>
      <button onClick={() => measureText(text)}>Measure</button>
    </div>
  );
};

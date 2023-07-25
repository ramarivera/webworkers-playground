import { useState } from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';

export interface TextMeasurerProps {
  initialText: string;
}

export const TextMeasurer: React.FC<TextMeasurerProps> = ({ initialText }) => {
  const [text, setText] = useState<string>(initialText);
  const [measurementResult, setMeasurementResult] = useState<number | null>(
    null,
  );
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const measureText = (text: string) => {
    // Implement your text measurement logic here
    // For example, we can measure the length of the text
    setMeasurementResult(text.length);
  };

  return (
    <Card variant="outlined">
      <Grid container spacing={2} direction={'column'} padding={1}>
        <Grid>
          <TextField
            label="Text to measure:"
            value={text}
            variant="outlined"
            onChange={handleTextChange}
          />
        </Grid>
        <Grid>
          <TextField
            label="Measurement result:"
            value={measurementResult || ''}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid display="flex" justifyContent="center" alignItems="center">
          <Button variant="contained" onClick={() => measureText(text)}>
            Measure
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

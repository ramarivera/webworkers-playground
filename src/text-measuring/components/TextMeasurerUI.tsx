import StraightenIcon from '@mui/icons-material/Straighten';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

export interface TextMeasurerUIProps {
  text: string;
  cssFontString: string;
  isLoading: boolean;
  measurementResult: number | null;
  onMeasureClicked: (text: string) => void;
  onTextChanged: (text: string) => void;
}

export const TextMeasurerUI: React.FC<TextMeasurerUIProps> = ({
  text,
  cssFontString,
  measurementResult,
  onMeasureClicked,
  onTextChanged,
  isLoading,
}) => {
  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onTextChanged(event.target.value);
  };

  const measureText = (text: string) => {
    onMeasureClicked(text);
  };

  return (
    <Card variant="outlined">
      <Grid container spacing={2} direction={'column'} padding={1}>
        <Grid>
          <Typography textAlign={'center'} variant="h5">
            Text
          </Typography>
        </Grid>
        <Grid>
          <TextField
            label="Text to measure:"
            value={text}
            variant="outlined"
            onChange={handleTextChange}
          />
        </Grid>
        <Grid>
          <span style={{ textAlign: 'center', font: cssFontString }}>
            {' '}
            Text preview: {text}{' '}
          </span>
        </Grid>
        <Grid>
          <TextField
            label="Measurement result:"
            value={measurementResult}
            variant="outlined"
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
        <Grid display="flex" justifyContent="center" alignItems="center">
          <LoadingButton
            variant="contained"
            onClick={() => measureText(text)}
            loading={isLoading}
            loadingPosition={'start'}
            startIcon={<StraightenIcon />}
          >
            {isLoading ? 'Measuring...' : 'Measure'}
          </LoadingButton>
        </Grid>
      </Grid>
    </Card>
  );
};

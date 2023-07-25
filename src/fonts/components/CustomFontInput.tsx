// Write a CustomFontInput component that will use Material UI to render a component with:
// a TextField for the font URL
// a Checkbox for bold
// a Checkbox for italic
// a LoadingButton from Material UI that when clicked will call onFontRegistered callback prop with the font url, bold and italic values.
import { useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import FormGroup from '@mui/material/FormGroup';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { TypeOf, coerce, object, string } from 'zod';

import { wrapValidatableSchema } from '../../utils/forms';

const customFontInputSchema = object({
  url: string().url('A valid font URL is required'),
  isBold: coerce.boolean(),
  isItalic: coerce.boolean(),
});

type CustomFontInputData = TypeOf<typeof customFontInputSchema>;

const { TextField, CheckboxField } = wrapValidatableSchema(
  customFontInputSchema,
);

export interface CustomFontInputProps {
  onFontRegistered: (url: string, isBold: boolean, isItalic: boolean) => void;
  isLoading: boolean;
}

export const CustomFontInput: React.FC<CustomFontInputProps> = ({
  onFontRegistered,
  isLoading,
}) => {
  const methods = useForm<CustomFontInputData>({
    resolver: zodResolver(customFontInputSchema),
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitSuccessful },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const handleRegisterFont: SubmitHandler<CustomFontInputData> = (values) => {
    console.log('handleRegisterFont', values);
    onFontRegistered(values.url, values.isBold, values.isItalic);
  };

  return (
    <FormProvider {...methods}>
      <Card
        variant="outlined"
        component={'form'}
        onSubmit={handleSubmit(handleRegisterFont)}
        noValidate
      >
        <FormGroup>
          <Grid container spacing={2} direction={'column'} padding={1}>
            <Grid>
              <TextField
                required
                label="Font URL"
                variant="outlined"
                name="url"
                defaultValue={'https://www.google.com'}
              />
            </Grid>
            <Grid container spacing={0} direction={'row'}>
              <Grid>
                <CheckboxField label="Is bold?" name="isBold"></CheckboxField>
              </Grid>
              <Grid columnSpacing={1}>
                <CheckboxField
                  label="Is italic?"
                  name="isItalic"
                ></CheckboxField>
              </Grid>
            </Grid>

            <Grid display="flex" justifyContent="center" alignItems="center">
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isLoading}
                loadingPosition={'start'}
                startIcon={<FontDownloadIcon />}
              >
                {isLoading ? 'Registering...' : 'Register'}
              </LoadingButton>
            </Grid>
          </Grid>
        </FormGroup>
      </Card>
    </FormProvider>
  );
};

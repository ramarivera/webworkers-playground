// Write a CustomFontInput component that will use Material UI to render a component with:
// a TextField for the font URL
// a Checkbox for bold
// a Checkbox for italic
// a LoadingButton from Material UI that when clicked will call onFontRegistered callback prop with the font url, bold and italic values.

import { zodResolver } from '@hookform/resolvers/zod';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import LoadingButton from '@mui/lab/LoadingButton';
import Card from '@mui/material/Card';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import {
  FormProvider,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { TypeOf, coerce, object, string } from 'zod';

import { useShowNotifications } from '../../core/notifications/hooks';
import { wrapValidatableSchema } from '../../core/utils/forms';

const customFontInputSchema = object({
  url: string().url('A valid font URL is required'),
  name: string().nonempty('A name is required'),
  isBold: coerce.boolean(),
  isItalic: coerce.boolean(),
});

export type CustomFontInputData = TypeOf<typeof customFontInputSchema>;

const { TextField, CheckboxField } = wrapValidatableSchema(
  customFontInputSchema,
);

export interface CustomFontInputProps {
  initialValues?: CustomFontInputData;
  isLoading: boolean;
  onFontRegistered: (
    name: string,
    url: string,
    isBold: boolean,
    isItalic: boolean,
  ) => void;
}

export const CustomFontInput: React.FC<CustomFontInputProps> = ({
  isLoading,
  initialValues,
  onFontRegistered,
}) => {
  const { warning } = useShowNotifications();

  const formMethods = useForm<CustomFontInputData>({
    resolver: zodResolver(customFontInputSchema),
    values: initialValues,
  });

  const { handleSubmit } = formMethods;

  // useEffect(() => {
  //   if (isSubmitSuccessful) {
  //     reset();
  //   }
  // }, [isSubmitSuccessful, reset]);

  const handleRegisterFont: SubmitHandler<CustomFontInputData> = (values) => {
    onFontRegistered(values.name, values.url, values.isBold, values.isItalic);
  };

  const handleValidationError: SubmitErrorHandler<CustomFontInputData> = (
    errors,
  ) => {
    const firstErrorKey = Object.keys(errors)[0];
    warning(`Error validating ${firstErrorKey} field`);
  };

  return (
    <FormProvider {...formMethods}>
      <Card
        variant="outlined"
        component={'form'}
        onSubmit={handleSubmit(handleRegisterFont, handleValidationError)}
        noValidate
      >
        <FormGroup>
          <Grid container spacing={2} direction={'column'} padding={1}>
            <Grid>
              <Typography textAlign={'center'} variant="h5">
                Custom font
              </Typography>
            </Grid>
            <Grid>
              <TextField required label="Name" variant="outlined" name="name" />
            </Grid>
            <Grid>
              <TextField
                required
                label="Font URL"
                variant="outlined"
                name="url"
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

import {
  Checkbox,
  CheckboxProps,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  TextField,
  TextFieldProps,
  Typography,
} from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';
import { TypeOf, ZodTypeAny } from 'zod';

type ValidatableTextFieldProps<TSchema extends ZodTypeAny> = TextFieldProps & {
  name: keyof TSchema;
};

const ValidatableTextField = <TSchema extends ZodTypeAny>({
  name,
  defaultValue,
  ...otherProps
}: ValidatableTextFieldProps<TSchema>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      // @ts-expect-error accessing zod schema by key, this is expected
      defaultValue={defaultValue}
      render={({ field }) => (
        <TextField
          {...otherProps}
          {...field}
          error={!!errors[name]}
          helperText={errors[name]?.message?.toString() ?? ''}
        />
      )}
    />
  );
};

export const WrapValidatableTextField = <TSchema extends ZodTypeAny>(
  schema: TSchema,
) => {
  type SchemaInput = TypeOf<typeof schema>;

  const ValidatableTextFieldWrapper = (
    props: ValidatableTextFieldProps<SchemaInput>,
  ) => {
    return <ValidatableTextField<SchemaInput> {...props} />;
  };

  return ValidatableTextFieldWrapper;
};

type ValidatableCheckboxFieldProps<TSchema extends ZodTypeAny> =
  CheckboxProps & {
    name: keyof TSchema;
    label: string;
  };

const ValidatableCheckboxField = <TSchema extends ZodTypeAny>({
  name,
  ...otherProps
}: ValidatableCheckboxFieldProps<TSchema>) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormGroup>
          <FormControlLabel
            control={<Checkbox {...field} />}
            label={
              <Typography color={errors[name] ? 'error' : 'inherit'}>
                {otherProps.label}
              </Typography>
            }
          />
          <FormHelperText error={!!errors[name]}>
            {errors[name]?.message?.toString() ?? ''}
          </FormHelperText>
        </FormGroup>
      )}
    />
  );
};

export const WrapValidatableCheckboxField = <TSchema extends ZodTypeAny>(
  schema: TSchema,
) => {
  type SchemaInput = TypeOf<typeof schema>;

  const ValidatableCheckboxFieldWrapper = (
    props: ValidatableCheckboxFieldProps<SchemaInput>,
  ) => {
    return <ValidatableCheckboxField<SchemaInput> {...props} />;
  };

  return ValidatableCheckboxFieldWrapper;
};

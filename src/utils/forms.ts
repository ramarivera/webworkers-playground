import { ZodTypeAny } from 'zod';

import {
  WrapValidatableCheckboxField,
  WrapValidatableTextField,
} from './components';

export const wrapValidatableSchema = <TSchema extends ZodTypeAny>(
  schema: TSchema,
) => {
  return {
    TextField: WrapValidatableTextField(schema),
    CheckboxField: WrapValidatableCheckboxField(schema),
  };
};

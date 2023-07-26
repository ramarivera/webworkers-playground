/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCallback, useState } from 'react';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import { useShowNotifications } from '../../core/notifications/hooks';
import { delay } from '../../core/utils/async';
import { isPromise } from '../../core/utils/checkers';
import {
  CustomFontInput,
  CustomFontInputData,
} from '../../fonts/components/CustomFontInput';
import {
  CUSTOM_FONT_DISPLAY_KEY,
  DEFAULT_FONT_SIZE,
} from '../../fonts/constants';
import { useFontRegistry } from '../../fonts/hooks';
import { buildCssStringForFont } from '../../fonts/utils';
import { useTextMeasurer } from '../hooks';
import { TextMeasurerType } from '../measurers/types';

import { TextMeasurerUI } from './TextMeasurerUI';

export type TextMeasurerProps = {
  initialText: string;
  measurerType: TextMeasurerType;
  selectedFont: string | 'custom';
  customFontUrl?: string;
  customFontIsBold?: boolean;
  customFontIsItalic?: boolean;
};

export const TextMeasurer: React.FC<TextMeasurerProps> = ({
  initialText,
  measurerType,
  selectedFont,
  customFontUrl,
  customFontIsBold,
  customFontIsItalic,
}) => {
  const [text, setText] = useState<string>(initialText);
  const [measurementResult, setMeasurementResult] = useState<number | null>(
    null,
  );
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [isCustomFontLoading, setIsCustomFontLoading] =
    useState<boolean>(false);

  const textMeasurer = useTextMeasurer(measurerType);
  const { selectedFontData, fonts, registerFont } =
    useFontRegistry(selectedFont);
  const { info, success, warning } = useShowNotifications();

  const isCustomFontEnabled = selectedFont === 'custom';

  let customFontInitialValues: undefined | CustomFontInputData;

  if (isCustomFontEnabled) {
    if (selectedFontData) {
      // Means that selected font is custom, and font has been registered
      customFontInitialValues = {
        name: selectedFontData.font,
        url: selectedFontData.url,
        isBold: selectedFontData.isBold,
        isItalic: selectedFontData.isItalic,
      };
    } else {
      // Means that selected font is custom, but font hasn't been registered yet
      customFontInitialValues = {
        name: '',
        url: customFontUrl ?? '',
        isBold: customFontIsBold ?? false,
        isItalic: customFontIsItalic ?? false,
      };
    }
  }

  const selectedFontCssString =
    selectedFontData &&
    buildCssStringForFont(
      selectedFontData.font,
      selectedFontData.isBold,
      selectedFontData.isItalic,
    );

  const handleMeasureClicked = useCallback(
    async (textToMeasure: string) => {
      if (!selectedFontData) {
        info('Please select a font to measure text with.');
        return;
      }

      setIsMeasuring(true);

      const result = textMeasurer
        .withText(textToMeasure)
        .withBold(selectedFontData.isBold)
        .withItalic(selectedFontData.isItalic)
        .withFont(selectedFontData.font)
        .withSize(DEFAULT_FONT_SIZE)
        .calculateWidth();

      if (isPromise(result)) {
        const measurement = await result;
        setMeasurementResult(measurement);
      } else {
        setMeasurementResult(result);
      }

      setIsMeasuring(false);
    },
    [selectedFontData, textMeasurer, info],
  );

  const handleRegisterCustomFontClicked = useCallback(
    async (name: string, url: string, isBold: boolean, isItalic: boolean) => {
      setIsCustomFontLoading(true);

      try {
        await delay(1500);
        await registerFont({
          font: name,
          displayName: CUSTOM_FONT_DISPLAY_KEY,
          url,
          isBold,
          isItalic,
        });
        success('Custom font registered successfully.');
      } catch (error) {
        warning('Failed to register custom font.');
      } finally {
        setIsCustomFontLoading(false);
      }
    },
    [registerFont, success, warning],
  );

  return (
    <Paper elevation={5}>
      <Typography textAlign={'center'} variant="h2">
        Welcome
      </Typography>
      <Grid container spacing={2} direction={'row'} padding={2}>
        <Grid>
          {isCustomFontEnabled && (
            <CustomFontInput
              initialValues={customFontInitialValues}
              isLoading={isCustomFontLoading}
              onFontRegistered={handleRegisterCustomFontClicked}
            />
          )}
        </Grid>

        <Grid>
          <TextMeasurerUI
            text={text}
            cssFontString={selectedFontCssString}
            measurementResult={measurementResult}
            onMeasureClicked={handleMeasureClicked}
            onTextChanged={setText}
            isLoading={isMeasuring}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

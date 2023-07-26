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
import { FontList } from '../../fonts/components/FontList';
import {
  CUSTOM_FONT_DISPLAY_KEY,
  DEFAULT_FONT_SIZE,
} from '../../fonts/constants';
import { useFontRegistry } from '../../fonts/hooks';
import { RegisteredFontData } from '../../fonts/types';
import { buildCssStringForFont } from '../../fonts/utils';
import { useTextMeasurer } from '../hooks';
import { TextMeasurerType } from '../measurers/types';

import { TextMeasurer } from './TextMeasurer';

export type TextMeasurerPageProps = {
  initialText: string;
  measurerType: TextMeasurerType;
  selectedFontId?: string;
  customFontsEnabled?: boolean;
  customFontUrl?: string;
  customFontIsBold?: boolean;
  customFontIsItalic?: boolean;
};

export const TextMeasurerPage: React.FC<TextMeasurerPageProps> = ({
  initialText,
  measurerType,
  selectedFontId,
  customFontsEnabled,
  customFontUrl,
  customFontIsBold,
  customFontIsItalic,
}) => {
  const [text, setText] = useState<string>(initialText);
  const [currentFontId, setCurrentFontId] = useState<string>(
    selectedFontId ?? '',
  );
  const [measurementResult, setMeasurementResult] = useState<number | null>(
    null,
  );
  const [isMeasuring, setIsMeasuring] = useState<boolean>(false);
  const [isCustomFontLoading, setIsCustomFontLoading] =
    useState<boolean>(false);

  const textMeasurer = useTextMeasurer(measurerType);
  const { selectedFontData, fonts, registerFont } =
    useFontRegistry(currentFontId);

  const { info, success, warning } = useShowNotifications();

  const isCustomFontEnabled = customFontsEnabled === true;

  let customFontInitialValues: undefined | CustomFontInputData;

  if (isCustomFontEnabled) {
    if (selectedFontData?.isCustom) {
      // Means that selected font is custom, and font has been registered
      customFontInitialValues = {
        name: selectedFontData.font,
        displayName: selectedFontData.displayName,
        url: selectedFontData.url,
        isBold: selectedFontData.isBold,
        isItalic: selectedFontData.isItalic,
      };
    } else {
      // Means that selected font is custom, but font hasn't been registered yet
      customFontInitialValues = {
        name: '',
        displayName: '',
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

  console.log('css is ', selectedFontCssString);
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
    async (
      name: string,
      url: string,
      isBold: boolean,
      isItalic: boolean,
      displayName?: string,
    ) => {
      setIsCustomFontLoading(true);

      try {
        await delay(1500);
        await registerFont({
          font: name,
          displayName: displayName
            ? `${displayName} (custom)`
            : `${name} (custom)}`,
          url,
          isBold,
          isItalic,
          isCustom: true,
        });
        success(
          `Custom font '${displayName ?? name}' registered successfully.`,
        );
      } catch (error) {
        warning('Failed to register custom font.');
      } finally {
        setIsCustomFontLoading(false);
      }
    },
    [registerFont, success, warning],
  );

  const handleFontChanged = useCallback(
    (font: RegisteredFontData) => {
      setCurrentFontId(font.id);
    },
    [setCurrentFontId],
  );

  return (
    <Paper elevation={5}>
      <Typography textAlign={'center'} variant="h2">
        Welcome
      </Typography>
      <Grid container spacing={2} direction={'row'} padding={2}>
        <Grid container direction={'column'} spacing={2} xs={6}>
          <Grid>
            <FontList
              fonts={fonts}
              selectedFont={selectedFontData}
              onFontSelected={handleFontChanged}
            ></FontList>
          </Grid>
          <Grid>
            {isCustomFontEnabled && (
              <CustomFontInput
                initialValues={customFontInitialValues}
                isLoading={isCustomFontLoading}
                onFontRegistered={handleRegisterCustomFontClicked}
              />
            )}
          </Grid>
        </Grid>

        <Grid xs={6}>
          <TextMeasurer
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

import React, { useCallback, useMemo } from 'react';

import Card from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import { RegisteredFontData } from '../types';

const TEST_IDS = {
  FONT_LIST: 'font-input-list',
  FONT_LIST_LABEL: 'font-input-list-label',
  FONT_SIZE_INPUT: 'font-input-size',
  FONT_SIZE_INPUT_LABEL: 'font-input-size-label',
};

interface FontInputProps {
  fonts: RegisteredFontData[];
  selectedFont?: RegisteredFontData;
  fontSize: number;
  onFontSizeChanged?: (fontSize: number) => void;
  onFontSelected?: (font: RegisteredFontData) => void;
}

export const FontInput: React.FC<FontInputProps> = ({
  fonts,
  selectedFont,
  onFontSelected,
  fontSize,
  onFontSizeChanged,
}) => {
  const currentFontsById = useMemo(() => {
    return fonts.reduce(
      (acc, font) => {
        acc[font.id] = font;
        return acc;
      },
      {} as Record<string, RegisteredFontData>,
    );
  }, [fonts]);

  const [currentFont, setCurrentFont] = React.useState<
    RegisteredFontData | undefined
  >(selectedFont);

  const handleFontSelected = useCallback(
    (event: SelectChangeEvent) => {
      const fontId = event.target.value;
      const font = currentFontsById[fontId];

      if (font) {
        setCurrentFont(font);
        onFontSelected?.(font);
      }
    },
    [currentFontsById, onFontSelected],
  );

  const handleFontSizeChanged = (
    event: React.ChangeEvent<{ value: unknown }>,
  ) => {
    onFontSizeChanged?.(event.target.value as number);
  };

  const currentFontId =
    selectedFont?.id ?? currentFont?.id ?? fonts?.[0]?.id ?? '';

  return (
    <Card>
      <Grid container direction={'column'} spacing={2} padding={1}>
        <Grid>
          <Typography variant="h6" textAlign={'center'}>
            Fonts
          </Typography>
        </Grid>
        <Grid>
          <FormControl>
            <InputLabel id={TEST_IDS.FONT_LIST_LABEL}>Font</InputLabel>
            <Select
              id={TEST_IDS.FONT_LIST}
              labelId={TEST_IDS.FONT_LIST_LABEL}
              label="Font"
              style={{ minWidth: '200px' }}
              value={currentFontId}
              onChange={handleFontSelected}
            >
              {fonts.map((font) => (
                <MenuItem key={font.id} value={font.id}>
                  {font.displayName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid>
          <TextField
            id={TEST_IDS.FONT_SIZE_INPUT}
            label="Font Size"
            variant="outlined"
            type="number"
            value={fontSize}
            onChange={handleFontSizeChanged}
          />
        </Grid>
      </Grid>
    </Card>
  );
};

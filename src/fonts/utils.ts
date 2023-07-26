import { DEFAULT_FONT_SIZE } from './constants';
import { PredefinedFont, FontRegistrationData } from './types';

export function buildCssStringForFont(
  fontName: string,
  isBold: boolean,
  isItalic: boolean,
  fontSize: number = DEFAULT_FONT_SIZE,
) {
  let fontString = '';

  if (isBold) {
    fontString += 'bold ';
  }

  if (isItalic) {
    fontString += 'italic ';
  }

  fontString += `${fontSize}px "${fontName}"`;

  return fontString;
}

export function buildCssStringForFontWithoutSize(
  fontName: string,
  isBold: boolean,
  isItalic: boolean,
) {
  let fontString = '';

  if (isBold) {
    fontString += 'bold ';
  }

  if (isItalic) {
    fontString += 'italic ';
  }

  fontString += `"${fontName}"`;

  return fontString;
}

export function convertPredefinedFontToFontRegistrationData(
  predefinedFont: PredefinedFont,
): FontRegistrationData {
  return {
    font: predefinedFont.name,
    displayName: predefinedFont.display,
    url: predefinedFont.url,
    isBold: predefinedFont.bold,
    isItalic: predefinedFont.italic,
    isCustom: false,
  };
}

export function buildFontMetadata(isBold: boolean, isItalic: boolean) {
  const weight = isBold ? 'bold' : 'normal';
  const style = isItalic ? 'italic' : 'normal';

  return {
    weight,
    style,
  };
}

export function generateIdForFontRegistrationData(
  fontRegistrationData: Omit<FontRegistrationData, 'isCustom'>,
) {
  const { font, displayName, isBold, isItalic, url } = fontRegistrationData;
  const weight = isBold ? 'bold' : 'normal';
  const style = isItalic ? 'italic' : 'normal';

  return `${font}-(${displayName})-${weight}-${style}-${url}`;
}

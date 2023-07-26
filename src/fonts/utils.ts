import { DEFAULT_FONT_SIZE } from './constants';

export function buildCssStringForFont(
  fontName: string,
  isBold: boolean,
  isItalic: boolean,
  fontSize: number = DEFAULT_FONT_SIZE,
) {
  const fontString = `${fontSize}px "${buildCssStringForFontWithoutSize(
    fontName,
    isBold,
    isItalic,
  )}"`;

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

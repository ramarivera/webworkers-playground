import { DEFAULT_FONT_SIZE } from './constants';

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

  fontString += `${fontSize}px ${fontName}`;

  return fontString;
}

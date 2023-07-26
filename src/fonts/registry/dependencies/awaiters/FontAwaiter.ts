export interface FontAwaiter {
  waitForFontToLoad(
    font: string,
    url: string,
    isBold: boolean,
    isItalic: boolean,
  ): Promise<FontFace | null>;

  waitForFontFaceToLoad(
    font: string,
    isBold: boolean,
    isItalic: boolean,
    url: string,
    fontFace: FontFace,
  ): Promise<FontFace | null>;
}

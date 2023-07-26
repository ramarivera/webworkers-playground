/**
 * This interface allows to observe events within the FontRegistry and react accordingly.
 */
export interface FontObserver {
  /**
   *  Required to add font to document before starting to await them.
   */
  loading?(
    fontName: string,
    url: string,
    isBold: boolean,
    isItalic: boolean,
  ): void;

  /**
   * Called once the font is safely loaded inside the registry.
   */
  loaded?(
    fontName: string,
    url: string,
    isBold: boolean,
    isItalic: boolean,
    fontFace: FontFace,
  ): void;

  /**
   * Called when there is an error with font loading
   */
  errored?(
    fontName: string,
    url: string,
    isBold: boolean,
    isItalic: boolean,
    fontFace?: FontFace,
  ): void;
}

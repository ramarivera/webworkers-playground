export interface FontRegistrationData {
  displayName: string;
  font: string;
  isBold: boolean;
  isItalic: boolean;
  url: string;
  isCustom: boolean;
}

export interface RegisteredFontData extends FontRegistrationData {
  id: string;
}

export interface PredefinedFont {
  display: string;
  name: string;
  bold: boolean;
  italic: boolean;
  url: string;
}

interface CommonColor {
  primary: string;
  success: string;
  danger: string;
}

interface ThemeColor {
  body: string;
  font: string;
  fontInverse: string;
  bg: string;
  bgHover: string;
  bgActive: string;
  wrapper: string;
  border: string;
  boxShadow: string;

  prismGrey: string;
  prismBlue: string;
  prismCyan: string;
  prismEntity: string;
  prismGreen: string;
  prismYellow: string;
  prismOrange: string;
}

export const common: CommonColor;

export const light: ThemeColor;

export const dark: ThemeColor;

interface BgDefinition {
  bgGray: string;
  bgGray15: string;
  bgGray25: string;
  bgGray50: string;
  bgGray75: string;
  bgGray100: string;
  bgDarkGray25: string;
  bgDarkGray50: string;
  bgDarkGray75: string;
  bgDarkGray100: string;
}

interface StatusDefinition {
  error: string;
  success: string;
  info: string;
}

interface FontsDefinition {
  primary: string;
  secondary: string;
}

export interface ColorsDefinition {
  status: StatusDefinition;
  fonts: FontsDefinition;
  bg: BgDefinition;
}

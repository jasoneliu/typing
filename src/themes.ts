// For typescript compatibility
declare module "styled-components" {
  export interface DefaultTheme extends ITheme {}
}

// Theme interface
export interface ITheme {
  colors: {
    background: string;
    primary: string;
    secondary: string;
    accent: string;
    error: string;
    errorExtra: string;
  };
}

// All themes
export const dark: ITheme = {
  colors: {
    background: "#242D35",
    primary: "#FFFFFF",
    secondary: "#526170",
    accent: "#7FE4D2",
    error: "#FB6396",
    errorExtra: "#F92D72",
  },
};

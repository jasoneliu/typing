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
    background: "hsl(208, 19%, 17%)",
    primary: "hsl(0, 100%, 100%)",
    secondary: "hsl(210, 15%, 38%)",
    accent: "hsla(169, 65%, 70%)",
    error: "hsl(340, 95%, 69%)",
    errorExtra: "hsl(340, 95%, 48%)",
  },
};

export const light: ITheme = {
  // colors: {
  //   background: "hsl(0, 100%, 100%)",
  //   primary: "hsl(208, 19%, 7%)",
  //   secondary: "hsl(210, 15%, 68%)",
  //   accent: "hsla(179, 95%, 40%)",
  //   error: "hsl(340, 95%, 48%)",
  //   errorExtra: "hsl(340, 95%, 79%)",
  // },

  // temporary "sakura" theme
  // TODO: Create menu for more than two themes
  colors: {
    background: "hsl(350, 100%, 80%)",
    primary: "hsl(350, 100%, 100%)",
    secondary: "hsl(350, 100%, 90%)",
    accent: "hsl(350, 75%, 25%)",
    error: "hsl(350, 100%, 65%)",
    errorExtra: "hsl(350, 100%, 72%)",
  },
};

export type themeType = "dark" | "light";

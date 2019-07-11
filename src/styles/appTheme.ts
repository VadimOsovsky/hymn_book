import { Colors, DefaultTheme, Theme } from "react-native-paper";

export interface MyTheme extends Theme {
  colors: {
    primary: string
    primaryDark: string
    background: string
    surface: string
    accent: string
    error: string
    info: string
    text: string
    headerText: string
    disabled: string
    placeholder: string
    backdrop: string
    highlight: string
    surfaceAlt: string,
  };
}

export const lightTheme: MyTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.teal500,
    primaryDark: "#34495d",
    background: "#F9F9F9",
    accent: Colors.teal500,
    headerText: Colors.white,
    highlight: "#DDD",
    surfaceAlt: Colors.black,
    error: Colors.redA200,
    info: Colors.blue600,
  },
};

export const darkTheme: MyTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.teal500,
    primaryDark: Colors.teal700,
    background: "#363e4d",
    surface: "#34495d",
    accent: Colors.teal500,
    error: Colors.redA200,
    info: Colors.blue600,
    text: Colors.white,
    headerText: Colors.white,
    disabled: Colors.grey500,
    placeholder: Colors.grey400,
    highlight: "#435d77",
    surfaceAlt: Colors.white,
  },
};

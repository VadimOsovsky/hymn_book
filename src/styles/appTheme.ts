import { Colors, DefaultTheme } from "react-native-paper";

export const lightTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.teal500,
    primaryDark: Colors.teal700,
    accent: Colors.teal500,
    danger: Colors.redA200
  }
};

export const darkTheme = {

};

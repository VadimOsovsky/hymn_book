import { MyTheme } from "../styles/appTheme";

export const SET_THEME = "SET_THEME";

export function setTheme(theme: MyTheme) {
  return {type: SET_THEME, payload: theme}
}

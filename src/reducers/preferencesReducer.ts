import Action from "../models/Action";
import { lightTheme, MyTheme } from "../styles/appTheme";
import { SET_THEME } from "../actions/preferencesActions";


export interface PreferencesInterface {
  lang: string
  theme: MyTheme
}

const INITIAL_STATE: PreferencesInterface = {
  lang: "en",
  theme: lightTheme,
};

export default (state = INITIAL_STATE, action: Action): PreferencesInterface => {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
    default:
      return state
  }
};

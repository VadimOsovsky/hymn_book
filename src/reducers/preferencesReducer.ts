import {
  GET_PREFS_FROM_STORAGE_ERROR,
  GET_PREFS_FROM_STORAGE_REQUEST,
  GET_PREFS_FROM_STORAGE_SUCCESS,
  SET_LANG,
  SET_PREFS_TO_STORAGE_ERROR,
  SET_PREFS_TO_STORAGE_REQUEST,
  SET_PREFS_TO_STORAGE_SUCCESS,
  SET_THEME,
} from "../actions/preferencesActions";
import Action from "../models/Action";
import { lightTheme, MyTheme } from "../styles/appTheme";

export interface UserPrefs {
  lang: string;
  theme: MyTheme;
}

export interface Preferences {
  userPrefs: UserPrefs;
  isPrefsReady: boolean;
  error: string;
}

const INITIAL_STATE: Preferences = {
  userPrefs: {
    lang: "en",
    theme: lightTheme,
  },
  isPrefsReady: false,
  error: "",
};

export default (state = INITIAL_STATE, action: Action): Preferences => {
  switch (action.type) {
    case SET_THEME:
      return {
        ...state,
        userPrefs: {
          ...state.userPrefs,
          theme: action.payload,
        },
      };

    case SET_LANG:
      return {
        ...state,
        userPrefs: {
          ...state.userPrefs,
          lang: action.payload,
        },
      };

    case SET_PREFS_TO_STORAGE_REQUEST:
    case GET_PREFS_FROM_STORAGE_REQUEST:
      return {
        ...state,
        error: "",
      };

    case GET_PREFS_FROM_STORAGE_SUCCESS:
      return {
        ...state,
        userPrefs: action.payload,
        isPrefsReady: true,
      };

    case SET_PREFS_TO_STORAGE_SUCCESS:
      return {...state};

    case SET_PREFS_TO_STORAGE_ERROR:
    case GET_PREFS_FROM_STORAGE_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

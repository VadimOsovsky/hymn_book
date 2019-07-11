import { getLanguages } from "react-native-i18n";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../reducers";
import { MyTheme } from "../styles/appTheme";
import StorageUtils from "../utils/StorageUtils";

export const SET_THEME = "SET_THEME";

export function setTheme(theme: MyTheme) {
  return (dispatch: ThunkDispatch<{}, {}, any>) => {
    dispatch({type: SET_THEME, payload: theme});
    dispatch(setUserPrefsToStorage());
  };
}

export const SET_LANG = "SET_LANG";

export function setLang(lang: string) {
  return (dispatch: ThunkDispatch<{}, {}, any>) => {
    dispatch({type: SET_LANG, payload: lang});
    dispatch(setUserPrefsToStorage());
  };
}

export const GET_PREFS_FROM_STORAGE_REQUEST = "GET_PREFS_FROM_STORAGE_REQUEST";
export const GET_PREFS_FROM_STORAGE_SUCCESS = "GET_PREFS_FROM_STORAGE_SUCCESS";
export const GET_PREFS_FROM_STORAGE_ERROR = "GET_PREFS_FROM_STORAGE_ERROR";

export function getUserPrefsFromStorage() {
  return async (dispatch: ThunkDispatch<{}, {}, any>, getState: () => AppState) => {
    dispatch({type: GET_PREFS_FROM_STORAGE_REQUEST});
    try {
      const userPrefs: string | null = await StorageUtils.getUserPrefs();
      if (userPrefs) {
        dispatch({type: GET_PREFS_FROM_STORAGE_SUCCESS, payload: JSON.parse(userPrefs)});
      } else {
        const langs = await getLanguages();
        dispatch(setLang(langs[0] || "en-US"));
        dispatch({type: GET_PREFS_FROM_STORAGE_SUCCESS, payload: getState().prefs!.userPrefs});
      }
    } catch (err) {
      dispatch({type: GET_PREFS_FROM_STORAGE_ERROR, payload: err});
    }
  };
}

export const SET_PREFS_TO_STORAGE_REQUEST = "SET_PREFS_TO_STORAGE_REQUEST";
export const SET_PREFS_TO_STORAGE_SUCCESS = "SET_PREFS_TO_STORAGE_SUCCESS";
export const SET_PREFS_TO_STORAGE_ERROR = "SET_PREFS_TO_STORAGE_ERROR";

export function setUserPrefsToStorage() {
  return async (dispatch: ThunkDispatch<{}, {}, any>, getState: () => AppState) => {
    dispatch({type: SET_PREFS_TO_STORAGE_REQUEST});
    try {
      await StorageUtils.setUserPrefs(getState().prefs!.userPrefs);
      dispatch({type: SET_PREFS_TO_STORAGE_SUCCESS});
    } catch (err) {
      dispatch({type: SET_PREFS_TO_STORAGE_ERROR, payload: err});
    }
  };
}

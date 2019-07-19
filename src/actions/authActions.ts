import axios from "axios";
import { getLanguages } from "react-native-i18n";
import { NavigationActions } from "react-navigation";
import { ThunkDispatch } from "redux-thunk";
import User from "../models/User";
import { screens as rootStackScreens } from "../navigation/rootStack";
import { screens as savedHymnScreens } from "../navigation/savedHymnsStack";
import { BASE_URL } from "../utils/config";
import getErrMsg from "../utils/getErrMsg";
import StorageUtils from "../utils/StorageUtils";

export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const SIGNUP_ERROR = "SIGNUP_ERROR";

export function signup(newUser: User) {
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    dispatch({type: SIGNUP_REQUEST});

    const languages = await getLanguages();
    newUser.language = languages[0].slice(0, 2);

    try {
      const res = await axios.post(BASE_URL + "/signup", newUser);
      dispatch({type: SIGNUP_SUCCESS, payload: res.data});
      dispatch(setTokenToStorage(res.data.token));
      dispatch(setUserToStorage(res.data.newUser));

      dispatch(NavigationActions.navigate({routeName: savedHymnScreens.SAVED_HYMNS}));
    } catch (err) {
      dispatch({type: SIGNUP_ERROR, payload: {err: getErrMsg(err)}});
    }
  };
}

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_ERROR = "LOGIN_ERROR";

export function login(email: string, password: string) {
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    dispatch({type: LOGIN_REQUEST});

    try {
      const res = await axios.post(BASE_URL + "/login", {email, password});
      dispatch({type: LOGIN_SUCCESS, payload: res.data});
      dispatch(setTokenToStorage(res.data.token));
      dispatch(setUserToStorage(res.data.user));

      dispatch(NavigationActions.navigate({routeName: savedHymnScreens.SAVED_HYMNS}));
    } catch (err) {
      dispatch({type: LOGIN_ERROR, payload: {err: getErrMsg(err)}});
    }
  };
}

export const LOGOUT = "LOGOUT";

export function logout() {
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    dispatch({type: LOGOUT});
    dispatch(deleteTokenFromStorage());
    dispatch(deleteUserFromStorage());

    dispatch(NavigationActions.navigate({routeName: rootStackScreens.AUTH}));
  };
}

export const GET_TOKEN_FROM_STORAGE_REQUEST = "GET_TOKEN_FROM_STORAGE_REQUEST";
export const GET_TOKEN_FROM_STORAGE_SUCCESS = "GET_TOKEN_FROM_STORAGE_SUCCESS";

export function getTokenFromStorage() {
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    dispatch({type: GET_TOKEN_FROM_STORAGE_REQUEST});
    try {
      const token = await StorageUtils.getToken();
      dispatch({type: GET_TOKEN_FROM_STORAGE_SUCCESS, payload: {token}});
    } catch (err) {
      console.warn("set token to storage error", err);
    }
  };
}

function setTokenToStorage(token: string) {
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    try {
      await StorageUtils.setToken(token);
    } catch (err) {
      console.warn("set token to storage error", err);
    }
  };
}

function deleteTokenFromStorage() {
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    try {
      await StorageUtils.deleteToken();
    } catch (err) {
      console.warn("set user to storage error", err);
    }
  };
}

export const GET_USER_FROM_STORAGE_REQUEST = "GET_USER_FROM_STORAGE_REQUEST";
export const GET_USER_FROM_STORAGE_SUCCESS = "GET_USER_FROM_STORAGE_SUCCESS";

export function getUserFromStorage() {
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    dispatch({type: GET_USER_FROM_STORAGE_REQUEST});
    try {
      const user = await StorageUtils.getUser();
      dispatch({type: GET_USER_FROM_STORAGE_SUCCESS, payload: {user: user ? JSON.parse(user) : null}});
    } catch (err) {
      console.warn("set token to storage error", err);
    }
  };
}

function setUserToStorage(user: User) {
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    try {
      await StorageUtils.setUser(user);
    } catch (err) {
      console.warn("set user to storage error", err);
    }
  };
}

function deleteUserFromStorage() {
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    try {
      await StorageUtils.deleteUser();
    } catch (err) {
      console.warn("set user to storage error", err);
    }
  };
}

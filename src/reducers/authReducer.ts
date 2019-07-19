import {
  GET_TOKEN_FROM_STORAGE_SUCCESS,
  GET_USER_FROM_STORAGE_SUCCESS,
  LOGIN_ERROR,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  SIGNUP_ERROR,
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
} from "../actions/authActions";
import Action from "../models/Action";
import User from "../models/User";

export interface UserInterface {
  token: string | null;
  isTokenReady: boolean;
  user: User | null;
  isUserReady: boolean;
  signupLoading: boolean;
  loginLoading: boolean;
  signupError: string;
  loginError: string;
}

const INITIAL_STATE: UserInterface = {
  token: null,
  isTokenReady: false,
  user: null,
  isUserReady: false,
  signupLoading: false,
  loginLoading: false,
  signupError: "",
  loginError: "",
};

export default (state = INITIAL_STATE, action: Action): UserInterface => {
  switch (action.type) {
    case SIGNUP_REQUEST:
      return {
        ...state,
        signupError: "",
        signupLoading: true,
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        signupLoading: false,
        token: action.payload.token,
        user: action.payload.newUser,
      };
    case SIGNUP_ERROR:
      return {
        ...state,
        signupLoading: false,
        signupError: action.payload.err,
      };
    case LOGIN_REQUEST:
      return {
        ...state,
        loginError: "",
        loginLoading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        loginLoading: false,
        token: action.payload.token,
        user: action.payload.user,
      };
    case LOGIN_ERROR:
      return {
        ...state,
        loginLoading: false,
        loginError: action.payload.err,
      };
    case LOGOUT:
      return {
        ...state,
        token: null,
        user: null,
      };
    case GET_TOKEN_FROM_STORAGE_SUCCESS:
      return {
        ...state,
        token: action.payload.token,
        isTokenReady: true,
      };
    case GET_USER_FROM_STORAGE_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isUserReady: true,
      };
    default:
      return state;
  }
};

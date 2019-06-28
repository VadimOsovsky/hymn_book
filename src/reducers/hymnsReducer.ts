import HymnItem from "../models/HymnItem";
import {
  ADD_TO_SAVED_HYMNS, EDIT_SAVED_HYMN,
  REMOVE_FROM_SAVED_HYMNS,
  GET_SAVED_HYMNS_FROM_STORAGE_ERROR,
  GET_SAVED_HYMNS_FROM_STORAGE_REQUEST,
  GET_SAVED_HYMNS_FROM_STORAGE_SUCCESS,
  SET_SAVED_HYMNS_FROM_STORAGE_ERROR,
  SET_SAVED_HYMNS_FROM_STORAGE_REQUEST,
  SET_SAVED_HYMNS_FROM_STORAGE_SUCCESS
} from "../actions/hymnActions";
import Action from "../models/Action";


export interface HymnsInterface {
  isLaunchingApp: boolean,
  savedHymns: HymnItem[]
  isSavedHymnsLoading: boolean
  isSavingHymnsToStorage: boolean
  error: string
}

const INITIAL_STATE: HymnsInterface = {
  isLaunchingApp: true,
  savedHymns: [],
  isSavedHymnsLoading: false,
  isSavingHymnsToStorage: false,
  error: "",
};

export default (state = INITIAL_STATE, action: Action): HymnsInterface => {
  switch (action.type) {

    case GET_SAVED_HYMNS_FROM_STORAGE_REQUEST:
      return {
        ...state,
        isSavedHymnsLoading: true,
        error: "",
      };

    case GET_SAVED_HYMNS_FROM_STORAGE_SUCCESS:
      return {
        ...state,
        isLaunchingApp: false,
        isSavedHymnsLoading: false,
        savedHymns: action.payload,
      };

    case GET_SAVED_HYMNS_FROM_STORAGE_ERROR:
      return {
        ...state,
        isSavedHymnsLoading: false,
        error: action.payload,
      };

    case SET_SAVED_HYMNS_FROM_STORAGE_REQUEST:
      return {
        ...state,
        isSavingHymnsToStorage: true,
        savedHymns: action.payload,
      };

    case SET_SAVED_HYMNS_FROM_STORAGE_SUCCESS:
      return {
        ...state,
        isSavingHymnsToStorage: false,
      };

    case SET_SAVED_HYMNS_FROM_STORAGE_ERROR:
      return {
        ...state,
        isSavingHymnsToStorage: false,
        error: action.payload,
      };

    case ADD_TO_SAVED_HYMNS:
    case EDIT_SAVED_HYMN:
    case REMOVE_FROM_SAVED_HYMNS:
      return {
        ...state,
        savedHymns: action.payload
      };

    default:
      return state
  }
};

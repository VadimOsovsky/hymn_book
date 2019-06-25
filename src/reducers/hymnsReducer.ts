import HymnItem from "../models/HymnItem";
import {
  ADD_TO_SAVED_HYMNS, EDIT_SAVED_HYMN,
  GET_SAVED_HYMNS_FROM_STORAGE_ERROR,
  GET_SAVED_HYMNS_FROM_STORAGE_REQUEST,
  GET_SAVED_HYMNS_FROM_STORAGE_SUCCESS, REMOVE_FROM_SAVED_HYMNS,
  SET_SAVED_HYMNS_FROM_STORAGE_ERROR,
  SET_SAVED_HYMNS_FROM_STORAGE_REQUEST
} from "../actions/hymnActions";
import Action from "../models/Action";


export interface HymnsInterface {
  isLaunchingApp: boolean,
  savedHymns: HymnItem[]
  isSavedHymnsLoading: boolean
  error: string
}

const INITIAL_STATE: HymnsInterface = {
  isLaunchingApp: true,
  savedHymns: [],
  isSavedHymnsLoading: false,
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
        savedHymns: action.payload,
      };

    case SET_SAVED_HYMNS_FROM_STORAGE_ERROR:
      return {
        ...state,
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

import {
  ADD_TO_SAVED_HYMNS, DELETE_HYMN_ERR,
  DELETE_HYMN_REQ, DELETE_HYMN_RES,
  EDIT_SAVED_HYMN,
  GET_SAVED_HYMNS_FROM_STORAGE_ERR,
  GET_SAVED_HYMNS_FROM_STORAGE_REQ,
  GET_SAVED_HYMNS_FROM_STORAGE_RES, PUBLISH_CHANGED_HYMN_ERR,
  PUBLISH_CHANGED_HYMN_REQ, PUBLISH_HYMN_ERR,
  PUBLISH_HYMN_REQ,
  REMOVE_FROM_SAVED_HYMNS,
  SET_SAVED_HYMNS_TO_STORAGE_ERR,
  SET_SAVED_HYMNS_TO_STORAGE_REQ,
  SET_SAVED_HYMNS_TO_STORAGE_RES,
} from "../actions/hymnActions";
import Action from "../models/Action";
import HymnItem from "../models/HymnItem";

export interface HymnsInterface {
  savedHymns: HymnItem[];
  savedHymnsLoading: boolean;
  doneHymnEditingLoading: boolean;
  deleteHymnLoading: boolean;
  error: string;
}

const INITIAL_STATE: HymnsInterface = {
  savedHymns: [],
  savedHymnsLoading: false,
  doneHymnEditingLoading: false,
  deleteHymnLoading: false,
  error: "",
};

export default (state = INITIAL_STATE, action: Action): HymnsInterface => {
  switch (action.type) {

    case GET_SAVED_HYMNS_FROM_STORAGE_REQ:
      return {
        ...state,
        savedHymnsLoading: true,
        error: "",
      };

    case GET_SAVED_HYMNS_FROM_STORAGE_RES:
      return {
        ...state,
        savedHymnsLoading: false,
        savedHymns: action.payload.savedHymns,
      };

    case GET_SAVED_HYMNS_FROM_STORAGE_ERR:
      return {
        ...state,
        savedHymnsLoading: false,
        error: action.payload.error,
      };

    case SET_SAVED_HYMNS_TO_STORAGE_REQ:
      return {
        ...state,
        doneHymnEditingLoading: true,
        savedHymns: action.payload.savedHymns,
        error: "",
      };

    case SET_SAVED_HYMNS_TO_STORAGE_RES:
      return {
        ...state,
        doneHymnEditingLoading: false,
      };

    case SET_SAVED_HYMNS_TO_STORAGE_ERR:
      return {
        ...state,
        doneHymnEditingLoading: false,
        error: action.payload.error,
      };

    case ADD_TO_SAVED_HYMNS:
    case EDIT_SAVED_HYMN:
    case REMOVE_FROM_SAVED_HYMNS:
      return {
        ...state,
        doneHymnEditingLoading: false,
        savedHymns: action.payload.savedHymns,
      };

    case PUBLISH_HYMN_REQ:
    case PUBLISH_CHANGED_HYMN_REQ:
      return {
        ...state,
        doneHymnEditingLoading: true,
        error: "",
      };
    case DELETE_HYMN_REQ:
      return {
        ...state,
        deleteHymnLoading: true,
        error: "",
      };
    case DELETE_HYMN_RES:
      return {
        ...state,
        deleteHymnLoading: false,
      };
    case PUBLISH_HYMN_ERR:
    case PUBLISH_CHANGED_HYMN_ERR:
      return {
        ...state,
        doneHymnEditingLoading: false,
        error: action.payload.error,
      };
    case DELETE_HYMN_ERR:
      return {
        ...state,
        deleteHymnLoading: false,
        error: action.payload.error,
      };
    default:
      return state;
  }
};

import _ from "lodash";
import { ThunkDispatch } from "redux-thunk";
import HymnItem from "../models/HymnItem";
import { AppState } from "../reducers";
import StorageUtils from "../utils/StorageUtils";

export const GET_SAVED_HYMNS_FROM_STORAGE_REQUEST = "GET_SAVED_HYMNS_FROM_STORAGE_REQUEST";
export const GET_SAVED_HYMNS_FROM_STORAGE_SUCCESS = "GET_SAVED_HYMNS_FROM_STORAGE_SUCCESS";
export const GET_SAVED_HYMNS_FROM_STORAGE_ERROR = "GET_SAVED_HYMNS_FROM_STORAGE_ERROR";

export function getSavedHymnsFromStorage() {
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    dispatch({type: GET_SAVED_HYMNS_FROM_STORAGE_REQUEST});

    try {
      const savedHymns: string | null = await StorageUtils.getSavedHymns();
      if (savedHymns && 1 > 4) {
        dispatch({type: GET_SAVED_HYMNS_FROM_STORAGE_SUCCESS, payload: JSON.parse(savedHymns)});
      } else {
        // else it's the first launch, prepopulate with dummy hymns
        const dummyHymns: HymnItem[] = HymnItem.getDummyHymns();
        dispatch({type: GET_SAVED_HYMNS_FROM_STORAGE_SUCCESS, payload: dummyHymns});
        dispatch(setSavedHymnToStorage(dummyHymns));
      }
    } catch (err) {
      dispatch({type: GET_SAVED_HYMNS_FROM_STORAGE_ERROR, payload: err});
    }
  };
}

export const SET_SAVED_HYMNS_TO_STORAGE_REQUEST = "SET_SAVED_HYMNS_TO_STORAGE_REQUEST";
export const SET_SAVED_HYMNS_TO_STORAGE_SUCCESS = "SET_SAVED_HYMNS_TO_STORAGE_SUCCESS";
export const SET_SAVED_HYMNS_TO_STORAGE_ERROR = "SET_SAVED_HYMNS_TO_STORAGE_ERROR";

export function setSavedHymnToStorage(savedHymns: HymnItem[]) {
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    dispatch({type: SET_SAVED_HYMNS_TO_STORAGE_REQUEST, payload: savedHymns});
    try {
      await StorageUtils.setSavedHymns(savedHymns);
      dispatch({type: SET_SAVED_HYMNS_TO_STORAGE_SUCCESS});
    } catch (err) {
      dispatch({type: SET_SAVED_HYMNS_TO_STORAGE_ERROR, payload: err});
    }
  };
}

export const ADD_TO_SAVED_HYMNS = "ADD_TO_SAVED_HYMNS";

export function addToSavedHymns(newHymn: HymnItem) {
  return (dispatch: ThunkDispatch<{}, {}, any>, getState: () => AppState) => {
    const updatedSavedHymns: HymnItem[] = [newHymn, ...getState().hymns!.savedHymns];

    dispatch(setSavedHymnToStorage(updatedSavedHymns));
    return {type: ADD_TO_SAVED_HYMNS, payload: updatedSavedHymns};
  };
}

export const EDIT_SAVED_HYMN = "EDIT_SAVED_HYMN";

export function editSavedHymn(updatedHymn: HymnItem) {
  return (dispatch: ThunkDispatch<{}, {}, any>, getState: () => AppState) => {
    const savedHymns: HymnItem[] = _.clone(getState().hymns!.savedHymns);

    savedHymns.forEach((hymn: HymnItem, index: number) => {
      if (hymn.hymnId === updatedHymn.hymnId) { savedHymns[index] = updatedHymn; }
    });

    dispatch(setSavedHymnToStorage(savedHymns));
    return {type: EDIT_SAVED_HYMN, payload: savedHymns};
  };
}

export const REMOVE_FROM_SAVED_HYMNS = "REMOVE_FROM_SAVED_HYMNS";

export function removeFromSavedHymns(hymnIds: string[]) {
  return (dispatch: ThunkDispatch<{}, {}, any>, getState: () => AppState) => {
    const oldSavedHymns: HymnItem[] = getState().hymns!.savedHymns;
    const updatedSavedHymns: HymnItem[] = [];

    oldSavedHymns.forEach((hymn: HymnItem) => {
      let removeHymn = false;

      for (const id of hymnIds) {
        if (hymn.hymnId === id) {
          removeHymn = true;
          break;
        }
      }

      if (!removeHymn) { updatedSavedHymns.push(hymn); }
    });
    dispatch(setSavedHymnToStorage(updatedSavedHymns));
    return {type: REMOVE_FROM_SAVED_HYMNS, payload: updatedSavedHymns};
  };
}

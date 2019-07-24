import axios from "axios";
import _ from "lodash";
import { ThunkDispatch } from "redux-thunk";
import HymnItem from "../models/HymnItem";
import { screens } from "../navigation/savedHymnsStack";
import { AppState } from "../reducers";
import { BASE_URL, getHeaderWithToken } from "../utils/config";
import getErrMsg from "../utils/getErrMsg";
import navService from "../utils/navService";
import StorageUtils from "../utils/StorageUtils";

export const GET_SAVED_HYMNS_FROM_STORAGE_REQ = "GET_SAVED_HYMNS_FROM_STORAGE_REQ";
export const GET_SAVED_HYMNS_FROM_STORAGE_RES = "GET_SAVED_HYMNS_FROM_STORAGE_RES";
export const GET_SAVED_HYMNS_FROM_STORAGE_ERR = "GET_SAVED_HYMNS_FROM_STORAGE_ERR";

export function getSavedHymnsFromStorage() {
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    dispatch({type: GET_SAVED_HYMNS_FROM_STORAGE_REQ});

    try {
      const savedHymns: string | null = await StorageUtils.getSavedHymns();

      if (savedHymns) {
        dispatch({type: GET_SAVED_HYMNS_FROM_STORAGE_RES, payload: {savedHymns: JSON.parse(savedHymns)}});
      } else {
        // else it's the first launch, prepopulate with dummy hymns
        const dummyHymns: HymnItem[] = HymnItem.getDummyHymns();
        dispatch({type: GET_SAVED_HYMNS_FROM_STORAGE_RES, payload: {savedHymns: dummyHymns}});
        dispatch(setSavedHymnToStorage(dummyHymns));
      }

    } catch (err) {
      dispatch({type: GET_SAVED_HYMNS_FROM_STORAGE_ERR, payload: {error: err}});
    }
  };
}

export const SET_SAVED_HYMNS_TO_STORAGE_REQ = "SET_SAVED_HYMNS_TO_STORAGE_REQ";
export const SET_SAVED_HYMNS_TO_STORAGE_RES = "SET_SAVED_HYMNS_TO_STORAGE_RES";
export const SET_SAVED_HYMNS_TO_STORAGE_ERR = "SET_SAVED_HYMNS_TO_STORAGE_ERR";

export function setSavedHymnToStorage(savedHymns: HymnItem[]) {
  return async (dispatch: ThunkDispatch<{}, {}, any>) => {
    dispatch({type: SET_SAVED_HYMNS_TO_STORAGE_REQ, payload: {savedHymns}});

    try {
      await StorageUtils.setSavedHymns(savedHymns);
      dispatch({type: SET_SAVED_HYMNS_TO_STORAGE_RES});
    } catch (err) {
      dispatch({type: SET_SAVED_HYMNS_TO_STORAGE_ERR, payload: {error: err}});
    }
  };
}

// ==== LOCAL ACTIONS ====
export const ADD_TO_SAVED_HYMNS = "ADD_TO_SAVED_HYMNS";

export function addToSavedHymns(newHymn: HymnItem) {
  return async (dispatch: ThunkDispatch<{}, {}, any>, getState: () => AppState) => {
    const otherSavedHymns = getState().hymns!.savedHymns;
    if (!newHymn.hymnId) {
      newHymn.hymnId = await HymnItem.assignHymnIdForOffline(otherSavedHymns);
    }
    const updatedSavedHymns: HymnItem[] = [newHymn, ...otherSavedHymns];

    dispatch(setSavedHymnToStorage(updatedSavedHymns));
    dispatch({type: ADD_TO_SAVED_HYMNS, payload: {savedHymns: updatedSavedHymns}});

    dispatch(() => navService.navigate(screens.SAVED_HYMNS));
  };
}

export const EDIT_SAVED_HYMN = "EDIT_SAVED_HYMN";

export function editSavedHymn(updatedHymn: HymnItem) {
  return (dispatch: ThunkDispatch<{}, {}, any>, getState: () => AppState) => {
    const savedHymns: HymnItem[] = _.clone(getState().hymns!.savedHymns);

    savedHymns.forEach((hymn: HymnItem, index: number) => {
      if (hymn.hymnId === updatedHymn.hymnId) {
        savedHymns[index] = updatedHymn;
      }
    });

    dispatch(setSavedHymnToStorage(savedHymns));
    dispatch({type: EDIT_SAVED_HYMN, payload: {savedHymns}});
    dispatch(() => navService.navigate(screens.SAVED_HYMNS));
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

      if (!removeHymn) {
        updatedSavedHymns.push(hymn);
      }
    });
    dispatch(setSavedHymnToStorage(updatedSavedHymns));
    return {type: REMOVE_FROM_SAVED_HYMNS, payload: {savedHymns: updatedSavedHymns}};
  };
}

// ==== ONLINE ACTIONS ====

export const PUBLISH_HYMN_REQ = "PUBLISH_HYMN_REQ";
export const PUBLISH_HYMN_ERR = "PUBLISH_HYMN_ERR";

export function publishNewHymn(newHymn: HymnItem) {
  return async (dispatch: ThunkDispatch<{}, {}, any>, getState: () => AppState) => {
    dispatch({type: PUBLISH_HYMN_REQ});
    try {
      const config = getHeaderWithToken(getState().auth!.token);
      const res = await axios.post(BASE_URL + "/hymns/addNewHymn", {newHymn}, config);

      dispatch(addToSavedHymns(HymnItem.getHymnIdFromDBHymn(res.data.newHymn)));
    } catch (err) {
      dispatch({type: PUBLISH_HYMN_ERR, payload: {err: getErrMsg(err)}});
      return;
    }
  };
}

export const PUBLISH_CHANGED_HYMN_REQ = "PUBLISH_CHANGED_HYMN_REQ";
export const PUBLISH_CHANGED_HYMN_ERR = "PUBLISH_CHANGED_HYMN_ERR";

export function publishChangesToHymn(hymn: HymnItem) {
  return async (dispatch: ThunkDispatch<{}, {}, any>, getState: () => AppState) => {
    dispatch({type: PUBLISH_CHANGED_HYMN_REQ});
    try {
      const config = getHeaderWithToken(getState().auth!.token);
      const res = await axios.post(BASE_URL + "/hymns/modifyHymn", {hymn}, config);

      dispatch(editSavedHymn(HymnItem.getHymnIdFromDBHymn(res.data.updatedHymn)));
    } catch (err) {
      dispatch({type: PUBLISH_CHANGED_HYMN_ERR, payload: {err: getErrMsg(err)}});
      return;
    }

    dispatch(() => navService.navigate(screens.SAVED_HYMNS));
  };
}

export const DELETE_HYMN_REQ = "DELETE_HYMN_REQ";
export const DELETE_HYMN_RES = "DELETE_HYMN_RES";
export const DELETE_HYMN_ERR = "DELETE_HYMN_ERR";

export function deleteHymnFromServer(hymnId: string) {
  return async (dispatch: ThunkDispatch<{}, {}, any>, getState: () => AppState) => {
    dispatch({type: DELETE_HYMN_REQ});
    try {
      const config = getHeaderWithToken(getState().auth!.token);
      await axios.post(BASE_URL + "/hymns/deleteHymns", {hymnIdsToDelete: [hymnId]}, config);
      dispatch({type: DELETE_HYMN_RES});
    } catch (err) {
      dispatch({type: DELETE_HYMN_ERR, payload: {err: getErrMsg(err)}});
      return;
    }
  };
}

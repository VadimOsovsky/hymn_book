import _ from "lodash";
import { ThunkDispatch } from "redux-thunk";
import { guideTips } from "../models/GuideTips";
import { AppState } from "../reducers";
import StorageUtils from "../utils/StorageUtils";

export const SET_TIP_SHOWN = "SET_TIP_SHOWN";

export function setTipToNeverBeShownAgain(tip: guideTips) {
  return (dispatch: ThunkDispatch<{}, {}, any>, getState: () => AppState) => {
    const tips = _.cloneDeep(getState().guide!.tipsToShow);
    // @ts-ignore
    tips[tip] = false;
    dispatch({type: SET_TIP_SHOWN, payload: tips});
    dispatch(setGuideTipsToStorage());
  };
}

export const GET_GUIDE_FROM_STORAGE_REQUEST = "GET_GUIDE_FROM_STORAGE_REQUEST";
export const GET_GUIDE_FROM_STORAGE_SUCCESS = "GET_GUIDE_FROM_STORAGE_SUCCESS";
export const GET_GUIDE_FROM_STORAGE_ERROR = "GET_GUIDE_FROM_STORAGE_ERROR";

export function getGuideTipsFromStorage() {
  return async (dispatch: ThunkDispatch<{}, {}, any>, getState: () => AppState) => {
    dispatch({type: GET_GUIDE_FROM_STORAGE_REQUEST});

    try {
      const tipsToShow: string | null = await StorageUtils.getGuideTips();
      if (tipsToShow) {
        dispatch({type: GET_GUIDE_FROM_STORAGE_SUCCESS, payload: JSON.parse(tipsToShow)});
      } else {
        // else it's the first launch, set initial state to store
        dispatch({type: GET_GUIDE_FROM_STORAGE_SUCCESS, payload: getState().guide!.tipsToShow});
        dispatch(setGuideTipsToStorage());
      }
    } catch (err) {
      dispatch({type: GET_GUIDE_FROM_STORAGE_ERROR, payload: err});
    }
  };
}

export const SET_GUIDE_TO_STORAGE_REQUEST = "SET_GUIDE_TO_STORAGE";

function setGuideTipsToStorage() {
  return async (dispatch: ThunkDispatch<{}, {}, any>, getState: () => AppState) => {
    dispatch({type: SET_GUIDE_TO_STORAGE_REQUEST});
    try {
      await StorageUtils.setGuideTips(getState().guide!.tipsToShow);
    } catch (err) {
      console.warn("save guide to storage error", err);
    }
  };
}

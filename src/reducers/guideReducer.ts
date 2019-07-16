import { GET_GUIDE_FROM_STORAGE_ERROR, GET_GUIDE_FROM_STORAGE_SUCCESS, SET_TIP_SHOWN } from "../actions/guideActions";
import Action from "../models/Action";
import { GuideTips } from "../models/GuideTips";

export type TipsToShow = { [key in keyof typeof GuideTips]: boolean };

export interface GuideInterface {
  isGuideReady: boolean;
  tipsToShow: TipsToShow;
  error: string;
}

const INITIAL_STATE: GuideInterface = {
  isGuideReady: false,
  tipsToShow: {
    PRELOADED_HYMNS: true,
    GUEST_MODE_WARNING: true,
  },
  error: "",
};

export default (state = INITIAL_STATE, action: Action): GuideInterface => {
  switch (action.type) {
    case SET_TIP_SHOWN:
      return {
        ...state,
        tipsToShow: action.payload,
      };
    case GET_GUIDE_FROM_STORAGE_SUCCESS:
      return {
        ...state,
        isGuideReady: true,
        tipsToShow: action.payload,
      };
    case GET_GUIDE_FROM_STORAGE_ERROR:
      return {
        ...state,
        error: action.payload,
      };
    default:
      return state;
  }
};

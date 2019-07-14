import { combineReducers } from "redux";
import guideReducer, { GuideInterface } from "./guideReducer";
import hymnsReducer, { HymnsInterface } from "./hymnsReducer";
import preferencesReducer, { Preferences } from "./preferencesReducer";

export interface AppState {
  hymns?: HymnsInterface;
  prefs?: Preferences;
  guide?: GuideInterface;
}

export default combineReducers({
  hymns: hymnsReducer,
  prefs: preferencesReducer,
  guide: guideReducer,
});

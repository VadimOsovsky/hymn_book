import { combineReducers } from "redux";
import authReducer, { UserInterface } from "./authReducer";
import guideReducer, { GuideInterface } from "./guideReducer";
import hymnsReducer, { HymnsInterface } from "./hymnsReducer";
import preferencesReducer, { Preferences } from "./preferencesReducer";

export interface AppState {
  auth?: UserInterface;
  hymns?: HymnsInterface;
  prefs?: Preferences;
  guide?: GuideInterface;
}

export default combineReducers({
  auth: authReducer,
  hymns: hymnsReducer,
  prefs: preferencesReducer,
  guide: guideReducer,
});

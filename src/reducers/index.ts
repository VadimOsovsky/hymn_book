import { combineReducers } from "redux";
import hymnsReducer, { HymnsInterface } from "./hymnsReducer";
import preferencesReducer, { Preferences } from "./preferencesReducer";

export interface AppState {
  hymns?: HymnsInterface;
  prefs?: Preferences;
}

export default combineReducers({
  hymns: hymnsReducer,
  prefs: preferencesReducer,
});

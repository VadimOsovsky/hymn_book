import { combineReducers } from "redux";
import hymnsReducer, { HymnsInterface } from "./hymnsReducer";
import preferencesReducer, { PreferencesInterface } from "./preferencesReducer";

export interface AppState {
  hymns?: HymnsInterface
  prefs?: PreferencesInterface
}

export default combineReducers({
  hymns: hymnsReducer,
  prefs: preferencesReducer
});

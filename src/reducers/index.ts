import { combineReducers } from "redux";
import hymnsReducer, { HymnsInterface } from "./hymnsReducer";

export interface AppState {
  hymns: HymnsInterface
}

export default combineReducers({
  hymns: hymnsReducer,
});

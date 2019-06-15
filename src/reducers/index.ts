import { combineReducers } from "redux";
import hymnsReducer from "./hymnsReducer";

export default combineReducers({
  hymns: hymnsReducer
});

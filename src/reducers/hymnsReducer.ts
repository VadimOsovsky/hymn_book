import { Action } from "redux";
import HymnItem from "../models/HymnItem";

const INITIAL_STATE = {
  savedHymns: HymnItem.getDummyHymns()
};

export interface hymnsInterface {
  savedHymns: HymnItem[]
}

export default (state = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    default:
      return state
  }
};

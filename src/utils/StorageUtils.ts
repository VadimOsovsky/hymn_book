import AsyncStorage from "@react-native-community/async-storage";
import HymnItem from "../models/HymnItem";
import { UserPrefs } from "../reducers/preferencesReducer";

const SAVED_HYMNS = "SAVED_HYMNS";
const PREFS = "PREFS";

export default class StorageUtils {

  public static getSavedHymns = async () => {
    return AsyncStorage.getItem(SAVED_HYMNS);
  }
  public static setSavedHymns = async (savedHymns: HymnItem[]) => {
    return AsyncStorage.setItem(SAVED_HYMNS, JSON.stringify(savedHymns));
  }

  public static getUserPrefs = async () => {
    return AsyncStorage.getItem(PREFS);
  }
  public static setUserPrefs = async (prefs: UserPrefs) => {
    return AsyncStorage.setItem(PREFS, JSON.stringify(prefs));
  }

}

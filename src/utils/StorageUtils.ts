import AsyncStorage from '@react-native-community/async-storage';
import HymnItem from "../models/HymnItem";
import { Preferences, UserPrefs } from "../reducers/preferencesReducer";

const SAVED_HYMNS = "SAVED_HYMNS";
const PREFS = "PREFS";

export default class StorageUtils {

  static getSavedHymns = async () => AsyncStorage.getItem(SAVED_HYMNS);
  static setSavedHymns = async (savedHymns: HymnItem[]) => AsyncStorage.setItem(SAVED_HYMNS, JSON.stringify(savedHymns));

  static getUserPrefs = async () => AsyncStorage.getItem(PREFS);
  static setUserPrefs = async (prefs: UserPrefs) => AsyncStorage.setItem(PREFS, JSON.stringify(prefs));

}

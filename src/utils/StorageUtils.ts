import AsyncStorage from "@react-native-community/async-storage";
import HymnItem from "../models/HymnItem";
import { UserPrefs } from "../reducers/preferencesReducer";
import { GuideInterface, TipsToShow } from "../reducers/guideReducer";

const SAVED_HYMNS = "SAVED_HYMNS";
const PREFS = "PREFS";
const GUIDE = "GUIDE";

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

  public static getGuideTips = async () => {
    return AsyncStorage.getItem(GUIDE);
  }
  public static setGuideTips = async (tips: TipsToShow) => {
    return AsyncStorage.setItem(GUIDE, JSON.stringify(tips));
  }

}

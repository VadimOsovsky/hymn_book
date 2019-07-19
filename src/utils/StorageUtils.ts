import AsyncStorage from "@react-native-community/async-storage";
import HymnItem from "../models/HymnItem";
import User from "../models/User";
import { TipsToShow } from "../reducers/guideReducer";
import { UserPrefs } from "../reducers/preferencesReducer";

const SAVED_HYMNS = "SAVED_HYMNS";
const PREFS = "PREFS";
const GUIDE = "GUIDE";
const TOKEN = "TOKEN";
const USER = "USER";

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

  public static getToken = async () => {
    return AsyncStorage.getItem(TOKEN);
  }
  public static setToken = async (token: string) => {
    return AsyncStorage.setItem(TOKEN, token);
  }
  public static deleteToken = async () => {
    return AsyncStorage.removeItem(TOKEN);
  }

  public static getUser = async () => {
    return AsyncStorage.getItem(USER);
  }
  public static setUser = async (user: User) => {
    return AsyncStorage.setItem(USER, JSON.stringify(user));
  }
  public static deleteUser = async () => {
    return AsyncStorage.removeItem(USER);
  }

}

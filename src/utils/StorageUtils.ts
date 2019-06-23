import AsyncStorage from '@react-native-community/async-storage';
import HymnItem from "../models/HymnItem";

const SAVED_HYMNS = "SAVED_HYMNS";

export default class StorageUtils {

  static getSavedHymns = async () => AsyncStorage.getItem(SAVED_HYMNS);

  static setSavedHymns = async (savedHymns: HymnItem[]) => AsyncStorage.setItem(SAVED_HYMNS, JSON.stringify(savedHymns));

}

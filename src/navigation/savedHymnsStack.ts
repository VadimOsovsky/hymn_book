import { createStackNavigator } from "react-navigation";
import SavedHymns from "../screens/SavedHymns";
import HymnView from "../screens/HymnView";
import HymnEditor from "../screens/HymnEditor";
import HymnItem from "../models/HymnItem";

export const screens = {
  SAVED_HYMNS: "SavedHymns",
  HYMN_VIEW: "HymnView",
  HYMN_EDITOR: "HymnEditor",
};

export default createStackNavigator({
  SavedHymns: {
    screen: SavedHymns,
    navigationOptions: {title: screens.SAVED_HYMNS, header: null}
  },
  HymnView: {
    screen: HymnView,
    propTypes: {
      hymnToView: HymnItem,
    },
    navigationOptions: {title: screens.HYMN_VIEW, header: null}
  },
  HymnEditor: {
    screen: HymnEditor,
    propTypes: {
      hymnToEdit: HymnItem,
    },
    navigationOptions: {title: screens.HYMN_EDITOR, header: null}
  },
}, {
  initialRouteName: screens.SAVED_HYMNS,
})

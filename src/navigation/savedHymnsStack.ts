import { createStackNavigator } from "react-navigation";
import SavedHymns from "../screens/SavedHymns";
import HymnView from "../screens/HymnView";
import HymnEditor from "../screens/HymnEditor";

export default createStackNavigator({
  SavedHymns: { screen: SavedHymns },
  HymnView: { screen: HymnView },
  HymnEditor: { screen: HymnEditor },
}, {
  initialRouteName: 'SavedHymns',
})

import { createStackNavigator } from "react-navigation";
import SavedHymns from "../screens/SavedHymns";
import HymnView from "../screens/HymnView";

export default createStackNavigator({
  SavedHymns: { screen: SavedHymns },
  HymnView: { screen: HymnView }
}, {
  initialRouteName: 'SavedHymns',
})

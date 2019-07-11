import { createStackNavigator } from "react-navigation";
import Settings from "../screens/Settings";

export enum screens {
  SETTINGS = "Settings",
}

export default createStackNavigator({
  Settings: {
    screen: Settings,
    navigationOptions: {title: screens.SETTINGS, header: null},
  },
}, {
  initialRouteName: screens.SETTINGS,
});

import { createStackNavigator } from "react-navigation";
import Groups from "../screens/Groups";

export enum screens {
  GROUPS = "Groups",
}

export default createStackNavigator({
  Groups: {
    screen: Groups,
    navigationOptions: {title: screens.GROUPS, header: null},
  },
}, {
  initialRouteName: screens.GROUPS,
});

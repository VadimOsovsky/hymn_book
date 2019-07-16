import { createStackNavigator } from "react-navigation";
import AuthScreen from "../screens/Auth";
import drawerNavigator from "./drawerNavigator";

export enum screens {
  AUTH = "AuthScreen",
}

const rootStack = createStackNavigator({
  drawerNavigator: {screen: drawerNavigator},
  AuthScreen: {
    screen: AuthScreen,
    params: {icon: "", label: "", showInDrawer: false},
    navigationOptions: {title: screens.AUTH, header: null},
  },
}, {
  initialRouteName: screens.AUTH,
  headerMode: "none",
});

export default rootStack;

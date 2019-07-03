import { createStackNavigator } from "react-navigation";
import AuthScreen from "../screens/Auth";
import drawerNavigator from "./drawerNavigator";

export const screens = {
  AUTH: "AUTH",
};

const rootStack = createStackNavigator({
  drawerNavigator: {screen: drawerNavigator},
  AuthScreen: {
    screen: AuthScreen,
    params: {icon: "", label: "", showInDrawer: false},
    navigationOptions: {title: screens.AUTH, header: null}
  },
}, {
  headerMode: 'none',
});

export default rootStack;

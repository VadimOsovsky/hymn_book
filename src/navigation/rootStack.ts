import { createStackNavigator } from "react-navigation";
import AuthScreen from "../screens/Auth";
import drawerNavigator from "./drawerNavigator";

const rootStack = createStackNavigator({
  drawerNavigator: {screen: drawerNavigator},
  AuthScreen: {
    screen: AuthScreen,
    params: {icon: "", label: "", showInDrawer: false},
    navigationOptions: {header: null}
  },
}, {
  headerMode: 'none',
});

export default rootStack;

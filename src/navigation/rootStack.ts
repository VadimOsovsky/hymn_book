import { createSwitchNavigator } from "react-navigation";
import AuthScreen from "../screens/Auth";
import InitialRouteResolver from "../screens/InitialRouteResolver";
import drawerNavigator from "./drawerNavigator";

export enum screens {
  AUTH_LOADING = "AuthLoading",
  AUTH = "AuthScreen",
  MAIN_APP = "MainApp",
}

const rootStack = createSwitchNavigator({
  AuthLoading: {
    screen: InitialRouteResolver,
    params: {icon: "", label: "", showInDrawer: false},
    navigationOptions: {title: screens.AUTH_LOADING, header: null},
  },
  AuthScreen: {
    screen: AuthScreen,
    params: {icon: "", label: "", showInDrawer: false},
    navigationOptions: {title: screens.AUTH, header: null},
  },
  MainApp: {
    screen: drawerNavigator,
    navigationOptions: {title: screens.MAIN_APP, header: null},
  },
}, {
  initialRouteName: screens.AUTH,
});

export default rootStack;

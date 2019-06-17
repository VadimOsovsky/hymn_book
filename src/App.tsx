import React, {Component} from 'react';
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from 'react-redux';
import { createStore } from "redux";
import { createAppContainer } from "react-navigation"
import appReducer from "./reducers"
import { StatusBar } from "react-native";
import { lightTheme } from "./styles/appTheme";
import StatusBarSafeArea from "./shared/StatusBarSafeArea";
import drawerNavigator from "./navigation/drawerNavigator";

const store = createStore(appReducer);
const Navigation = createAppContainer(drawerNavigator);

export default class App extends Component {
  render() {
    return (
      <StoreProvider store={store}>
        <PaperProvider theme={lightTheme}>
          <StatusBar translucent={true} />
          <StatusBarSafeArea />
          <Navigation />
        </PaperProvider>
      </StoreProvider>
    );
  }
}

import React, {Component} from 'react';
import { Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider, connect } from 'react-redux';
import { createStore } from "redux";
import { createAppContainer } from "react-navigation"
import rootStack from "./navigation/rootStack";
import appReducer from "./reducers"
import { StatusBar } from "react-native";
import { lightTheme } from "./styles/appTheme";

const store = createStore(appReducer);
const Navigation = createAppContainer(rootStack);

export default class App extends Component {
  render() {
    return (
      <StoreProvider store={store}>
        <PaperProvider theme={lightTheme}>
          <StatusBar backgroundColor={lightTheme.colors.primaryDark} />
          <Navigation />
        </PaperProvider>
      </StoreProvider>
    );
  }
}

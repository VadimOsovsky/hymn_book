import React from "react";
import { Provider as StoreProvider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import appReducer from "./reducers";
import RootScreen from "./screens/RootScreen";

const store = createStore(appReducer, applyMiddleware(thunk));


export default class App extends React.Component {

  public render() {
    return (
      <StoreProvider store={store}>
        <RootScreen/>
      </StoreProvider>
    );
  }
}

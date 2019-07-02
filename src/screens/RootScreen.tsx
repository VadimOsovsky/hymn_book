import React from "react"
import SplashScreen from 'react-native-splash-screen'
import { AppState } from "../reducers";
import { ThunkDispatch } from "redux-thunk";
import Action from "../models/Action";
import { getSavedHymnsFromStorage } from "../actions/hymnActions";
import { connect } from "react-redux";
import { HymnsInterface } from "../reducers/hymnsReducer";
import { StatusBar, ToastAndroid } from "react-native";
import { createAppContainer } from "react-navigation";
import rootStack from "../navigation/rootStack";
import { Provider as PaperProvider } from "react-native-paper";
import { lightTheme } from "../styles/appTheme";


const Navigation = createAppContainer(rootStack);

interface StateProps {
  hymns: HymnsInterface
}

interface DispatchProps {
  dispatchGetHymns: () => void
}

interface OwnProps {
}

interface OwnState {
}

type Props = StateProps & DispatchProps & OwnProps & OwnState


class RootScreen extends React.Component<Props> {

  componentDidMount(): void {
    this.props.dispatchGetHymns();
    this.hideSplashScreen(this.props);
  };

  componentWillReceiveProps(nextProps: Readonly<StateProps & DispatchProps & OwnProps & OwnState>, nextContext: any): void {
    this.hideSplashScreen(nextProps);
  };

  private hideSplashScreen = (props: Props) => {
    const {isLaunchingApp, isSavedHymnsLoading, error} = props.hymns;
    if (!isLaunchingApp && !isSavedHymnsLoading) {
      SplashScreen.hide();
      if (error) ToastAndroid.show(error, ToastAndroid.LONG)
    }
  };

  render() {
    return (
      <PaperProvider theme={lightTheme}>
        <StatusBar translucent={true} backgroundColor="rgba(0,0,0,0.15)"/>
        <Navigation/>
      </PaperProvider>
    )
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    hymns: state.hymns
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    dispatchGetHymns: () => dispatch(getSavedHymnsFromStorage())
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);

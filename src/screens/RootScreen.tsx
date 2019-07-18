import React from "react";
import { StatusBar, ToastAndroid } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import SplashScreen from "react-native-splash-screen";
import { createAppContainer } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { getGuideTipsFromStorage } from "../actions/guideActions";
import { getSavedHymnsFromStorage } from "../actions/hymnActions";
import { getUserPrefsFromStorage } from "../actions/preferencesActions";
import Action from "../models/Action";
import rootStack from "../navigation/rootStack";
import { AppState } from "../reducers";
import { STATUS_BAR_INITIAL_COLOR } from "../styles/styleVariables";

const Navigation = createAppContainer(rootStack);

interface ReduxDispatch {
  getHymns: () => void;
  getUserPrefsFromStorage: () => void;
  getGuideFromStorage: () => void;
}

interface OwnProps {
}

type Props = AppState & ReduxDispatch & OwnProps;

class RootScreen extends React.Component<Props> {

  public async componentDidMount() {
    this.props.getHymns();
    this.props.getUserPrefsFromStorage();
    this.props.getGuideFromStorage();
    this.hideSplashScreen(this.props);
  }

  public componentWillReceiveProps(nextProps: Readonly<AppState & ReduxDispatch & OwnProps>, nextContext: any) {
    this.hideSplashScreen(nextProps);
  }

  private isAppReady = (props: Props) => {
    const {isPrefsReady} = props.prefs!;
    const {isGuideReady} = props.guide!;
    return isPrefsReady && isGuideReady;
  }

  private hideSplashScreen = (props: Props) => {
    const {error} = props.hymns!;

    if (this.isAppReady(props)) {
      setTimeout(SplashScreen.hide);
      if (error) {
        ToastAndroid.show(error, ToastAndroid.LONG);
      }
    }
  }

  public render() {
    if (this.isAppReady(this.props)) {
      return (
        <PaperProvider theme={this.props.prefs!.userPrefs.theme}>
          <StatusBar translucent={true} backgroundColor={STATUS_BAR_INITIAL_COLOR}/>
          <Navigation/>
        </PaperProvider>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state: AppState) => {
  const {hymns, prefs, guide} = state;
  return {hymns, prefs, guide};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    getHymns: () => dispatch(getSavedHymnsFromStorage()),
    getUserPrefsFromStorage: () => dispatch(getUserPrefsFromStorage()),
    getGuideFromStorage: () => dispatch(getGuideTipsFromStorage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);

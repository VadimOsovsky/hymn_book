import React from "react";
import { StatusBar, ToastAndroid } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import SplashScreen from "react-native-splash-screen";
import { createAppContainer } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { getTokenFromStorage, getUserFromStorage } from "../actions/authActions";
import { getGuideTipsFromStorage } from "../actions/guideActions";
import { getSavedHymnsFromStorage } from "../actions/hymnActions";
import { getUserPrefsFromStorage } from "../actions/preferencesActions";
import Action from "../models/Action";
import rootStack from "../navigation/rootStack";
import { AppState } from "../reducers";
import { STATUS_BAR_INITIAL_COLOR } from "../styles/styleVariables";
import navService from "../utils/navService";

const Navigation = createAppContainer(rootStack);

interface ReduxDispatch {
  getHymns: () => void;
  getUserPrefsFromStorage: () => void;
  getGuideFromStorage: () => void;
  getTokenFromStorage: () => void;
  getUserFromStorage: () => void;
}

interface OwnProps {
}

type Props = AppState & ReduxDispatch & OwnProps;

class RootScreen extends React.Component<Props> {

  public async componentDidMount() {
    this.props.getHymns();
    this.props.getUserPrefsFromStorage();
    this.props.getGuideFromStorage();
    this.props.getTokenFromStorage();
    this.props.getUserFromStorage();
    this.hideSplashScreen(this.props);
  }

  public componentWillReceiveProps(nextProps: Readonly<AppState & ReduxDispatch & OwnProps>, nextContext: any) {
    this.hideSplashScreen(nextProps);
  }

  private isAppReady = (props: Props) => {
    const {isPrefsReady} = props.prefs!;
    const {isGuideReady} = props.guide!;
    const {isTokenReady, isUserReady} = props.auth!;
    return isPrefsReady && isGuideReady && isTokenReady && isUserReady;
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
          <Navigation ref={(navigatorRef) => {
            navService.setTopLevelNavigator(navigatorRef);
          }}/>
        </PaperProvider>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = (state: AppState) => {
  const {hymns, prefs, guide, auth} = state;
  return {hymns, prefs, guide, auth};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    getHymns: () => dispatch(getSavedHymnsFromStorage()),
    getUserPrefsFromStorage: () => dispatch(getUserPrefsFromStorage()),
    getGuideFromStorage: () => dispatch(getGuideTipsFromStorage()),
    getTokenFromStorage: () => dispatch(getTokenFromStorage()),
    getUserFromStorage: () => dispatch(getUserFromStorage()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RootScreen);

import React from "react";
import { Alert, ImageBackground, ScrollView, TouchableNativeFeedback, View } from "react-native";
import { Colors, Text, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { setTipToNeverBeShownAgain } from "../../actions/guideActions";
import i18n from "../../i18n";
import Action from "../../models/Action";
import { GuideTips } from "../../models/GuideTips";
import { screens } from "../../navigation/rootStack";
import { AppState } from "../../reducers";
import AppLogo from "../../shared/AppLogo";
import StatusBarSafeArea from "../../shared/StatusBarSafeArea";
import Login from "./components/Login";
import Signup from "./components/Signup";
import style from "./style";

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface ReduxDispatch {
  setTip: (tip: GuideTips) => void;
}

type Props = OwnProps & AppState & ReduxDispatch;

interface State {
  authMode: authModes;
}

enum authModes {
  LOGIN = "LOGIN",
  SIGNUP = "SIGNUP",
}

class AuthScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      authMode: authModes.LOGIN,
    };
  }

  private onContinue = () => {
    console.log("VO: this.props.guide!.tipsToShow", this.props.guide!.tipsToShow);
    if (this.props.guide!.tipsToShow.GUEST_MODE_WARNING) {
      Alert.alert(
        i18n.t("continue_as_guest"),
        i18n.t("continue_as_guest_warning"),
        [
          {text: i18n.t("btn_signup_later"), onPress: this.continueWithoutAccount},
          {text: i18n.t("btn_signup_now"), onPress: () => this.setState({authMode: authModes.SIGNUP})},
        ],
      );
    } else {
      this.continueWithoutAccount();
    }
  }

  private continueWithoutAccount = () => {
    const {guide, setTip, navigation} = this.props;

    if (guide!.tipsToShow.GUEST_MODE_WARNING) {
      setTip(GuideTips.GUEST_MODE_WARNING);
    }
    navigation.navigate(screens.MAIN_APP);
  }

  public render() {
    const {authMode} = this.state;

    return (
      <ImageBackground source={require("../../assets/images/auth_bg.jpg")} style={style.bgPic}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={style.container}>
          <StatusBarSafeArea transparent/>
          <AppLogo/>

          <View style={style.authSheetWrapper}>
            <View style={style.authSheet}>
              <View style={style.titlesContainer}>
                <Title
                  style={[style.title, {opacity: authMode === authModes.LOGIN ? 1 : 0.2}]}
                  onPress={() => this.setState({authMode: authModes.LOGIN})}
                >{i18n.t("title_login")}</Title>
                <Title
                  style={[style.title, {opacity: authMode === authModes.SIGNUP ? 1 : 0.2}]}
                  onPress={() => this.setState({authMode: authModes.SIGNUP})}
                >{i18n.t("title_signup")}</Title>
              </View>
              {
                this.state.authMode === authModes.LOGIN ?
                  <Login navigation={this.props.navigation}/> :
                  <Signup navigation={this.props.navigation}/>
              }
            </View>
          </View>

          <TouchableNativeFeedback
            style={{width: "100%", backgroundColor: this.props.prefs!.userPrefs.theme.colors.primary}}
            onPress={this.onContinue}>
            <View style={[style.offlineBtn, {}]}>
              <Icon color={Colors.white} size={20} name="cloud-off"/>
              <Text style={style.offlineBtnText}>{i18n.t("continue_as_guest")}</Text>
            </View>
          </TouchableNativeFeedback>

        </ScrollView>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  const {prefs, guide} = state;
  return {prefs, guide};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    setTip: (tip: GuideTips) => dispatch(setTipToNeverBeShownAgain(tip)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen);

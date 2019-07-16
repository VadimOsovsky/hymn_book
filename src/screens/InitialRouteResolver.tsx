import React from "react";
import { ActivityIndicator, ImageBackground } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { screens } from "../navigation/rootStack";
import { AppState } from "../reducers";
import style from "./Auth/style";

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = OwnProps & AppState;

class InitialRouteResolver extends React.Component<Props> {

  public async componentDidMount(): Promise<void> {
    await this.bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  private bootstrapAsync = async () => {

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (!this.props.guide!.tipsToShow.GUEST_MODE_WARNING) {
      this.props.navigation.navigate(screens.MAIN_APP);
    } else {
      this.props.navigation.navigate(screens.AUTH);
    }
  }

  // Render any loading content that you like here
  public render() {
    return (
      <ImageBackground source={require("../assets/images/auth_bg.jpg")} style={style.bgPic}>
        <LinearGradient
          style={style.gradient}
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.5)"]}
          locations={[0, 0.9]}>
          <ActivityIndicator size="large"/>
        </LinearGradient>
      </ImageBackground>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  const {guide} = state;
  return {guide};
};

export default connect(mapStateToProps)(InitialRouteResolver);

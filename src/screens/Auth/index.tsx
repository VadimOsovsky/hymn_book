import React from "react";
import { ImageBackground, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import AppLogo from "../../shared/AppLogo";
import Login from "./components/Login";
import style from "./style";

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

class AuthScreen extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    return (
      <ImageBackground source={require("../../assets/images/auth_bg.jpg")} style={style.bgPic}>
        <LinearGradient
          style={style.gradient}
          colors={["rgba(0,243,201,0.5)", "rgba(8,111,134,0.8)"]}
          locations={[0, 0.9]}>
          <View style={style.container}>
            <AppLogo/>
            <Login navigation={this.props.navigation}/>
          </View>
        </LinearGradient>
      </ImageBackground>
    );
  }
}

export default AuthScreen;

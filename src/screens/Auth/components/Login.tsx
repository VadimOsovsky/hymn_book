import React from "react";
import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import { Button, Colors } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import i18n from "../../../i18n";
import MyInput, { inputPresets } from "../../../shared/ui/MyInput";
import style from "../style";

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = OwnProps;

interface State {
  email: string;
  password: string;
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      email: "",
      password: "",
    };
  }

  public render() {
    return (
      <View>
        <Text style={style.authInfoText}>{i18n.t("login_info")}</Text>
        <View style={style.form}>
          <MyInput
            preset={inputPresets.EMAIL}
            inputStyle={style.input}
            iconColor={Colors.black}
            value={this.state.email}
            onChangeText={(email) => this.setState({email})}
          />
          <MyInput
            preset={inputPresets.PASSWORD}
            inputStyle={style.input}
            iconColor={Colors.black}
            value={this.state.password}
            onChangeText={(password) => this.setState({password})}
          />
        </View>

        <Button style={style.button} mode="contained"
                onPress={() => ToastAndroid.show("Log in WIP", 5)}>
          {i18n.t("btn_login")}
        </Button>

        <Text style={localStyle.forgot}
              onPress={() => ToastAndroid.show("Forgot password WIP", 5)}>{i18n.t("forgot_pwd")}</Text>
      </View>
    );
  }
}

const localStyle = StyleSheet.create({
  forgot: {
    marginBottom: 10,
    fontSize: 16,
    textDecorationLine: "underline",
    textAlign: "center",
  },
});

export default Login;

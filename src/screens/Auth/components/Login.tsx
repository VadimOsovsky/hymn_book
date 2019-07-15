import React from "react";
import { StyleSheet, Text, TextInput, ToastAndroid, View } from "react-native";
import { Button, Colors } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import i18n from "../../../i18n";
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
          <View style={{flexDirection: "row", width: "100%", alignItems: "center"}}>
            <Icon style={style.icon} name="email" size={30}/>
            <TextInput
              placeholder={i18n.t("email")}
              underlineColorAndroid={Colors.teal500}
              textContentType="emailAddress"
              keyboardType="email-address"
              style={style.input}
              value={this.state.email}
              onChangeText={(email) => this.setState({email})}
            />
          </View>

          <View style={style.inputContainer}>
            <Icon style={style.icon} name="lock" size={30}/>
            <TextInput
              placeholder={i18n.t("password")}
              underlineColorAndroid={Colors.teal500}
              style={style.input}
              textContentType="password"
              secureTextEntry={true}
              value={this.state.password}
              onChangeText={(password) => this.setState({password})}
            />
          </View>
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

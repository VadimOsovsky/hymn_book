import React from "react";
import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import { Button, Colors } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { login } from "../../../actions/authActions";
import i18n from "../../../i18n";
import Action from "../../../models/Action";
import { AppState } from "../../../reducers";
import ErrorText from "../../../shared/ui/ErrorText";
import MyInput, { inputPresets } from "../../../shared/ui/MyInput";
import style from "../style";

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface ReduxDispatch {
  login: (email: string, password: string) => void;
}

type Props = OwnProps & ReduxDispatch & AppState;

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

  private onLogin = () => {
    const {email, password} = this.state;
    this.props.login(email, password);
  }

  public render() {
    return (
      <View>
        <Text style={style.authInfoText}>{i18n.t("login_info")}</Text>
        <View style={style.form}>
          <ErrorText>{this.props.auth!.loginError}</ErrorText>
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
                loading={this.props.auth!.loginLoading}
                disabled={this.props.auth!.loginLoading}
                onPress={this.onLogin}>
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

const mapStateToProps = (state: AppState) => {
  const {auth} = state;
  return {auth};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    login: (email: string, password: string) => {
      return dispatch(login(email, password));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

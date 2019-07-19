import React from "react";
import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import { Button, Colors } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { signup } from "../../../actions/authActions";
import i18n from "../../../i18n";
import Action from "../../../models/Action";
import User from "../../../models/User";
import { AppState } from "../../../reducers";
import MyInput, { inputPresets } from "../../../shared/ui/MyInput";
import style from "../style";
import ErrorText from "../../../shared/ui/ErrorText";

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface ReduxDispatch {
  signup: (newUser: User) => void;
}

type Props = OwnProps & ReduxDispatch & AppState;

interface State {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

class Signup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    };
  }

  private visitOtherProducts = () => {
    // TODO follow link with other Wycliffe products
    ToastAndroid.show("Other products WIP", 5);
  }

  private onSignup = async () => {
    const {name, email, password} = this.state;

    const newUser = new User(email, password, name);
    this.props.signup(newUser);
  }

  public render() {
    return (
      <View>
        <Text style={[style.authInfoText, {textAlign: "right"}]}>{
          i18n.t("signup_info")}
          <Text numberOfLines={1} style={{textDecorationLine: "underline", flex: 1}}
                onPress={this.visitOtherProducts}>{i18n.t("link_other_products")}</Text>
        </Text>
        <View style={style.form}>
          <ErrorText>{this.props.auth!.signupError}</ErrorText>

          <MyInput
            preset={inputPresets.NAME}
            inputStyle={style.input}
            iconColor={Colors.black}
            value={this.state.name}
            onChangeText={(name) => this.setState({name})}
          />
          <MyInput
            preset={inputPresets.EMAIL}
            value={this.state.email}
            iconColor={Colors.black}
            onChangeText={(email) => this.setState({email})}
          />
          <MyInput
            preset={inputPresets.PASSWORD}
            inputStyle={style.input}
            iconColor={Colors.black}
            value={this.state.password}
            onChangeText={(password) => this.setState({password})}
          />
          <MyInput
            preset={inputPresets.REPEAT_PASSWORD}
            iconColor={Colors.black}
            value={this.state.repeatPassword}
            onChangeText={(repeatPassword) => this.setState({repeatPassword})}
          />
        </View>

        <Button style={style.button} mode="contained"
                loading={this.props.auth!.signupLoading}
                disabled={this.props.auth!.signupLoading}
                onPress={this.onSignup}>
          {i18n.t("btn_signup")}
        </Button>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  const {auth} = state;
  return {auth};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    signup: (newUser: User) => dispatch(signup(newUser)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

const localStyle = StyleSheet.create({});

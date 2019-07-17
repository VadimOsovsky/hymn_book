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

  public render() {
    return (
      <View>
        <Text style={[style.authInfoText, {textAlign: "right"}]}>{
          i18n.t("signup_info")}
          <Text numberOfLines={1} style={{textDecorationLine: "underline", flex: 1}}
                onPress={this.visitOtherProducts}>{i18n.t("link_other_products")}</Text>
        </Text>
        <View style={style.form}>

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
                onPress={() => ToastAndroid.show("Sign up WIP", 5)}>
          {i18n.t("btn_signup")}
        </Button>
      </View>
    );
  }
}

const localStyle = StyleSheet.create({});

export default Signup;

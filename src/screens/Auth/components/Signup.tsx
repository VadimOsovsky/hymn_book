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
          <View style={{flexDirection: "row", width: "100%", alignItems: "center"}}>
            <Icon style={style.icon} name="person" size={30}/>
            <TextInput
              placeholder={i18n.t("name")}
              underlineColorAndroid={Colors.teal500}
              style={style.input}
              value={this.state.name}
              onChangeText={(name) => this.setState({name})}
            />
          </View>

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

          <View style={style.inputContainer}>
            <Icon style={style.icon} name="lock" size={30}/>
            <TextInput
              placeholder={i18n.t("repeat_password")}
              underlineColorAndroid={Colors.teal500}
              style={style.input}
              textContentType="password"
              secureTextEntry={true}
              value={this.state.repeatPassword}
              onChangeText={(repeatPassword) => this.setState({repeatPassword})}
            />
          </View>
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

import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Colors, TextInput } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import i18n from "../../../i18n";

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface State {
  email: string;
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      email: "",
    };
  }

  public render() {
    const inputTheme = {
      colors: {primary: "#FFF", text: "#FFF", placeholder: "#FFF"},
    };

    return (
      <View style={{width: "100%", height: "auto"}}>
        <TextInput
          label={i18n.t("email")}
          style={style.input}
          theme={inputTheme}
          underlineColor="#FFF"
          value={this.state.email}
          onChangeText={(email) => this.setState({email})}
        />
        <TextInput
          label={i18n.t("password")}
          style={style.input}
          theme={inputTheme}
          underlineColor="#FFF"
          value={this.state.email}
          onChangeText={(email) => this.setState({email})}
        />
        <Button style={style.button} mode="contained"
                onPress={() => this.props.navigation.replace("drawerNavigator")}>
          {i18n.t("btn_login")}
        </Button>
      </View>
    );
  }
}

const style = StyleSheet.create({
  input: {
    backgroundColor: "transparent",
    marginBottom: 10,
  },
  button: {
    marginVertical: 20,
    backgroundColor: Colors.tealA700,
  },
});

export default Login;

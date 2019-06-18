import React from "react"
import {StyleSheet, View} from "react-native";
import {Button, Colors, TextInput} from "react-native-paper";
import {NavigationParams} from "react-navigation";

interface Props {
  navigation: NavigationParams
}

interface State {
  email: string
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      email: "",
    }
  }

  render() {
    console.log("VO: this.props", this.props)
    const inputTheme = {
      colors: { primary: "#FFF", text: "#FFF", placeholder: "#FFF" }
    };

    return (
      <View style={{width: '100%', height: "auto"}}>
        <TextInput
          label='Email'
          style={style.input}
          theme={inputTheme}
          underlineColor="#FFF"
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />
        <TextInput
          label='Password'
          style={style.input}
          theme={inputTheme}
          underlineColor="#FFF"
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />
        <Button style={style.button} mode="contained" onPress={() => this.props.navigation.replace("drawerNavigator")}>LOG IN</Button>
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
    backgroundColor: Colors.tealA700
  }
});

export default Login;

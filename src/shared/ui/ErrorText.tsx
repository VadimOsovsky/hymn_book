import React, { PureComponent } from "react";
import {StyleSheet, Text} from "react-native";
import { lightTheme } from "../../styles/appTheme";

class ErrorText extends PureComponent {

  public render() {
    if (this.props.children) {
      return <Text style={style.errText}>{this.props.children}</Text>;
    } else {
      return null;
    }
  }
}

const style = StyleSheet.create({
  errText: {
    color: lightTheme.colors.error,
    marginVertical: 5,
  },
});

export default ErrorText;

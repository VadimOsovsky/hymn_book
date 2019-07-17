import React, { PureComponent } from "react";
import {
  KeyboardType,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputIOSProps,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Colors } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import i18n from "../../i18n";

export enum inputPresets {
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
  REPEAT_PASSWORD = "REPEAT_PASSWORD",
  NAME = "NAME",
}

interface InputConfig {
  icon: string;
  placeholder: string;
  keyboardType?: KeyboardType;
  textContentType?: TextInputIOSProps["textContentType"];
  secureTextEntry?: boolean;
}

interface InputType {
  preset: inputPresets;
}

interface OwnProps {
  iconSize?: number;
  inputStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

type Props = InputType & TextInputProps & OwnProps;

type State = Readonly<{}>;

export default class MyInput extends PureComponent<Props, State> {
  public readonly state: State = {};

  public render() {
    const config = this.getInputConfigFromPreset();
    const {icon, placeholder, keyboardType, textContentType, secureTextEntry} = config;
    return (
      <View style={[style.inputContainer, this.props.containerStyle]}>
        <Icon style={style.icon} name={icon} size={this.props.iconSize || 30}/>
        <TextInput
          style={[style.input, this.props.inputStyle]}
          placeholder={i18n.t(placeholder)}
          underlineColorAndroid={Colors.teal500}
          keyboardType={keyboardType}
          textContentType={textContentType}
          secureTextEntry={secureTextEntry}
          {...this.props}
        />
      </View>
    );
  }

  private getInputConfigFromPreset = (): InputConfig => {
    switch (this.props.preset) {
      case inputPresets.EMAIL:
        return {
          icon: "email",
          placeholder: "input_email",
          textContentType: "emailAddress",
          keyboardType: "email-address",
        };
      case inputPresets.PASSWORD:
        return {
          icon: "lock",
          placeholder: "input_password",
          textContentType: "password",
          secureTextEntry: true,
        };
      case inputPresets.REPEAT_PASSWORD:
        return {
          icon: "lock",
          placeholder: "input_repeat_password",
          textContentType: "password",
          secureTextEntry: true,
        };
      case inputPresets.NAME:
        return {
          icon: "person",
          placeholder: "input_name",
        };
      default:
        return {
          icon: "",
          placeholder: "ERROR: no such type",
        };
    }
  }
}

const style = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  icon: {
    flex: 0.1,
    marginRight: 10,
  },
  input: {
    backgroundColor: "transparent",
    fontSize: 16,
    flex: 0.9,
  },
});

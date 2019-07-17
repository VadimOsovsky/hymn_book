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
import { Colors, Text } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import i18n from "../../i18n";
import { connect } from "react-redux";
import { AppState } from "../../reducers";

export enum inputPresets {
  EMAIL = "EMAIL",
  PASSWORD = "PASSWORD",
  REPEAT_PASSWORD = "REPEAT_PASSWORD",
  NAME = "NAME",
  HYMN_TITLE = "HYMN_TITLE",
  HYMN_LYRICS_BY = "HYMN_LYRICS_BY",
  HYMN_MUSIC_BY = "HYMN_MUSIC_BY",
}

interface InputConfig {
  icon: string;
  label?: string;
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
  iconColor?: string;
  inputStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

type Props = InputType & TextInputProps & AppState & OwnProps;

type State = Readonly<{}>;

class MyInput extends PureComponent<Props, State> {
  public readonly state: State = {};

  public render() {
    const config = this.getInputConfigFromPreset();
    const {icon, label, placeholder, keyboardType, textContentType, secureTextEntry} = config;
    const textColor = this.props.prefs!.userPrefs.theme.colors.text;

    return (
      <View style={[style.inputContainer, this.props.containerStyle]}>
        {label ?
          <View style={[style.inputRow]}>
            <Text style={{flex: 0.1}}> </Text>
            <Text style={style.label}>{i18n.t(label)}</Text>
          </View> : null
        }
        <View style={style.inputRow}>
          {icon ?
            <Icon style={style.icon}
                  color={this.props.iconColor || textColor} name={icon}
                  size={this.props.iconSize || 30}/> : null
          }
          <TextInput
            style={[style.input, {color: textColor}, this.props.inputStyle]}
            placeholder={i18n.t(placeholder)}
            placeholderTextColor={"#999"}
            underlineColorAndroid={Colors.teal500}
            keyboardType={keyboardType}
            textContentType={textContentType}
            secureTextEntry={secureTextEntry}
            {...this.props}
          />
        </View>
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
      case inputPresets.HYMN_TITLE:
        return {
          icon: "title",
          label: "hymn_title",
          placeholder: "hymn_title",
        };
      case inputPresets.HYMN_LYRICS_BY:
        return {
          icon: "person",
          label: "lyrics_by_label",
          placeholder: "lyrics_by_placeholder",
        };
      case inputPresets.HYMN_MUSIC_BY:
        return {
          icon: "person",
          label: "music_by_label",
          placeholder: "music_by_placeholder",
        };
      default:
        return {
          icon: "",
          placeholder: "ERROR: no such type",
        };
    }
  }
}

const mapStateToProps = (state: AppState) => {
  const {prefs} = state;
  return {prefs};
};

export default connect(mapStateToProps)(MyInput);

const style = StyleSheet.create({
  inputContainer: {
    width: "100%",
  },
  label: {
    flex: 0.9,
    marginTop: 20,
    marginBottom: -5,
    fontFamily: "sans-serif-medium",
    color: Colors.teal500,
    // opacity: 0.5,
  },
  inputRow: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  icon: {
    flex: 0.1,
    marginRight: 10,
    opacity: 0.5,
  },
  input: {
    fontSize: 16,
    flex: 0.9,
  },
});

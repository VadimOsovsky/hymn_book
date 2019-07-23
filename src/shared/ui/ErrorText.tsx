import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextProps, ToastAndroid } from "react-native";
import Snackbar from 'react-native-snackbar';
import { lightTheme } from "../../styles/appTheme";
import i18n from "../../i18n";
import { Colors } from "react-native-paper";

interface OwnProps {
  message?: string;
}

type Props = TextProps & OwnProps;

function ErrorText(props: Props) {

  // const [errText, setErrText] = useState<string>("");

  useEffect(() => {}, [props.message]);

  if (props.message) {
    Snackbar.show({
      title: props.message,
      duration: Snackbar.LENGTH_LONG,
      backgroundColor: Colors.red800,
      action: {title: i18n.t("try_again"), onPress: () => {}},
    });
    // return <Text style={style.errText}>{props.message}</Text>;
    return null;
  } else {
    return null;
  }
}

const style = StyleSheet.create({
  errText: {
    color: lightTheme.colors.error,
    marginVertical: 5,
  },
});

export default ErrorText;

import React, { useEffect } from "react";
import { StyleSheet, TextProps, ToastAndroid } from "react-native";
import { lightTheme } from "../../styles/appTheme";

interface OwnProps {
  message?: string;
}

type Props = TextProps & OwnProps;

function ErrorText(props: Props) {

  // const [errText, setErrText] = useState<string>("");

  useEffect(() => {
  }, [props.message]);

  if (props.message) {
    ToastAndroid.show(props.message, ToastAndroid.LONG);

    // Snackbar.show({
    //   title: props.message,
    //   duration: Snackbar.LENGTH_LONG,
    //   backgroundColor: Colors.red800,
    //   action: {title: i18n.t("try_again"), onPress: () => {}},
    // });

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

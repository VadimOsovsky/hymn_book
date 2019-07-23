import React, { FunctionComponent } from "react";
import { ButtonProps } from "react-native";
import { Button, Text } from "react-native-paper";
import { connect } from "react-redux";
import { AppState } from "../../reducers";
import dialogStyles from "../../styles/dialogStyles";

type Props = ButtonProps & ReturnType<typeof mapStateToProps>;

const DialogButton: FunctionComponent<Props> = (props) => {
  return (

    <Button {...props}>
      <Text style={[dialogStyles.buttonText, {color: props.themeColors.primary}]}>{props.title.toUpperCase()}</Text>
    </Button>
  );
};

const mapStateToProps = (state: AppState) => {
  return {
    themeColors: state.prefs!.userPrefs.theme.colors,
  };
};

export default connect(mapStateToProps)(DialogButton);

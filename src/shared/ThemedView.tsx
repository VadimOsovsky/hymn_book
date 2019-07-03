import { View } from "react-native";
import React, { PureComponent } from "react";
import { AppState } from "../reducers";
import { connect } from "react-redux";

interface OwnProps {
  style?: StyleMedia
}

interface ReduxState {
  prefs: AppState["prefs"]
}

type Props = OwnProps & ReduxState

class ThemedView extends PureComponent<Props> {


  render() {
    const {children, style, prefs, ...rest} = this.props;
    return <View style={[{backgroundColor: prefs!.userPrefs.theme.colors.background}, style]} {...rest}>{children}</View>
  }
}

const mapStateToProps = (state: AppState) => {
  const {prefs} = state;
  return {prefs};
};

export default connect(mapStateToProps)(ThemedView)

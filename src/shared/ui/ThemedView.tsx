import React, { PureComponent } from "react";
import { StyleProp, View, ViewProps } from "react-native";
import { connect } from "react-redux";
import { AppState } from "../../reducers";

interface OwnProps {
  style?: StyleProp<any>;
}

interface ReduxState {
  prefs: AppState["prefs"];
}

type Props = OwnProps & ReduxState & ViewProps;

class ThemedView extends PureComponent<Props> {

  public render() {
    const {children, style, prefs, ...rest} = this.props;
    return (
      <View
        style={[{backgroundColor: prefs!.userPrefs.theme.colors.background}, style]} {...rest}>
        {children}
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  const {prefs} = state;
  return {prefs};
};

export default connect(mapStateToProps)(ThemedView);

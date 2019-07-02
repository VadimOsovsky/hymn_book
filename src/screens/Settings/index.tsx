import React from "react";
import { Alert, StatusBar, ToastAndroid, View } from "react-native";
import globalStyles from "../../styles/globalStyles";
import { AppState } from "../../reducers";
import { ThunkDispatch } from "redux-thunk";
import Action from "../../models/Action";
import { connect } from "react-redux";
import { Appbar } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";

interface ReduxDispatch {
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

type Props = AppState & ReduxDispatch & OwnProps

interface State {
}

class SavedHymns extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {}
  }

  private onSave = () => {
    Alert.alert(
      "Save Changes",
      "Are you sure you want to save the changes?",
      [
        {text: "Cancel"},
        {text: "Save", onPress: this.saveSettings}
      ]
    )
  };

  private saveSettings = () => {
    ToastAndroid.show("Settings Saved", ToastAndroid.SHORT);
  };

  private onDiscard = () => {
    Alert.alert(
      "Discard Changes",
      "Are you sure you want to discard the changes?",
      [
        {text: "Cancel"},
        {text: "Discard", onPress: this.discardSettings}
      ]
    )
  };

  private discardSettings = () => {
    ToastAndroid.show("Settings Discarded", ToastAndroid.SHORT);
  };

  private renderHeader = () => {
    return (
      <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
        <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()}/>
        <Appbar.Content title="Settings"/>
        <Appbar.Action icon="check" onPress={this.onSave} />
        <Appbar.Action icon="close" onPress={this.onDiscard} />
      </Appbar.Header>
    )
  };

  render() {
    return (
      <View style={globalStyles.screen}>
        {this.renderHeader()}
      </View>
    );
  }

}

const mapStateToProps = (state: AppState) => {
  const {} = state;
  return {}
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    // removeFromSavedHymns: (ids: number[]) => dispatch(removeFromSavedHymns(ids)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedHymns);

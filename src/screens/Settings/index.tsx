import React from "react";
import { Alert, StatusBar, ToastAndroid } from "react-native";
import globalStyles from "../../styles/globalStyles";
import { AppState } from "../../reducers";
import { ThunkDispatch } from "redux-thunk";
import Action from "../../models/Action";
import { connect } from "react-redux";
import { Appbar } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import ThemedView from "../../shared/ThemedView";
import i18n from "../../i18n";

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
      i18n.t('save_settings_title'),
      i18n.t('save_settings_message'),
      [
        {text: i18n.t('btn_cancel')},
        {text: i18n.t('btn_save'), onPress: this.saveSettings}
      ]
    )
  };

  private saveSettings = () => {
    ToastAndroid.show(i18n.t('settings_saved'), ToastAndroid.SHORT);
  };

  private onDiscard = () => {
    Alert.alert(
      i18n.t('discard_settings_title'),
      i18n.t('discard_settings_message'),
      [
        {text: i18n.t('btn_cancel')},
        {text: i18n.t('btn_discard'), onPress: this.discardSettings}
      ]
    )
  };

  private discardSettings = () => {
    ToastAndroid.show(i18n.t('settings_discarded'), ToastAndroid.SHORT);
  };

  private renderHeader = () => {
    return (
      <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
        <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()}/>
        <Appbar.Content title={i18n.t('settings')}/>
        <Appbar.Action icon="check" onPress={this.onSave}/>
        <Appbar.Action icon="close" onPress={this.onDiscard}/>
      </Appbar.Header>
    )
  };

  render() {
    return (
      <ThemedView style={globalStyles.screen}>
        {this.renderHeader()}
      </ThemedView>
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

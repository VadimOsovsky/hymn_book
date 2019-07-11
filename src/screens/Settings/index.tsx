import React from "react";
import { Alert, ToastAndroid } from "react-native";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import i18n from "../../i18n";
import Action from "../../models/Action";
import { AppState } from "../../reducers";
import AndroidAppBar, { AppBarAction, navIcons, showAsAction } from "../../shared/AndroidAppBar";
import ThemedView from "../../shared/ThemedView";
import globalStyles from "../../styles/globalStyles";
import icons from "../../styles/icons";

interface ReduxDispatch {
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = AppState & ReduxDispatch & OwnProps;

interface State {
}

class SavedHymns extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  private onSave = () => {
    Alert.alert(
      i18n.t("save_settings_title"),
      i18n.t("save_settings_message"),
      [
        {text: i18n.t("btn_cancel")},
        {text: i18n.t("btn_save"), onPress: this.saveSettings},
      ],
    );
  }

  private saveSettings = () => {
    ToastAndroid.show(i18n.t("settings_saved"), ToastAndroid.SHORT);
  }

  private getAppBarActions = (): AppBarAction[] => {
    const actions: AppBarAction[] = [];

    actions.push({
      title: i18n.t("btn_done"),
      icon: icons.check,
      show: showAsAction.ALWAYS,
      onActionSelected: this.onSave,
    });
    return actions;
  }

  private renderHeader = () => {
    return (
      <AndroidAppBar
        title={i18n.t("settings")}
        navIcon={navIcons.MENU}
        onNavIconClick={this.props.navigation.openDrawer}
        actions={this.getAppBarActions()}
      />
    );
  }

  public render() {
    return (
      <ThemedView style={globalStyles.screen}>
        {this.renderHeader()}
      </ThemedView>
    );
  }

}

const mapStateToProps = (state: AppState) => {
  const {} = state;
  return {};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    // removeFromSavedHymns: (ids: number[]) => dispatch(removeFromSavedHymns(ids)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedHymns);

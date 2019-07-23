import React, { PureComponent } from "react";
import { StyleSheet, Switch, ToastAndroid, View } from "react-native";
import { Button, Dialog, Paragraph, Portal, Text } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { addToSavedHymns, editSavedHymn, publishChangesToHymn, publishNewHymn } from "../../../actions/hymnActions";
import i18n from "../../../i18n";
import Action from "../../../models/Action";
import HymnItem from "../../../models/HymnItem";
import { AppState } from "../../../reducers";
import DialogButton from "../../../shared/ui/DialogButton";
import dialogStyles from "../../../styles/dialogStyles";

interface OwnProps {
  isAddNew: boolean;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  onGetNewHymn: () => HymnItem;
  onCheckIfHymnChanged: () => boolean;
}

interface ReduxDispatch {
  addToSavedHymns: (newHymn: HymnItem) => void;
  editSavedHymn: (updatedHymn: HymnItem) => void;
  publishNewHymn: (newHymn: HymnItem) => void;
  publishChangesToHymn: (updatedHymn: HymnItem) => void;
}

type Props = AppState & ReduxDispatch & OwnProps;

interface State {
  visible: boolean;
  publish: boolean;
}

class DoneButton extends PureComponent<Props, State> {
  public readonly state: State = {
    visible: false,
    publish: true,
  };

  private openDialog = () => this.setState({visible: true});
  private hideDialog = () => this.setState({visible: false});

  private onDone = () => {
    const newHymn = this.props.onGetNewHymn();
    const {isAddNew, onCheckIfHymnChanged} = this.props;
    if (!newHymn.lyrics.length) {
      ToastAndroid.show(i18n.t("error_save_hymn_no_lyrics"), ToastAndroid.LONG);
    } else if (!newHymn.title) {
      ToastAndroid.show(i18n.t("error_save_hymn_no_title"), ToastAndroid.LONG);
    } else if (!isAddNew && !onCheckIfHymnChanged()) {
      this.editHymn();
    } else {
      this.openDialog();
    }
  }

  private addNewHymn = () => {
    const {token} = this.props.auth!;
    const newHymn = this.props.onGetNewHymn();

    if (token && this.state.publish) {
      this.props.publishNewHymn(newHymn);
    } else {
      this.props.addToSavedHymns(newHymn);
    }
    this.hideDialog();
  }

  private editHymn = () => {
    const updatedHymn = this.props.onGetNewHymn();
    const {token} = this.props.auth!;

    if (token && this.state.publish && updatedHymn.submittedBy) {
      this.props.publishChangesToHymn(updatedHymn);
    } else {
      this.props.editSavedHymn(updatedHymn);
    }
    this.hideDialog();
  }

  private renderDialog = () => {
    const {token} = this.props.auth!;
    const newHymn = this.props.onGetNewHymn();

    if (this.props.isAddNew) {
      return (
        <View>
          <Dialog.Title>{i18n.t("save_and_exit_title")}</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={dialogStyles.description}>{i18n.t("add_hymn_message")}</Paragraph>
            {token ? this.renderSwitch(i18n.t("switch_publish_new_hymn")) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <DialogButton onPress={this.hideDialog} title={i18n.t("btn_cancel")}/>
            <DialogButton onPress={this.addNewHymn} title={i18n.t("btn_save")}/>
          </Dialog.Actions>
        </View>
      );
    } else {
      return (
        <View>
          <Dialog.Title>{i18n.t("save_and_exit_title")}</Dialog.Title>
          <Dialog.Content>
            <Paragraph style={dialogStyles.description}>{i18n.t("update_hymn_message")}</Paragraph>
            {token && newHymn.submittedBy ? this.renderSwitch(i18n.t("switch_publish_updates")) : null}
          </Dialog.Content>
          <Dialog.Actions>
            <DialogButton onPress={this.hideDialog} title={i18n.t("btn_cancel")}/>
            <DialogButton onPress={this.editHymn} title={i18n.t("btn_save")}/>
          </Dialog.Actions>
        </View>
      );
    }

  }

  private renderSwitch = (label: string) => {
    const {publish} = this.state;
    return (
      <View style={style.switchContainer}>
        <Switch value={publish} onValueChange={() => this.setState({publish: !publish})} style={style.switch}/>
        <Text style={style.switchLabel}>{label}</Text>
      </View>
    );
  }

  public render() {
    const {visible} = this.state;
    return (
      <View>
        <Button
          mode="contained" style={style.button} onPress={this.onDone}>
          {i18n.t("btn_done")}
        </Button>

        <Portal>
          <Dialog
            visible={visible}
            onDismiss={this.hideDialog}>
            {this.renderDialog()}
          </Dialog>
        </Portal>
      </View>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  const {hymns, prefs, auth} = state;
  return {hymns, prefs, auth};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    addToSavedHymns: (newHymn: HymnItem) => dispatch(addToSavedHymns(newHymn)),
    editSavedHymn: (updatedHymn: HymnItem) => dispatch(editSavedHymn(updatedHymn)),
    publishNewHymn: (newHymn: HymnItem) => dispatch(publishNewHymn(newHymn)),
    publishChangesToHymn: (updatedHymn: HymnItem) => dispatch(publishChangesToHymn(updatedHymn)),
  };
};

const style = StyleSheet.create({
  button: {
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginStart: -5,
  },
  switch: {
    marginRight: 10,
  },
  switchLabel: {
    fontFamily: "sans-serif-medium",
    opacity: 0.7,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DoneButton);

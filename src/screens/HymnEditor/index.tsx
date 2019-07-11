import React from "react";
import { Alert, ScrollView, ToastAndroid, View } from "react-native";
import { Button, Divider, TextInput } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { addToSavedHymns, editSavedHymn } from "../../actions/hymnActions";
import i18n from "../../i18n";
import Action from "../../models/Action";
import HymnItem, { LyricsItem } from "../../models/HymnItem";
import { screens } from "../../navigation/savedHymnsStack";
import { AppState } from "../../reducers";
import AndroidAppBar, { AppBarAction, navIcons, showAsAction } from "../../shared/AndroidAppBar";
import HymnCoverAvatar from "../../shared/HymnCoverAvatar";
import ThemedView from "../../shared/ThemedView";
import globalStyles from "../../styles/globalStyles";
import icons from "../../styles/icons";
import ImagePickerModal from "./components/ImagePickerModal";
import style from "./style";

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface ReduxDispatch {
  addToSavedHymns: (newHymn: HymnItem) => void;
  editSavedHymn: (newHymn: HymnItem) => void;
}

type Props = AppState & ReduxDispatch & OwnProps;

interface State {
  hymnTitleInput: string;
  musicByInput: string;
  lyricsByInput: string;
  hymnCoverUri: string;
  lyrics: LyricsItem[];
}

class HymnEditor extends React.Component<Props, State> {

  public static navigationOptions = {
    header: null,
  };

  private hymnToEdit: HymnItem = this.props.navigation.getParam("hymnToEdit") || null;
  private isAddNew: boolean = !this.props.navigation.getParam("hymnToEdit");

  private inputToFocusOnOpenRef: TextInput | undefined;

  private navFocusListener: { remove: () => void } | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      hymnTitleInput: this.hymnToEdit ? this.hymnToEdit.title : "",
      musicByInput: this.hymnToEdit ? this.hymnToEdit.musicBy : "",
      lyricsByInput: this.hymnToEdit ? this.hymnToEdit.lyricsBy : "",
      hymnCoverUri: this.hymnToEdit ? this.hymnToEdit.hymnCoverImage : "",
      lyrics: this.hymnToEdit ? this.hymnToEdit.lyrics : [],
    };
  }

  private onDone = () => {
    if (this.isAddNew) {
      this.saveAndExit();
    } else if (!this.checkIfHymnChanged()) {
      this.discardAndExit();
    } else {
      Alert.alert(
        i18n.t("save_changes_title"),
        i18n.t("save_changes_message"),
        [
          {text: i18n.t("btn_cancel")},
          {text: i18n.t("btn_save"), onPress: this.saveAndExit},
        ],
      );
    }
  }

  private onGoBack = () => {
    if (!this.checkIfHymnChanged()) {
      this.discardAndExit();
    } else {
      Alert.alert(
        i18n.t("discard_changes_title"),
        i18n.t("discard_changes_message"),
        [
          {text: i18n.t("btn_cancel")},
          {text: i18n.t("btn_discard"), onPress: this.discardAndExit},
          {text: i18n.t("btn_save"), onPress: this.saveAndExit},
        ],
      );
    }
  }

  private onPreview = () => {
    const hymnToPreview = this.getNewHymn();

    if (this.navFocusListener) {
      this.navFocusListener.remove();
    }
    this.props.navigation.navigate(screens.HYMN_VIEW, {hymnToView: hymnToPreview, isPreviewMode: true});
  }

  private saveAndExit = () => {
    // TODO Save to backend
    if (!this.state.lyrics.length) {
      ToastAndroid.show(i18n.t("error_save_hymn"), ToastAndroid.LONG);
    } else {
      const newHymn = this.getNewHymn();
      this.isAddNew ? this.props.addToSavedHymns(newHymn) : this.props.editSavedHymn(newHymn);
      this.props.navigation.goBack();
    }
  }

  private discardAndExit = () => {
    this.props.navigation.goBack();
  }

  private getNewHymn(): HymnItem {
    const {hymnTitleInput, musicByInput, lyricsByInput, hymnCoverUri, lyrics} = this.state;

    let hymnCoverImage: string;

    if (hymnCoverUri) {
      hymnCoverImage = hymnCoverUri;
    } else if (this.hymnToEdit && this.hymnToEdit.hymnCoverImage) {
      hymnCoverImage = this.hymnToEdit.hymnCoverImage;
    } else {
      hymnCoverImage = "";
    }

    return new HymnItem(
      this.hymnToEdit ? this.hymnToEdit.hymnId : "-1",
      hymnTitleInput,
      lyrics,
      musicByInput,
      lyricsByInput,
      null,
      hymnCoverImage,
    );
  }

  // private setHymnCoverImage(hymnCoverUri: string) {
  //   this.setState({hymnCoverUri})
  // };

  private checkIfHymnChanged = () => {
    // returns true if changed
    return JSON.stringify(this.hymnToEdit) !== JSON.stringify(this.getNewHymn());
  }

  private getAppBarActions = (): AppBarAction[] => {
    const actions: AppBarAction[] = [];

    actions.push({
      title: i18n.t("btn_done"),
      icon: icons.check,
      show: showAsAction.ALWAYS,
      onActionSelected: this.onDone,
    });

    return actions;
  }

  public render() {
    const {hymnTitleInput, musicByInput, lyricsByInput, hymnCoverUri, lyrics} = this.state;

    return (
      <ThemedView style={globalStyles.screen}>
        <AndroidAppBar
          title={this.isAddNew ? i18n.t("add_new_hymn") : i18n.t("edit_hymn")}
          navIcon={navIcons.BACK}
          onNavIconClick={this.onGoBack}
          actions={this.getAppBarActions()}
        />

        <ScrollView collapsable={true}>
          <View style={style.container}>
            <View style={{alignItems: "center"}}>
              <HymnCoverAvatar hymnCoverImage={hymnCoverUri} size={120}/>
              <ImagePickerModal
                hymnCoverUri={hymnCoverUri}
                getNewHymnCoverUri={(newHymnCoverUri) => this.setState({hymnCoverUri: newHymnCoverUri})}/>
            </View>

            <TextInput
              ref={(ref: TextInput) => this.inputToFocusOnOpenRef = ref}
              label={i18n.t("hymn_title")}
              style={style.input}
              value={hymnTitleInput}
              onChangeText={(val: string) => this.setState({hymnTitleInput: val})}/>
            <TextInput
              label={i18n.t("lyrics_by")}
              style={style.input}
              value={lyricsByInput}
              onChangeText={(val: string) => this.setState({lyricsByInput: val})}/>
            <TextInput
              label={i18n.t("music_by")}
              style={style.input}
              value={musicByInput}
              onChangeText={(val: string) => this.setState({musicByInput: val})}/>

            <Divider style={style.divider}/>

            <TextInput
              label={i18n.t("lyrics")}
              multiline={true}
              mode="outlined"
              style={[style.input, {backgroundColor: this.props.prefs!.userPrefs.theme.colors.background}]}
              value={""}
              onChangeText={(val: string) => this.setState({})}/>

            <Button mode="contained" style={style.button} onPress={this.onDone}>
              {i18n.t("btn_done")}
            </Button>

            <Button style={style.button} onPress={this.onPreview}>
              {i18n.t("btn_preview")}
            </Button>

          </View>

        </ScrollView>
      </ThemedView>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  const {hymns, prefs} = state;
  return {hymns, prefs};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    addToSavedHymns: (newHymn: HymnItem) => dispatch(addToSavedHymns(newHymn)),
    editSavedHymn: (newHymn: HymnItem) => dispatch(editSavedHymn(newHymn)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HymnEditor);

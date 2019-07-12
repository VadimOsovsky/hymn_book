import _ from "lodash";
import React from "react";
import { Alert, ScrollView, ToastAndroid, View } from "react-native";
import { Button, Chip, Divider, IconButton, TextInput } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { addToSavedHymns, editSavedHymn } from "../../actions/hymnActions";
import i18n from "../../i18n";
import Action from "../../models/Action";
import HymnItem, { LyricsItem } from "../../models/HymnItem";
import { MusicKeys } from "../../models/MusicKeys";
import { screens } from "../../navigation/savedHymnsStack";
import { AppState } from "../../reducers";
import AndroidAppBar, { AppBarAction, navIcons, showAsAction } from "../../shared/AndroidAppBar";
import HymnCoverAvatar from "../../shared/HymnCoverAvatar";
import ThemedView from "../../shared/ThemedView";
import globalStyles from "../../styles/globalStyles";
import icons from "../../styles/icons";
import AddLyricsBtn from "./components/AddLyricsBtn";
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
  lyricsTextInput: string;
  hymnCoverUri: string;
  lyrics: LyricsItem[];
  selectedLyricsItem: LyricsItem | null;
}

class HymnEditor extends React.Component<Props, State> {

  public static navigationOptions = {
    header: null,
  };

  private hymnToEdit: HymnItem = this.props.navigation.getParam("hymnToEdit") || null;
  private isAddNew: boolean = !this.props.navigation.getParam("hymnToEdit");

  private navFocusListener: { remove: () => void } | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      hymnTitleInput: this.hymnToEdit ? this.hymnToEdit.title : "",
      musicByInput: this.hymnToEdit ? this.hymnToEdit.musicBy : "",
      lyricsByInput: this.hymnToEdit ? this.hymnToEdit.lyricsBy : "",
      lyricsTextInput: this.hymnToEdit ? this.hymnToEdit.lyrics[0].text : "",
      hymnCoverUri: this.hymnToEdit ? this.hymnToEdit.hymnCoverImage : "",
      lyrics: this.hymnToEdit ? _.cloneDeep(this.hymnToEdit.lyrics) : [],
      selectedLyricsItem: this.hymnToEdit ? this.hymnToEdit.lyrics[0] : null,
    };
  }

  private onDone = async () => {
    await this.updateLyrics();

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

  private onGoBack = async () => {
    await this.updateLyrics();

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

  private onAddLyricsItem = (newLyrics: LyricsItem) => {
    this.setState({
      lyrics: [...this.state.lyrics, newLyrics],
      selectedLyricsItem: newLyrics,
      lyricsTextInput: newLyrics.text,
    });
  }

  private onDeleteLyricsItem = (keyToDelete: MusicKeys) => {
    Alert.alert(
      i18n.t("delete_chords_title"),
      i18n.t("delete_chords_message"),
      [
        {text: i18n.t("btn_cancel")},
        {text: i18n.t("btn_delete"), onPress: () => this.deleteLyricsItem(keyToDelete)},
      ],
    );
  }

  private onPreview = () => {
    if (!this.state.lyrics.length) {
      ToastAndroid.show(i18n.t("error_save_hymn_no_lyrics"), ToastAndroid.LONG);
    } else {
      const hymnToPreview = this.getNewHymn();

      if (this.navFocusListener) {
        this.navFocusListener.remove();
      }
      this.props.navigation.navigate(screens.HYMN_VIEW, {hymnToView: hymnToPreview, isPreviewMode: true});
    }
  }

  private saveAndExit = () => {
    // TODO Save to backend
    if (!this.state.lyrics.length) {
      ToastAndroid.show(i18n.t("error_save_hymn_no_lyrics"), ToastAndroid.LONG);
    } else {
      const newHymn = this.getNewHymn();
      this.isAddNew ? this.props.addToSavedHymns(newHymn) : this.props.editSavedHymn(newHymn);
      this.props.navigation.goBack();
    }
  }

  private discardAndExit = () => {
    this.props.navigation.goBack();
  }

  private updateLyrics = () => new Promise((resolve) => {
    const lyrics: LyricsItem[] = _.cloneDeep(this.state.lyrics);
    if (this.state.selectedLyricsItem) {
      const lyricsToUpdate = lyrics[lyrics.indexOf(this.state.selectedLyricsItem)];
      if (lyricsToUpdate) {
        lyricsToUpdate.text = this.state.lyricsTextInput;
        this.setState({lyrics}, resolve);
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  })

  private deleteLyricsItem = (keyToDelete: MusicKeys) => {
    const lyrics: LyricsItem[] = _.clone(this.state.lyrics);

    lyrics.forEach((item, index) => {
      if (item.key === keyToDelete) {
        lyrics.splice(index, 1);
      }
    });
    this.setState({lyrics}, () => {
      // if the deleted item was selected, select first
      if (this.state.selectedLyricsItem!.key === keyToDelete) {
        this.setState({
          selectedLyricsItem: this.state.lyrics[0],
          lyricsTextInput: this.state.lyrics[0].text,
        });
      }
    });
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
  // }

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
    // tslint:disable-next-line:max-line-length
    const {hymnTitleInput, musicByInput, lyricsByInput, lyricsTextInput, hymnCoverUri, lyrics, selectedLyricsItem} = this.state;

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

            <View style={{flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginBottom: 15}}>
              {lyrics.map((item, index) => {
                return (
                  <Chip
                    key={item.key}
                    style={{marginRight: 5, marginBottom: 5}}
                    icon="music-note"
                    selected={item.key === selectedLyricsItem!.key}
                    onPress={() => this.setState({selectedLyricsItem: item, lyricsTextInput: item.text})}
                    onClose={this.state.lyrics.length > 1 ? () => this.onDeleteLyricsItem(item.key) : undefined}
                  >
                    {item.key ? i18n.t("with_chords", {key: item.key}) : i18n.t("no_chords")}
                  </Chip>
                );
              })}
              <AddLyricsBtn
                lyrics={lyrics}
                onAddLyrics={this.onAddLyricsItem}/>
            </View>

            {lyrics.map((item: LyricsItem, index) => {
              if (item.key === selectedLyricsItem!.key) {
                return (
                  <TextInput
                    key={item.key}
                    label={i18n.t("lyrics")}
                    multiline={true}
                    mode="outlined"
                    style={[style.input, {backgroundColor: this.props.prefs!.userPrefs.theme.colors.background}]}
                    value={lyricsTextInput}
                    onChangeText={(val: string) => this.setState({lyricsTextInput: val})}
                    onBlur={this.updateLyrics}/>
                );
              } else {
                return null;
              }
            })}

            <Button mode="contained" icon="publish" style={style.button} onPress={this.onDone}>
              {i18n.t(this.isAddNew ? "btn_publish" : "btn_update")}
            </Button>

            <Button style={style.button} icon="visibility" onPress={this.onPreview}>
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

import _ from "lodash";
import React from "react";
import { Alert, ScrollView, StatusBar, ToastAndroid, View } from "react-native";
import { Appbar, Button, Surface } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { addToSavedHymns, editSavedHymn } from "../../actions/hymnActions";
import i18n from "../../i18n";
import Action from "../../models/Action";
import HymnItem, { LyricsItem } from "../../models/HymnItem";
import { AppState } from "../../reducers";
import ThemedView from "../../shared/ui/ThemedView";
import globalStyles from "../../styles/globalStyles";
import InfoEditor from "./components/InfoEditor";
import LyricsEditor from "./components/LyricsEditor";
import style from "./style";

enum steps {
  LYRICS = "LYRICS",
  INFO = "INFO",
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface ReduxDispatch {
  addToSavedHymns: (newHymn: HymnItem) => void;
  editSavedHymn: (newHymn: HymnItem) => void;
}

type Props = AppState & ReduxDispatch & OwnProps;

interface State {
  currentStep: steps;
  lyrics: LyricsItem[];
}

class HymnEditor extends React.Component<Props, State> {

  public static navigationOptions = {
    header: null,
  };

  private hymnToEdit: HymnItem = this.props.navigation.getParam("hymnToEdit") || null;
  private isAddNew: boolean = !this.props.navigation.getParam("hymnToEdit");

  private lyricsEditorRef: LyricsEditor | undefined;
  private infoEditorRef: InfoEditor | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      currentStep: steps.LYRICS,
      lyrics: this.hymnToEdit ? _.cloneDeep(this.hymnToEdit.lyrics) : [],
    };
  }

  private onDone = () => {
    const lyrics = this.lyricsEditorRef!.getLyrics();
    this.setState({lyrics}, () => {

      if (!this.state.lyrics.length) {
        ToastAndroid.show(i18n.t("error_save_hymn_no_lyrics"), ToastAndroid.LONG);
      } else if (!this.infoEditorRef!.getHymnInfo().title) {
        ToastAndroid.show(i18n.t("error_save_hymn_no_title"), ToastAndroid.LONG);
      } else if (this.isAddNew) {
        this.saveAndExit();
      } else if (!this.checkIfHymnChanged() && 1 > 5) {
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

    });
  }

  private onGoBack = () => {
    const lyrics = this.lyricsEditorRef!.getLyrics();
    this.setState({lyrics}, () => {

      if (!this.checkIfHymnChanged()) {
        this.discardAndExit();
      } else {
        Alert.alert(
          i18n.t("discard_changes_title"),
          i18n.t("discard_changes_message"),
          [
            {text: i18n.t("btn_cancel")},
            {text: i18n.t("btn_discard"), onPress: this.discardAndExit},
            {text: i18n.t("btn_apply"), onPress: this.saveAndExit},
          ],
        );
      }

    });
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

  private getNewHymn(): HymnItem {
    const lyrics = this.lyricsEditorRef!.getLyrics();
    const info = this.infoEditorRef!.getHymnInfo();

    let hymnCoverImage: string;

    if (info.hymnCoverImage) {
      hymnCoverImage = info.hymnCoverImage;
    } else if (this.hymnToEdit && this.hymnToEdit.hymnCoverImage) {
      hymnCoverImage = this.hymnToEdit.hymnCoverImage;
    } else {
      hymnCoverImage = "";
    }

    return new HymnItem(
      this.hymnToEdit ? this.hymnToEdit.hymnId : "-1",
      info.title,
      lyrics,
      info.lyricsBy,
      info.musicBy,
      null,
      hymnCoverImage,
    );
  }

  // private setHymnCoverImage(hymnCoverUri: string) {
  //   this.setState({hymnCoverUri})
  // }

  private checkIfHymnChanged = (): boolean => {
    // returns true if changed
    // return JSON.stringify(this.hymnToEdit) !== JSON.stringify(this.getNewHymn());
    return false;
  }

  private getAppbarTitle = (): string => {
    const {currentStep} = this.state;
    if (this.isAddNew) {
      return currentStep === steps.LYRICS ? "add_hymn_lyrics" : "add_hymn_info";
    } else {
      return currentStep === steps.LYRICS ? "edit_hymn_lyrics" : "edit_hymn_info";
    }
  }

  public render() {
    const {currentStep, lyrics} = this.state;

    return (
      <ThemedView style={globalStyles.screen}>
        <Surface style={{elevation: 4}}>
          <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
            <Appbar.BackAction onPress={this.onGoBack}/>
            <Appbar.Content title={i18n.t(this.getAppbarTitle())}/>
            <Appbar.Action
              icon={currentStep === steps.LYRICS ? "lens" : "panorama-fish-eye"}
              size={15}
              style={{marginHorizontal: 5}}
              onPress={() => this.setState({currentStep: steps.LYRICS})}/>
            <Appbar.Action
              icon={currentStep === steps.INFO ? "lens" : "panorama-fish-eye"}
              size={15}
              style={{marginStart: 0, marginEnd: 5}}
              onPress={() => this.setState({currentStep: steps.INFO})}/>
          </Appbar.Header>
        </Surface>

        <ScrollView contentContainerStyle={style.container} keyboardShouldPersistTaps="handled">

          <LyricsEditor
            visible={currentStep === steps.LYRICS}
            lyrics={lyrics}
            inputTextColor={this.props.prefs!.userPrefs.theme.colors.text}
            ref={(ref: LyricsEditor) => this.lyricsEditorRef = ref}
          />
          <InfoEditor
            visible={currentStep === steps.INFO}
            title={this.hymnToEdit ? this.hymnToEdit.title : undefined}
            lyricsBy={this.hymnToEdit ? this.hymnToEdit.lyricsBy : undefined}
            musicBy={this.hymnToEdit ? this.hymnToEdit.musicBy : undefined}
            hymnCoverImage={this.hymnToEdit ? this.hymnToEdit.hymnCoverImage : undefined}
            ref={(ref: InfoEditor) => this.infoEditorRef = ref}
          />

          {currentStep === steps.LYRICS ?
            <Button style={style.button} onPress={() => this.setState({currentStep: steps.INFO})}>
              {i18n.t("btn_edit_hymn_info")}
            </Button>
            :
            <View>
              <Button mode="contained" icon="publish" style={style.button} onPress={this.onDone}>
                {i18n.t(this.isAddNew ? "btn_publish" : "btn_update")}
              </Button>
              <Button style={style.button} onPress={() => this.setState({currentStep: steps.LYRICS})}>
                {i18n.t("btn_edit_lyrics")}
              </Button>
            </View>
          }
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

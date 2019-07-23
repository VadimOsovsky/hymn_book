import _ from "lodash";
import React from "react";
import { Alert, BackHandler, ScrollView, StatusBar, View } from "react-native";
import { Appbar, Button, Surface } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { addToSavedHymns, editSavedHymn, publishNewHymn } from "../../actions/hymnActions";
import i18n from "../../i18n";
import Action from "../../models/Action";
import HymnItem, { LyricsItem } from "../../models/HymnItem";
import { AppState } from "../../reducers";
import LoadingModal from "../../shared/ui/LoadingModal";
import ThemedView from "../../shared/ui/ThemedView";
import globalStyles from "../../styles/globalStyles";
import DoneButton from "./components/DoneButton";
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
  editSavedHymn: (updatedHymn: HymnItem) => void;
  publishNewHymn: (newHymn: HymnItem) => void;
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

  public componentDidMount(): void {
    BackHandler.addEventListener("hardwareBackPress", this.onGoBack);
  }

  public componentWillUnmount(): void {
    BackHandler.removeEventListener("hardwareBackPress", this.onGoBack);
  }

  private onGoBack = () => {
    if (this.state.currentStep === steps.INFO) {
      this.setState({currentStep: steps.LYRICS});
      return true;
    }
    // else
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
            {text: i18n.t("btn_discard_and_exit"), onPress: this.discardAndExit},
          ],
        );
      }

    });

    // to prevent default behavior
    return true;
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
      this.hymnToEdit ? this.hymnToEdit.hymnId : "",
      info.title,
      lyrics,
      info.lyricsBy,
      info.musicBy,
      null,
      hymnCoverImage,
    );
  }

  private checkIfHymnChanged = (): boolean => {
    // returns true if changed
    const lyrics = this.lyricsEditorRef!.getLyrics();
    const info = this.infoEditorRef!.getHymnInfo();

    if (this.isAddNew && !lyrics.length && !info.title && !info.hymnCoverImage && !info.lyricsBy && !info.musicBy) {
      return false;
    } else {
      return JSON.stringify(this.hymnToEdit) !== JSON.stringify(this.getNewHymn());
    }
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
    const {doneHymnEditingLoading} = this.props.hymns!;

    return (
      <ThemedView style={globalStyles.screen}>
        <Surface style={{elevation: 4}}>
          <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
            <Appbar.BackAction
              onPress={this.onGoBack}/>
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
          {this.hymnToEdit ?
            <InfoEditor
              visible={currentStep === steps.INFO}
              title={this.hymnToEdit.title}
              lyricsBy={this.hymnToEdit.lyricsBy}
              musicBy={this.hymnToEdit.musicBy}
              hymnCoverImage={this.hymnToEdit.hymnCoverImage}
              ref={(ref: InfoEditor) => this.infoEditorRef = ref}
            />
            :
            <InfoEditor visible={currentStep === steps.INFO} ref={(ref: InfoEditor) => this.infoEditorRef = ref}/>
          }

          {currentStep === steps.LYRICS ?
            <Button style={style.button} onPress={() => this.setState({currentStep: steps.INFO})}>
              {i18n.t("btn_edit_hymn_info")}
            </Button>
            :
            <View>
              <DoneButton
                navigation={this.props.navigation}
                isAddNew={this.isAddNew}
                onCheckIfHymnChanged={this.checkIfHymnChanged.bind(this)}
                onGetNewHymn={this.getNewHymn.bind(this)}/>
              <Button style={style.button} onPress={() => this.setState({currentStep: steps.LYRICS})}>
                {i18n.t("btn_edit_lyrics")}
              </Button>
            </View>
          }
        </ScrollView>
        {/*<LoadingModal visible={doneHymnEditingLoading}*/}
        {/*              text={i18n.t(this.isAddNew ? "loader_adding_hymn" : "loader_applying_changes")}/>*/}
      </ThemedView>
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HymnEditor);

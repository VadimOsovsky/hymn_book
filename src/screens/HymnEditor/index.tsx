import React from "react"
import { Alert, ScrollView, StatusBar, View } from "react-native";
import { connect } from "react-redux";
import globalStyles from "../../styles/globalStyles";
import HeaderWrapper from "../../shared/HeaderWrapper";
import { Appbar, Button, Divider, TextInput } from "react-native-paper";
import HymnItem from "../../models/HymnItem";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import style from "./style";
import { screens } from "../../navigation/savedHymnsStack";
import { AppState } from "../../reducers";
import { ThunkDispatch } from "redux-thunk";
import Action from "../../models/Action";
import { addToSavedHymns, editSavedHymn } from "../../actions/hymnActions";
import ImagePickerModal from "./components/ImagePickerModal";
import HymnCoverAvatar from "../../shared/HymnCoverAvatar";
import ThemedView from "../../shared/ThemedView";
import i18n from "../../i18n";

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

interface ReduxDispatch {
  addToSavedHymns: (newHymn: HymnItem) => void,
  editSavedHymn: (newHymn: HymnItem) => void,
}

type Props = AppState & ReduxDispatch & OwnProps

interface State {
  hymnTitleInput: string
  authorNameInput: string
  hymnCoverUri: string
  lyricsTextEdit: string
}

class HymnEditor extends React.Component<Props, State> {

  static navigationOptions = {
    header: null
  };

  // get empty hymn in case of adding new hymn
  private hymnToEdit: HymnItem = this.props.navigation.getParam('hymnToEdit') || HymnItem.getEmptyHymn(this.props.hymns!.savedHymns);
  private isAddNew: boolean = !this.props.navigation.getParam('hymnToEdit');

  private inputToFocusOnOpenRef: TextInput | undefined;

  private navFocusListener: { remove: Function } | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      hymnTitleInput: this.hymnToEdit.title,
      authorNameInput: this.hymnToEdit.author,
      hymnCoverUri: this.hymnToEdit.hymnCoverImage,
      lyricsTextEdit: this.hymnToEdit.lyrics,
    }
  }

  private onDone = () => {
    if (this.isAddNew) {
      this.saveAndExit()
    } else if (!this.checkIfHymnChanged()) {
      this.discardAndExit()
    } else {
      Alert.alert(
        i18n.t('save_changes_title'),
        i18n.t('save_changes_message'),
        [
          {text: i18n.t('btn_cancel')},
          {text: i18n.t('btn_save'), onPress: this.saveAndExit},
        ]
      )
    }
  };

  private onGoBack = () => {
    if (!this.checkIfHymnChanged()) {
      this.discardAndExit()
    } else {
      Alert.alert(
        i18n.t('discard_changes_title'),
        i18n.t('discard_changes_message'),
        [
          {text: i18n.t('btn_cancel')},
          {text: i18n.t('btn_discard'), onPress: this.discardAndExit},
          {text: i18n.t('btn_save'), onPress: this.saveAndExit},
        ]
      )
    }
  };

  private onPreview = () => {
    const hymnToPreview = this.getNewHymn();

    this.navFocusListener && this.navFocusListener.remove();
    this.props.navigation.navigate(screens.HYMN_VIEW, {hymnToView: hymnToPreview, isPreviewMode: true});
  };

  private saveAndExit = () => {
    const newHymn = this.getNewHymn();
    this.isAddNew ? this.props.addToSavedHymns(newHymn) : this.props.editSavedHymn(newHymn);
    this.props.navigation.goBack();
  };

  private discardAndExit = () => {
    this.props.navigation.goBack()
  };

  private getNewHymn(): HymnItem {
    const {hymnTitleInput, authorNameInput, hymnCoverUri, lyricsTextEdit} = this.state;

    return new HymnItem(
      this.hymnToEdit.hymnId,
      this.hymnToEdit.backendId,
      hymnTitleInput,
      authorNameInput,
      hymnCoverUri || this.hymnToEdit.hymnCoverImage,
      lyricsTextEdit,
    );
  };

  private setHymnCoverImage(hymnCoverUri: string) {
    this.setState({hymnCoverUri})
  };

  private checkIfHymnChanged = () => {
    // returns true if changed
    return JSON.stringify(this.hymnToEdit) !== JSON.stringify(this.getNewHymn());
  };

  render() {
    const {hymnTitleInput, authorNameInput, hymnCoverUri, lyricsTextEdit} = this.state;

    return (
      <ThemedView style={globalStyles.screen}>
        <HeaderWrapper>
          <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
            <Appbar.BackAction onPress={this.onGoBack}/>
            <Appbar.Content
              title={this.isAddNew ? i18n.t('add_new_hymn') : i18n.t('edit_hymn')}
            />
            <Appbar.Action icon={"check"} onPress={this.onDone}/>
          </Appbar.Header>
        </HeaderWrapper>

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
              label={i18n.t('hymn_title')}
              style={style.input}
              value={hymnTitleInput}
              onChangeText={(val: string) => this.setState({hymnTitleInput: val})}/>
            <TextInput
              label={i18n.t('author_name')}
              style={style.input}
              value={authorNameInput}
              onChangeText={(val: string) => this.setState({authorNameInput: val})}/>

            <Divider style={style.divider}/>

            <TextInput
              label={i18n.t('lyrics')}
              multiline={true}
              mode="outlined"
              style={[style.input, {backgroundColor: this.props.prefs!.userPrefs.theme.colors.background}]}
              value={lyricsTextEdit}
              onChangeText={(val: string) => this.setState({lyricsTextEdit: val})}/>

            <Button mode="contained" style={style.button} onPress={this.onDone}>
              {i18n.t('btn_done')}
            </Button>

            <Button style={style.button} onPress={this.onPreview}>
              {i18n.t('btn_preview')}
            </Button>

          </View>

        </ScrollView>
      </ThemedView>
    )
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
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(HymnEditor);

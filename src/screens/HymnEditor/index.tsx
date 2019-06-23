import React from "react"
import { ScrollView, StatusBar, View } from "react-native";
import globalStyles from "../../styles/globalStyles";
import HeaderWrapper from "../../shared/HeaderWrapper";
import { Appbar, Button, TextInput } from "react-native-paper";
import HymnItem from "../../models/HymnItem";
import { NavigationParams } from "react-navigation";
import style from "./style";
import { screens } from "../../navigation/savedHymnsStack";
import { HymnsInterface } from "../../reducers/hymnsReducer";
import { AppState } from "../../reducers";
import { ThunkDispatch } from "redux-thunk";
import Action from "../../models/Action";
import { addToSavedHymns, editSavedHymn, getSavedHymnsFromStorage } from "../../actions/hymnActions";
import { connect } from "react-redux";

interface OwnProps {
  navigation: NavigationParams
}

interface ReduxState {
  hymns: HymnsInterface
}

interface ReduxDispatch {
  addToSavedHymns: (newHymn: HymnItem) => void,
  editSavedHymn: (newHymn: HymnItem) => void,
}

type Props = ReduxState & ReduxDispatch & OwnProps

interface State {
  hymnTitleInput: string
  authorNameInput: string
  authorImageUrlInput: string
  lyricsTextEdit: string
}

class HymnEditor extends React.Component<Props, State> {

  static navigationOptions = {
    header: null
  };

  // get empty hymn in case of adding new hymn
  private hymnToEdit: HymnItem = this.props.navigation.getParam('hymnToEdit') || HymnItem.getEmptyHymn(this.props.hymns.savedHymns);
  private isAddNew: boolean = !this.props.navigation.getParam('hymnToEdit');

  private inputToFocusOnOpenRef: TextInput | undefined;

  private navFocusListener: { remove: Function } | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      hymnTitleInput: this.hymnToEdit.title,
      authorNameInput: this.hymnToEdit.author,
      authorImageUrlInput: this.hymnToEdit.authorImage,
      lyricsTextEdit: this.hymnToEdit.lyrics,
    }
  }

  componentDidMount(): void {
    this.navFocusListener = this.props.navigation.addListener('didFocus', () => {
      this.isAddNew && this.inputToFocusOnOpenRef && this.inputToFocusOnOpenRef.focus()
    });
  }

  private onDone = () => {
    const newHymn = this.getNewHymn();
    this.isAddNew ? this.props.addToSavedHymns(newHymn) : this.props.editSavedHymn(newHymn);
    this.props.navigation.goBack();
  };

  private onPreview = () => {
    const hymnToPreview = this.getNewHymn();

    this.navFocusListener && this.navFocusListener.remove();
    this.props.navigation.navigate(screens.HYMN_VIEW, {hymnToView: hymnToPreview, isPreviewMode: true});
  };

  private getNewHymn(): HymnItem {
    const {hymnTitleInput, authorNameInput, authorImageUrlInput, lyricsTextEdit} = this.state;

    return new HymnItem(
      this.hymnToEdit.hymnId,
      this.hymnToEdit.backendId,
      hymnTitleInput,
      authorNameInput,
      authorImageUrlInput || this.hymnToEdit.authorImage,
      lyricsTextEdit,
    );
  }

  render() {

    const {hymnTitleInput, authorNameInput, authorImageUrlInput, lyricsTextEdit} = this.state;

    return (
      <View style={globalStyles.screen}>
        <HeaderWrapper>
          <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
            <Appbar.BackAction onPress={() => this.props.navigation.goBack()}/>
            <Appbar.Content
              title={this.isAddNew ? "Add New Hymn" : "Edit Hymn"}
            />
          </Appbar.Header>
        </HeaderWrapper>

        <ScrollView collapsable={true}>
          <View style={style.container}>
            <TextInput
              ref={(ref: TextInput) => this.inputToFocusOnOpenRef = ref}
              label="Hymn title"
              style={style.input}
              value={hymnTitleInput}
              onChangeText={(val: string) => this.setState({hymnTitleInput: val})}/>
            <TextInput
              label="Author name"
              style={style.input}
              value={authorNameInput}
              onChangeText={(val: string) => this.setState({authorNameInput: val})}/>
            <TextInput
              label="Author Image URL"
              style={style.input}
              value={authorImageUrlInput}
              onChangeText={(val: string) => this.setState({authorImageUrlInput: val})}/>
            <TextInput
              label="Lyrics"
              multiline={true}
              mode="outlined"
              style={[style.input, style.textEdit]}
              value={lyricsTextEdit}
              onChangeText={(val: string) => this.setState({lyricsTextEdit: val})}/>

            <Button mode="contained" style={style.button}
                    onPress={this.onDone}>
              Done
            </Button>

            <Button style={style.button} onPress={this.onPreview}>
              Preview
            </Button>

          </View>

        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state: AppState) => {
  return {
    hymns: state.hymns
  }
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    addToSavedHymns: (newHymn: HymnItem) => dispatch(addToSavedHymns(newHymn)),
    editSavedHymn: (newHymn: HymnItem) => dispatch(editSavedHymn(newHymn)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(HymnEditor);

import React from "react"
import { ScrollView, StatusBar, View } from "react-native";
import globalStyles from "../../styles/globalStyles";
import HeaderWrapper from "../../shared/HeaderWrapper";
import { Appbar, Button, TextInput } from "react-native-paper";
import HymnItem from "../../models/HymnItem";
import { NavigationParams } from "react-navigation";
import style from "./style";

interface Props {
  navigation: NavigationParams
}

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
  private hymnToEdit: HymnItem = this.props.navigation.getParam('hymnToEdit') || HymnItem.getEmptyHymn();
  private isAddNew: boolean = !this.hymnToEdit.hymnId;

  private inputToFocusOnOpenRef: TextInput | undefined;

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
    this.props.navigation.addListener('didFocus', () => {
      this.isAddNew && this.inputToFocusOnOpenRef && this.inputToFocusOnOpenRef.focus()
    });
  }

  render() {

    const {hymnTitleInput, authorNameInput, lyricsTextEdit} = this.state;

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
              label="Lyrics"
              multiline={true}
              mode="outlined"
              style={[style.input, style.textEdit]}
              value={lyricsTextEdit}
              onChangeText={(val: string) => this.setState({lyricsTextEdit: val})}/>

            <Button mode="contained" onPress={() => console.log("VO: lyricsTextEdit", {lyrics: lyricsTextEdit})}>
              Done
            </Button>
          </View>

        </ScrollView>
      </View>
    )
  }
}

export default HymnEditor;

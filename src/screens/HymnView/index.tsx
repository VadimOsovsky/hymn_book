import React from "react";
import { Alert, ScrollView, StatusBar, Text, View } from "react-native"
import { Appbar, Menu } from "react-native-paper";
import { NavigationParams } from "react-navigation";
import globalStyles from "../../styles/globalStyles";
import HymnItem from "../../models/HymnItem";
import style from "./style";
import HeaderWrapper from "../../shared/HeaderWrapper";
import { removeFromSavedHymns } from "../../actions/hymnActions";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../reducers";
import Action from "../../models/Action";
import { connect } from "react-redux";
import { screens } from "../../navigation/savedHymnsStack";

interface OwnProps {
  // default
  navigation: NavigationParams
}

interface ReduxDispatch {
  removeFromSavedHymns: (ids: number[]) => void
}

type Props = OwnProps & ReduxDispatch

interface State {
  isHeaderMenuVisible: boolean
}

class HymnView extends React.Component<Props, State> {

  private hymnToView: HymnItem = this.props.navigation.getParam('hymnToView');
  private isPreviewMode: boolean = this.props.navigation.getParam('isPreviewMode');

  constructor(props: Props) {
    super(props);

    this.state = {
      isHeaderMenuVisible: false,
    };
  }

  componentDidMount(): void {
    console.log("VO: this.isPreviewMode", this.isPreviewMode)
  }

  private showHeaderMenu = () => this.setState({isHeaderMenuVisible: true});
  private hideHeaderMenu = () => this.setState({isHeaderMenuVisible: false});

  private onEdit = () => {
    this.hideHeaderMenu();
    this.props.navigation.replace(screens.HYMN_EDITOR, {hymnToEdit: this.hymnToView})
  };

  private onDelete = () => {
    this.hideHeaderMenu();
    Alert.alert(
      this.hymnToView.title,
      'Would you like to remove this song from Saved Hymns?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK', onPress: () => {
            this.props.removeFromSavedHymns([this.hymnToView.hymnId]);
            this.props.navigation.goBack();
          }
        },
      ],
    );
  };

  private renderHeaderMenu = () => {
    if (!this.isPreviewMode) {
      return (
        <Menu
          visible={this.state.isHeaderMenuVisible}
          style={{transform: [{translateY: StatusBar.currentHeight || 20}]}}
          onDismiss={this.hideHeaderMenu}
          anchor={
            <Appbar.Action onPress={this.showHeaderMenu} icon="more-vert" color="#FFF"/>
          }
        >
          <Menu.Item onPress={this.onEdit} title="Edit Hymn"/>
          <Menu.Item onPress={this.onDelete} title="Delete from Saved"/>
        </Menu>
      )
    }
  };

  render() {
    return (
      <View style={globalStyles.screen}>
        <HeaderWrapper>
          <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
            <Appbar.BackAction onPress={() => this.props.navigation.goBack()}/>
            <Appbar.Content title={this.hymnToView.title || "Unknown title"}/>
            {this.renderHeaderMenu()}
          </Appbar.Header>
        </HeaderWrapper>

        <ScrollView>
          <View style={style.lyricsView}>
            <Text style={style.lyricsText}>{this.hymnToView.lyrics}</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    removeFromSavedHymns: (ids: number[]) => dispatch(removeFromSavedHymns(ids)),
  }
};

export default connect(null, mapDispatchToProps)(HymnView);

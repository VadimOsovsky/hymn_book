import React from "react";
import HymnItem from "../../../models/HymnItem";
import { Avatar, List } from "react-native-paper";
import style from "../style";
import { NavigationParams } from "react-navigation";
import { lightTheme } from "../../../styles/appTheme";
import SwipeableListItemAction from "../../../models/SwipeableListItemAction";
import SwipeableListItem from "../../../shared/SwipableListItem";
import { Alert } from "react-native";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../../reducers";
import Action from "../../../models/Action";
import { removeFromSavedHymns } from "../../../actions/hymnActions";
import { connect } from "react-redux";

interface OwnProps {
  savedHymn: HymnItem
  navigation: NavigationParams
}

interface ReduxDispatch {
  removeFromSavedHymns: (ids: number[]) => void
}

type Props = OwnProps & ReduxDispatch

class SavedHymnElement extends React.Component<Props> {

  private actions: SwipeableListItemAction[] = [];

  componentWillMount(): void {
    this.actions.push(new SwipeableListItemAction(
      'Delete',
      'delete',
      '#FFF',
      lightTheme.colors.danger,
      this.showAlert
    ));
    this.actions.push(new SwipeableListItemAction(
      'Edit',
      'edit',
      '#FFF',
      lightTheme.colors.primary,
      () => this.props.navigation.navigate("HymnEditor", {hymnToEdit: this.props.savedHymn})
    ));
  }

  private showAlert = () => {
    Alert.alert(
      this.props.savedHymn.title,
      'Would you like to remove this song from Saved Hymns?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => this.props.removeFromSavedHymns([this.props.savedHymn.hymnId])},
      ],
    );
  };

  render() {
    const {title, lyrics, authorImage} = this.props.savedHymn;
    const authorSrc = authorImage ? {uri: authorImage} : require("../../../assets/images/author_placeholder.png");

    return (
      <SwipeableListItem actions={this.actions} vibrateOnOpen={true}>
        <List.Item title={title}
                   style={{backgroundColor: lightTheme.colors.surface}}
                   onPress={() => this.props.navigation.navigate('HymnView', {hymnToView: this.props.savedHymn})}
                   description={HymnItem.formatLyricsForPreview(lyrics)}
                   left={() => <Avatar.Image style={style.authorAvatar} size={54} source={authorSrc}/>}/>
      </SwipeableListItem>
    )
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    removeFromSavedHymns: (ids: number[]) => dispatch(removeFromSavedHymns(ids)),
  }
};

export default connect(null, mapDispatchToProps)(SavedHymnElement);

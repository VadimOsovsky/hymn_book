import React from "react";
import HymnItem from "../../../models/HymnItem";
import { Avatar, List } from "react-native-paper";
import style from "../style";
import { NavigationParams } from "react-navigation";
import { lightTheme } from "../../../styles/appTheme";
import SwipeableListItemAction from "../../../models/SwipeableListItemAction";
import SwipeableListItem from "../../../shared/SwipableListItem";

interface Props {
  savedHymn: HymnItem
  navigation: NavigationParams
}

class SavedHymnElement extends React.Component<Props> {

  private actions: SwipeableListItemAction[] = [];

  componentWillMount(): void {
    this.actions.push(new SwipeableListItemAction('Delete', 'delete', '#FFF', lightTheme.colors.danger,));
    this.actions.push(new SwipeableListItemAction('Edit', 'edit', '#FFF', lightTheme.colors.primary,));
  }

  render() {
    const {title, lyrics, authorImage} = this.props.savedHymn;
    const authorSrc = authorImage ? {uri: authorImage} : require("../../../assets/images/author_placeholder.png");

    return (
      <SwipeableListItem actions={this.actions} vibrateOnOpen={true}>
        <List.Item title={title}
                   style={{backgroundColor: lightTheme.colors.surface}}
                   onPress={() => this.props.navigation.navigate('HymnView', {hymnToView: this.props.savedHymn})}
                   description={this.props.savedHymn.formatLyricsForPreview(lyrics)}
                   left={() => <Avatar.Image style={style.authorAvatar} size={54} source={authorSrc}/>}/>
      </SwipeableListItem>
    )
  }
}

export default SavedHymnElement;

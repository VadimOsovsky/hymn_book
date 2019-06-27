import React from "react";
import HymnItem from "../../../models/HymnItem";
import { List } from "react-native-paper";
import { NavigationParams } from "react-navigation";
import { lightTheme } from "../../../styles/appTheme";
import SwipeableListItemAction from "../../../models/SwipeableListItemAction";
import SwipeableListItem from "../../../shared/SwipeableListItem";
import { Alert } from "react-native";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../../reducers";
import Action from "../../../models/Action";
import { removeFromSavedHymns } from "../../../actions/hymnActions";
import { connect } from "react-redux";
import HymnCoverAvatar from "../../../shared/HymnCoverAvatar";

interface OwnProps {
  savedHymn: HymnItem
  navigation: NavigationParams
  isSwipingDisabled: boolean
  isHymnSelected: boolean
  onPress: (hymn: HymnItem) => void
  onLongPress: (hymnId: number) => void
}

interface ReduxDispatch {
  removeFromSavedHymns: (ids: number[]) => void
}

type Props = OwnProps & ReduxDispatch

interface State {
  isHymnSelected: boolean
  isSwipingDisabled: boolean
}


class SavedHymnElement extends React.Component<Props, State> {

  private actions: SwipeableListItemAction[] = [];
  private swipeableListItemRef: SwipeableListItem | undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      isHymnSelected: this.props.isHymnSelected,
      isSwipingDisabled: this.props.isSwipingDisabled,
    };
  }

  componentWillMount(): void {
    this.initSwipeActions();
  }

  componentWillReceiveProps(nextProps: Readonly<OwnProps & ReduxDispatch>, nextContext: any): void {
    this.setState({
      isHymnSelected: nextProps.isHymnSelected,
      isSwipingDisabled: nextProps.isSwipingDisabled,
    })
  }

  private initSwipeActions = () => {
    this.actions.push(new SwipeableListItemAction(
      'Delete',
      'delete',
      '#FFF',
      lightTheme.colors.error,
      this.showDeleteItemAlert
    ));
    this.actions.push(new SwipeableListItemAction(
      'Edit',
      'edit',
      '#FFF',
      lightTheme.colors.primary,
      this.editHymn
    ));
  };

  private showDeleteItemAlert = () => {
    this.closeSwipeableItemActions();

    Alert.alert(
      this.props.savedHymn.title,
      'Would you like to remove this song from Saved Hymns?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: this.deleteHymn},
      ],
    );
  };

  private editHymn = () => {
    this.closeSwipeableItemActions();
    this.props.navigation.navigate("HymnEditor", {hymnToEdit: this.props.savedHymn});
  };

  private deleteHymn = () => this.props.removeFromSavedHymns([this.props.savedHymn.hymnId]);

  private closeSwipeableItemActions = () => this.swipeableListItemRef && this.swipeableListItemRef.moveItemToValue(0);

  render() {
    const {title, lyrics, hymnCoverImage} = this.props.savedHymn;

    return (
      <SwipeableListItem
        ref={(ref: SwipeableListItem) => this.swipeableListItemRef = ref}
        actions={this.actions}
        vibrateOnOpen
        swipingDisabled={this.state.isSwipingDisabled}
      >
        <List.Item title={title}
                   style={{
                     backgroundColor: this.state.isHymnSelected ?
                       lightTheme.colors.highlight :
                       lightTheme.colors.surface
                   }}
                   description={HymnItem.formatLyricsForPreview(lyrics)}
                   onPress={() => {
                     this.closeSwipeableItemActions();
                     this.props.onPress(this.props.savedHymn);
                   }}
                   onLongPress={() => {
                     this.closeSwipeableItemActions();
                     this.props.onLongPress(this.props.savedHymn.hymnId);
                   }}
                   left={() => <HymnCoverAvatar hymnCoverImage={hymnCoverImage}/>}
        />
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

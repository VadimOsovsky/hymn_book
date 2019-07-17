import React from "react";
import { Alert, ToastAndroid } from "react-native";
import { List } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { removeFromSavedHymns } from "../../../actions/hymnActions";
import i18n from "../../../i18n";
import Action from "../../../models/Action";
import HymnItem from "../../../models/HymnItem";
import SwipeableListItemAction from "../../../models/SwipeableListItemAction";
import { screens } from "../../../navigation/savedHymnsStack";
import { AppState } from "../../../reducers";
import HymnCoverAvatar from "../../../shared/HymnCoverAvatar";
import SwipeableListItem from "../../../shared/ui/SwipeableListItem";
import icons from "../../../styles/icons";

interface OwnProps {
  savedHymn: HymnItem;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  isSwipingDisabled: boolean;
  isHymnSelected: boolean;
  onPress: (hymn: HymnItem) => void;
  onLongPress: (hymn: HymnItem) => void;
}

interface ReduxDispatch {
  removeFromSavedHymns: (ids: string[]) => void;
}

type Props = OwnProps & ReduxDispatch & AppState;

interface State {
  isHymnSelected: boolean;
  isSwipingDisabled: boolean;
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

  public componentWillMount(): void {
    this.initSwipeActions();
  }

  public componentWillReceiveProps(nextProps: Readonly<OwnProps & ReduxDispatch>, nextContext: any): void {
    if (nextProps.isSwipingDisabled) {
      this.closeSwipeableItemActions();
    }

    this.setState({
      isHymnSelected: nextProps.isHymnSelected,
      isSwipingDisabled: nextProps.isSwipingDisabled,
    });
  }

  private initSwipeActions = () => {
    const {error, primary, info} = this.props.prefs!.userPrefs.theme.colors;
    this.actions.push(new SwipeableListItemAction(
      i18n.t("btn_share"),
      icons.share,
      "#FFF",
      info,
      this.share,
    ));
    this.actions.push(new SwipeableListItemAction(
      i18n.t("btn_delete"),
      icons.delete,
      "#FFF",
      error,
      this.showDeleteItemAlert,
    ));
    this.actions.push(new SwipeableListItemAction(
      i18n.t("btn_edit"),
      icons.edit,
      "#FFF",
      primary,
      this.editHymn,
    ));
  }

  private share = () => {
    this.closeSwipeableItemActions();
    ToastAndroid.show("Shared", ToastAndroid.SHORT);
  }

  private showDeleteItemAlert = () => {
    this.closeSwipeableItemActions();

    Alert.alert(
      this.props.savedHymn.title,
      i18n.t("delete_selected_message", {count: 1}),
      [
        {text: i18n.t("btn_cancel"), style: "cancel"},
        {text: i18n.t("btn_ok"), onPress: this.deleteHymn},
      ],
    );
  }

  private editHymn = () => {
    this.closeSwipeableItemActions();
    this.props.navigation.navigate(screens.HYMN_EDITOR, {hymnToEdit: this.props.savedHymn});
  }

  private deleteHymn = () => this.props.removeFromSavedHymns([this.props.savedHymn.hymnId]);

  private closeSwipeableItemActions = () => this.swipeableListItemRef && this.swipeableListItemRef.moveItemToValue(0);

  public render() {
    const {title, lyrics, hymnCoverImage} = this.props.savedHymn;
    const {highlight, background} = this.props.prefs!.userPrefs.theme.colors;

    return (
      <SwipeableListItem
        ref={(ref: SwipeableListItem) => this.swipeableListItemRef = ref}
        actions={this.actions}
        vibrateOnOpen
        swipingDisabled={this.state.isSwipingDisabled}
      >
        <List.Item title={title}
                   style={{backgroundColor: this.state.isHymnSelected ? highlight : background}}
                   description={HymnItem.formatLyricsForPreview(lyrics)}
                   onPress={() => this.props.onPress(this.props.savedHymn)}
                   onLongPress={() => this.props.onLongPress(this.props.savedHymn)}
                   left={() => <HymnCoverAvatar hymnCoverImage={hymnCoverImage}/>}
        />
      </SwipeableListItem>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  const {prefs} = state;
  return {prefs};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    removeFromSavedHymns: (ids: string[]) => dispatch(removeFromSavedHymns(ids)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedHymnElement);

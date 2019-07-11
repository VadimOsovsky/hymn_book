import React from "react";
import { Alert, ScrollView, ToastAndroid, View } from "react-native";
import { Text } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { removeFromSavedHymns } from "../../actions/hymnActions";
import i18n from "../../i18n";
import Action from "../../models/Action";
import HymnItem, { LyricsItem } from "../../models/HymnItem";
import { screens } from "../../navigation/savedHymnsStack";
import { AppState } from "../../reducers";
import AndroidAppBar, { AppBarAction, navIcons, showAsAction } from "../../shared/AndroidAppBar";
import ThemedView from "../../shared/ThemedView";
import globalStyles from "../../styles/globalStyles";
import icons from "../../styles/icons";
import HymnViewFAB from "./components/HymnViewFAB";
import style from "./style";

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface ReduxDispatch {
  removeFromSavedHymns: (ids: string[]) => void;
}

type Props = OwnProps & ReduxDispatch & AppState;

interface State {
  currentLyrics: LyricsItem;
  isHeaderMenuVisible: boolean;
}

class HymnView extends React.Component<Props, State> {

  private hymnToView: HymnItem = this.props.navigation.getParam("hymnToView");
  private isPreviewMode: boolean = this.props.navigation.getParam("isPreviewMode");

  constructor(props: Props) {
    super(props);

    this.state = {
      currentLyrics: this.hymnToView.lyrics[0],
      isHeaderMenuVisible: false,
    };
  }

  private onShare = () => {
    ToastAndroid.show("Shared", ToastAndroid.SHORT);
  }

  private onEdit = () => {
    this.props.navigation.replace(screens.HYMN_EDITOR, {hymnToEdit: this.hymnToView});
  }

  private onDelete = () => {
    Alert.alert(
      this.hymnToView.title,
      i18n.t("delete_selected_message", {count: 1}),
      [
        {text: i18n.t("btn_cancel"), style: "cancel"},
        {
          text: i18n.t("btn_ok"), onPress: () => {
            this.props.removeFromSavedHymns([this.hymnToView.hymnId]);
            this.props.navigation.goBack();
          },
        },
      ],
    );
  }

  private getAppBarActions = (): AppBarAction[] => {
    if (this.isPreviewMode) { return []; }

    const actions: AppBarAction[] = [];
    actions.push({
      title: i18n.t("btn_share"),
      icon: icons.share,
      show: showAsAction.NEVER,
      onActionSelected: this.onShare,
    });

    actions.push({
      title: i18n.t("edit_hymn"),
      icon: icons.edit,
      show: showAsAction.NEVER,
      onActionSelected: this.onEdit,
    });

    actions.push({
      title: i18n.t("delete_from_saved"),
      icon: icons.delete,
      show: showAsAction.NEVER,
      onActionSelected: this.onDelete,
    });
    return actions;
  }

  public render() {
    return (
      <ThemedView style={globalStyles.screen}>
        <AndroidAppBar
          title={this.hymnToView.title || i18n.t("unknown_title")}
          subtitle={this.hymnToView.lyricsBy || this.hymnToView.musicBy || i18n.t("unknown_author")}
          navIcon={navIcons.BACK}
          onNavIconClick={this.props.navigation.goBack}
          actions={this.getAppBarActions()}
        />

        <ScrollView>
          <View style={style.lyricsView}>
            <Text style={style.lyricsText}>{this.state.currentLyrics.text}</Text>
          </View>
        </ScrollView>
        <HymnViewFAB lyrics={[]} />
      </ThemedView>
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

export default connect(mapStateToProps, mapDispatchToProps)(HymnView);

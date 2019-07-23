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
import AndroidAppBar, { AppBarAction, navIcons, showAsAction } from "../../shared/ui/AndroidAppBar";
import ThemedView from "../../shared/ui/ThemedView";
import globalStyles from "../../styles/globalStyles";
import icons from "../../styles/icons";
import style from "./style";
import ChordKeySelectionModal from "../HymnEditor/components/ChordKeySelectionModal";

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface ReduxDispatch {
  removeFromSavedHymns: (ids: string[]) => void;
}

type Props = OwnProps & ReduxDispatch & AppState;

interface State {
  currentLyricsItem: LyricsItem;
  isHeaderMenuVisible: boolean;
}

class HymnView extends React.Component<Props, State> {

  private hymnToView: HymnItem = this.props.navigation.getParam("hymnToView");
  private isPreviewMode: boolean = this.props.navigation.getParam("isPreviewMode");

  constructor(props: Props) {
    super(props);

    this.state = {
      currentLyricsItem: this.hymnToView.lyrics[0],
      isHeaderMenuVisible: false,
    };
  }

  private chordModalRef: ChordKeySelectionModal | null = null;

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

  private onOpenDialog = () => {
    this.chordModalRef!.openDialog();
  }

  private onReport = () => {
    ToastAndroid.show("Report WIP", 5);
  }

  private getAppBarActions = (): AppBarAction[] => {
    if (this.isPreviewMode) {
      return [];
    }

    const actions: AppBarAction[] = [];

    if (this.hymnToView.lyrics.length > 1) {
      actions.push({
        title: i18n.t("select_chords_version"),
        icon: icons.music_note,
        show: showAsAction.ALWAYS,
        onActionSelected: this.onOpenDialog,
      });
    }

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

    actions.push({
      title: i18n.t("report"),
      icon: icons.delete,
      show: showAsAction.NEVER,
      onActionSelected: this.onReport,
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

        <ScrollView contentContainerStyle={{paddingBottom: 150}}>
          <View style={style.lyricsView}>
            <Text style={style.lyricsText}>{this.state.currentLyricsItem.text || i18n.t("no_lyrics")}</Text>
          </View>
        </ScrollView>
        <ChordKeySelectionModal
          ref={(ref) => this.chordModalRef = ref!}
          isViewMode={true}
          lyrics={this.hymnToView.lyrics}
          selectedLyricsItem={this.state.currentLyricsItem}
          onKeySelected={(item: LyricsItem) => this.setState({currentLyricsItem: item})}/>
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

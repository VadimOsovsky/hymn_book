import React from "react";
import { Alert, ScrollView, ToastAndroid, View } from "react-native"
import { Text } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import globalStyles from "../../styles/globalStyles";
import HymnItem from "../../models/HymnItem";
import style from "./style";
import { removeFromSavedHymns } from "../../actions/hymnActions";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../reducers";
import Action from "../../models/Action";
import { connect } from "react-redux";
import { screens } from "../../navigation/savedHymnsStack";
import ThemedView from "../../shared/ThemedView";
import i18n from "../../i18n";
import AndroidAppBar, { AppBarAction, navIcons, showAsAction } from "../../shared/AndroidAppBar";
import icons from "../../styles/icons";

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

interface ReduxDispatch {
  removeFromSavedHymns: (ids: number[]) => void
}

type Props = OwnProps & ReduxDispatch & AppState

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

  private onShare = () => {
    ToastAndroid.show("Shared", ToastAndroid.SHORT)
  };

  private onEdit = () => {
    this.props.navigation.replace(screens.HYMN_EDITOR, {hymnToEdit: this.hymnToView})
  };

  private onDelete = () => {
    Alert.alert(
      this.hymnToView.title,
      i18n.t('delete_selected_message', {count: 1}),
      [
        {text: i18n.t('btn_cancel'), style: 'cancel'},
        {
          text: i18n.t('btn_ok'), onPress: () => {
            this.props.removeFromSavedHymns([this.hymnToView.hymnId]);
            this.props.navigation.goBack();
          }
        },
      ],
    );
  };

  private getAppBarActions = (): AppBarAction[] => {
    const actions: AppBarAction[] = [];

    actions.push({
      title: i18n.t('btn_share'),
      icon: icons.share,
      show: showAsAction.NEVER,
      onActionSelected: this.onShare,
    });

    actions.push({
      title: i18n.t('edit_hymn'),
      icon: icons.edit,
      show: showAsAction.NEVER,
      onActionSelected: this.onEdit,
    });

    actions.push({
      title: i18n.t('delete_from_saved'),
      icon: icons.delete,
      show: showAsAction.NEVER,
      onActionSelected: this.onDelete,
    });

    return actions;
  };

  render() {
    return (
      <ThemedView style={globalStyles.screen}>
        <AndroidAppBar
          title={this.hymnToView.title || i18n.t('unknown_title')}
          navIcon={navIcons.BACK}
          onNavIconClick={this.props.navigation.goBack}
          actions={this.getAppBarActions()}
        />

        <ScrollView>
          <View style={style.lyricsView}>
            <Text style={style.lyricsText}>{this.hymnToView.lyrics}</Text>
          </View>
        </ScrollView>
      </ThemedView>
    );
  }

  onActionSelected = (position: number) => {
    if (position) ToastAndroid.show(position.toString(), ToastAndroid.SHORT)
  }
}

const mapStateToProps = (state: AppState) => {
  const {prefs} = state;
  return {prefs};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    removeFromSavedHymns: (ids: number[]) => dispatch(removeFromSavedHymns(ids)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(HymnView);

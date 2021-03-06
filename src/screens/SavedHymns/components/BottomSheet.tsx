import _ from "lodash";
import React from "react";
import { Alert, StatusBar, StyleSheet, ToastAndroid, Vibration } from "react-native";
import { List, Portal } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import i18n from "../../../i18n";
import HymnItem from "../../../models/HymnItem";
import User from "../../../models/User";
import { screens } from "../../../navigation/savedHymnsStack";
import ThemedView from "../../../shared/ui/ThemedView";
import { STATUS_BAR_DARKENED_COLOR, STATUS_BAR_INITIAL_COLOR } from "../../../styles/styleVariables";

interface OwnProps {
  user: User | null;
  isSearchMode: boolean;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  onSelectHymn: (hymnId: string) => void;
  onRemoveFromSaved: (hymnId: string) => void;
  onDeleteHymnFromServer: (hymnId: string) => void;
}

interface SheetAction {
  title: string;
  icon: string;
  onPress: () => void;
}

type Props = OwnProps;

interface State {
  hymn: HymnItem | null;
  actions: SheetAction[];
}

class BottomSheet extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      hymn: null,
      actions: [],
    };
  }

  private user = this.props.user;
  private isSearchMode = this.props.isSearchMode;

  private RBSheet: RBSheet | null = null;
  private sheetClosingTime = 200;

  public componentWillMount(): void {
    this.setState({actions: this.getActions()});
  }

  public componentWillReceiveProps(nextProps: Readonly<OwnProps>, nextContext: any): void {
    if (_.isBoolean(nextProps.isSearchMode)) {
      this.isSearchMode = nextProps.isSearchMode;
      this.setState({actions: this.getActions()});
    }
    if (nextProps.user) {
      this.user = nextProps.user;
      this.setState({actions: this.getActions()});
    }
  }

  public onActionSelected = (cb: () => void) => {
    this.RBSheet!.close();
    setTimeout(cb, this.sheetClosingTime);
  }

  public openSheet = (hymn: HymnItem) => {
    Vibration.vibrate(50);
    this.setState({hymn}, () => {
      this.RBSheet!.open();
      this.setState({actions: this.getActions()});
      StatusBar.setBackgroundColor(STATUS_BAR_DARKENED_COLOR);
    });
  }

  private selectHymn = () => {
    this.props.onSelectHymn(this.state.hymn!.hymnId);
  }

  private share = () => {
    ToastAndroid.show("Share WIP", 5);
  }

  private edit = () => {
    this.props.navigation.navigate(screens.HYMN_EDITOR, {hymnToEdit: this.state.hymn});
  }

  private removeFromSaved = () => {
    Alert.alert(
      this.state.hymn!.title,
      i18n.t("delete_selected_message", {count: 1}),
      [
        {text: i18n.t("btn_cancel"), style: "cancel"},
        {text: i18n.t("btn_ok"), onPress: () => this.props.onRemoveFromSaved(this.state.hymn!.hymnId)},
      ],
    );
  }

  private removeFromServer = () => {
    Alert.alert(
      this.state.hymn!.title,
      i18n.t("delete_from_server_message"),
      [
        {text: i18n.t("btn_cancel"), style: "cancel"},
        {text: i18n.t("btn_delete"), onPress: () => this.props.onDeleteHymnFromServer!(this.state.hymn!.hymnId)},
      ],
    );
  }

  private report = () => {
    ToastAndroid.show("Report WIP", 5);
  }

  private getActions = (): SheetAction[] => {
    const actions = [];
    const {hymn} = this.state;
    console.log("VO: hymn", hymn);
    console.log("VO: this.user", this.user);

    if (!this.isSearchMode) {
      actions.push({
        title: "select_hymn",
        icon: "check-circle",
        onPress: () => this.onActionSelected(this.selectHymn),
      });
    }
    actions.push({
      title: "share_hymn",
      icon: "share",
      onPress: () => this.onActionSelected(this.share),
    });
    actions.push({
      title: "edit_hymn",
      icon: "edit",
      onPress: () => this.onActionSelected(this.edit),
    });
    actions.push({
      title: "delete_from_saved",
      icon: "star-border",
      onPress: () => this.onActionSelected(this.removeFromSaved),
    });
    if (this.user && hymn && hymn.submittedBy && this.user._id === hymn.submittedBy) {
      actions.push({
        title: "delete_from_server",
        icon: "delete",
        onPress: () => this.onActionSelected(this.removeFromServer),
      });
    }
    actions.push({
      title: "report",
      icon: "error",
      onPress: () => this.onActionSelected(this.report),
    });

    return actions;
  }

  public render() {
    const sheetBottomMargin = 60;
    return (
      <Portal>
        <RBSheet
          ref={(ref) => this.RBSheet = ref}
          closeOnDragDown
          closeOnPressMask
          onClose={() => StatusBar.setBackgroundColor(STATUS_BAR_INITIAL_COLOR)}
          duration={this.sheetClosingTime}
          height={46 * (this.state.actions.length + 1) + 20 + sheetBottomMargin}
          customStyles={{
            wrapper: {position: "absolute", bottom: -sheetBottomMargin, top: 0, left: 0, right: 0, zIndex: 999},
            container: {borderTopStartRadius: 20, borderTopEndRadius: 20},
          }}
        >
          <ThemedView
            style={{paddingBottom: sheetBottomMargin}}>
            <List.Section>
              <List.Subheader
                style={style.menuItem}>{this.state.hymn ? this.state.hymn.title : "no_title"}</List.Subheader>
              {this.state.actions.map((action) => {
                return (
                  <List.Item
                    key={action.title}
                    title={i18n.t(action.title)}
                    style={style.menuItem}
                    left={(props) => <List.Icon style={{marginVertical: 3}} {...props} icon={action.icon}/>}
                    onPress={action.onPress}
                  />
                );
              })}
            </List.Section>
          </ThemedView>
        </RBSheet>
      </Portal>
    );
  }
}

const style = StyleSheet.create({
  menuItem: {
    padding: 0,
  },
});

export default BottomSheet;

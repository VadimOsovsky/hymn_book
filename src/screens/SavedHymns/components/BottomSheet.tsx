import _ from "lodash";
import React from "react";
import { Alert, StyleSheet, ToastAndroid, Vibration } from "react-native";
import { List, Portal } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import i18n from "../../../i18n";
import HymnItem from "../../../models/HymnItem";
import { screens } from "../../../navigation/savedHymnsStack";
import ThemedView from "../../../shared/ui/ThemedView";

interface OwnProps {
  isSearchMode: boolean;
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  onSelectHymn: (hymnId: string) => void;
  onRemoveFromSaved: (hymnId: string) => void;
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
      actions: this.getActions(),
    };
  }

  private isSearchMode = this.props.isSearchMode;

  private RBSheet: RBSheet | null = null;
  private sheetClosingTime = 200;

  public componentWillReceiveProps(nextProps: Readonly<OwnProps>, nextContext: any): void {
    if (_.isBoolean(nextProps.isSearchMode)) {
      this.isSearchMode = nextProps.isSearchMode;
      this.setState({actions: this.getActions()});
    }
  }

  public openSheet = (hymn: HymnItem) => {
    Vibration.vibrate(50);
    this.setState({hymn});
    this.RBSheet!.open();
  }

  private onSelectHymn = () => {
    this.RBSheet!.close();
    setTimeout(() => {
      this.props.onSelectHymn(this.state.hymn!.hymnId);
    }, this.sheetClosingTime);
  }

  private onShare = () => {
    this.RBSheet!.close();
    setTimeout(() => {
      ToastAndroid.show("Share WIP", 5);
    }, this.sheetClosingTime);
  }

  private onEdit = () => {
    this.RBSheet!.close();
    setTimeout(() => {
      this.props.navigation.navigate(screens.HYMN_EDITOR, {hymnToEdit: this.state.hymn});
    }, this.sheetClosingTime - 50);
  }

  private onRemoveFromSaved = () => {
    this.RBSheet!.close();
    // to compensate closing animation
    setTimeout(() => {
      Alert.alert(
        this.state.hymn!.title,
        i18n.t("delete_selected_message", {count: 1}),
        [
          {text: i18n.t("btn_cancel"), style: "cancel"},
          {text: i18n.t("btn_ok"), onPress: () => this.props.onRemoveFromSaved(this.state.hymn!.hymnId)},
        ],
      );
    }, this.sheetClosingTime);
  }

  private onReport = () => {
    this.RBSheet!.close();
    setTimeout(() => {
      ToastAndroid.show("Report WIP", 5);
    }, this.sheetClosingTime);
  }

  private getActions = (): SheetAction[] => {
    const actions = [];

    if (!this.isSearchMode) {
      actions.push({
        title: "select_hymn",
        icon: "check-circle",
        onPress: this.onSelectHymn,
      });
    }
    actions.push({
      title: "share_hymn",
      icon: "share",
      onPress: this.onShare,
    }, {
      title: "edit_hymn",
      icon: "edit",
      onPress: this.onEdit,
    }, {
      title: "delete_from_saved",
      icon: "star-border",
      onPress: this.onRemoveFromSaved,
    }, {
      title: "report",
      icon: "error",
      onPress: this.onReport,
    });

    return actions;
  }

  public render() {
    const actions = this.getActions();
    const sheetBottomMargin = 60;
    return (
      <Portal>
        <RBSheet
          ref={(ref) => this.RBSheet = ref}
          closeOnDragDown
          closeOnPressMask
          duration={this.sheetClosingTime}
          height={46 * (actions.length + 1) + 20 + sheetBottomMargin}
          customStyles={{
            wrapper: {position: "absolute", bottom: -sheetBottomMargin, top: 0, left: 0, right: 0},
            container: {borderTopStartRadius: 20, borderTopEndRadius: 20},
          }}
        >
          <ThemedView
            style={{paddingBottom: sheetBottomMargin}}>
            <List.Section>
              <List.Subheader
                style={style.menuItem}>{this.state.hymn ? this.state.hymn.title : "no_title"}</List.Subheader>
              {actions.map((action) => {
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

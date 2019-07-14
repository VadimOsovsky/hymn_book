import React from "react";
import { StyleSheet, ToastAndroid } from "react-native";
import { FAB } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import i18n from "../../../i18n";
import { screens } from "../../../navigation/savedHymnsStack";

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
  openSearch: () => void;
}

interface State {
  isOpen: boolean;
}

export default class SavedHymnsFAB extends React.Component<Props, State> {
  public state = {
    isOpen: false,
  };

  public render() {
    return (
      <FAB.Group
        open={this.state.isOpen}
        style={style}
        icon={this.state.isOpen ? "close" : "add"}
        actions={[
          {
            icon: "playlist-add",
            label: i18n.t("fab_add_new_hymn"),
            onPress: () => this.props.navigation.navigate(screens.HYMN_EDITOR, {hymnToEdit: null}),
          },
          {
            icon: "search",
            label: i18n.t("fab_find_existing"),
            onPress: this.props.openSearch,
          },
        ]}
        onStateChange={({open: isOpen}) => this.setState({isOpen})}
      />
    );
    // return (
    //   <FAB
    //     icon="add"
    //     style={style.fab}
    //     onPress={() => this.props.navigation.navigate(screens.HYMN_EDITOR, {hymnToEdit: null})}
    //   />
    // );
  }
}

const style = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
    margin: 16,
  },
});

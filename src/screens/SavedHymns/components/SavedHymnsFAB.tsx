import React from "react";
import { StyleSheet, ToastAndroid } from "react-native";
import { FAB } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import i18n from "../../../i18n";
import { screens } from "../../../navigation/savedHymnsStack";

interface Props {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

interface State {
  isOpen: boolean;
}

export default class SavedHymnsFAB extends React.Component<Props, State> {
  public state = {
    isOpen: false,
  };

  public render() {
    // return (
    //   <FAB.Group
    //     open={this.state.isOpen}
    //     style={style}
    //     icon={this.state.isOpen ? "close" : "add"}
    //     actions={[
    //       {
    //         icon: "playlist-add",
    //         label: i18n.t("add_hymn_manually"),
    //         onPress: () => this.props.navigation.navigate(screens.HYMN_EDITOR, {hymnToEdit: null}),
    //       },
    //       {
    //         icon: "cloud-upload",
    //         label: i18n.t("import_files"),
    //         onPress: () => ToastAndroid.show("Import WIP", ToastAndroid.SHORT),
    //       },
    //     ]}
    //     onStateChange={({open: isOpen}) => this.setState({isOpen})}
    //   />
    // );
    return (
      <FAB
        icon="add"
        style={style.fab}
        onPress={() => this.props.navigation.navigate(screens.HYMN_EDITOR, {hymnToEdit: null})}
      />
    );
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

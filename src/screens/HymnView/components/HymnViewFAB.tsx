import React from "react";
import { StyleSheet, ToastAndroid } from "react-native";
import { FAB } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import i18n from "../../../i18n";
import { screens } from "../../../navigation/savedHymnsStack";

interface TemporaryLyricsItem {
  key: string;
  lyrics: string;
}

interface Props {
  lyrics: TemporaryLyricsItem[];
}

interface State {
  isOpen: boolean;
}

export default class HymnViewFAB extends React.Component<Props, State> {
  public readonly state = {
    isOpen: false,
  };

  private getFabActions = () => {
    const actions: any[] = [];

    this.props.lyrics.forEach((chord: TemporaryLyricsItem) => {
      if (!chord.key) {
        actions.push({
          icon: "music-off",
          label: chord.key,
          onClick: () => {/*TODO*/},
        });
      } else {
        actions.unshift({
          icon: "music-note",
          label: chord.key,
          onClick: () => {/*TODO*/},
        });
      }
    });

    return actions;
  }

  public render() {
    const {lyrics} = this.props;

    if (lyrics.length <= 1) {
      return null;
    } else {
      return (
        <FAB.Group
          open={this.state.isOpen}
          style={style}
          icon={this.state.isOpen ? "close" : "queue-music"}
          actions={this.getFabActions()}
          onStateChange={({open: isOpen}) => this.setState({isOpen})}
        />
      );
    }
  }
}

const style = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});

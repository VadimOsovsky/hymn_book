import React from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import { LyricsItem } from "../../../models/HymnItem";
import i18n from "../../../i18n";

interface Props {
  lyrics: LyricsItem[];
  onLyricsSelect: (item: LyricsItem) => void;
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

    this.props.lyrics.forEach((item: LyricsItem) => {
      actions.push({
        icon: item.key ? "music-note" : "not-interested",
        label: item.key || i18n.t("no_chords"),
        onClick: () => this.props.onLyricsSelect(item),
      });
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

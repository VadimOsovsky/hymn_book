import _ from "lodash";
import React, { PureComponent } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Chip, IconButton, TextInput } from "react-native-paper";
import i18n from "../../../i18n";
import { LyricsItem } from "../../../models/HymnItem";
import { MusicKeys } from "../../../models/MusicKeys";
import ChordKeySelectionModal from "./ChordKeySelectionModal";

interface OwnProps {
  lyrics: LyricsItem[];
  lyricsInputBackgroundColor: string;
}

type Props = OwnProps;

type State = Readonly<{
  lyrics: LyricsItem[];
  selectedLyricsItem: LyricsItem | null;
}>;

class LyricsEditor extends PureComponent<Props, State> {

  private chordModalRef: ChordKeySelectionModal | undefined;

  public readonly state: State = {
    lyrics: this.props.lyrics,
    selectedLyricsItem: this.props.lyrics[0] || null,
  };

  public getNewLyrics = (): LyricsItem[] => this.state.lyrics;

  private onKeySelected = (updatedLyrics: LyricsItem[], newLyricsItem: LyricsItem) => {
    this.setState({
      lyrics: updatedLyrics,
      selectedLyricsItem: newLyricsItem,
    });
  }

  private onDeleteLyricsItem = (keyToDelete: MusicKeys) => {
    Alert.alert(
      i18n.t("delete_chords_title"),
      i18n.t("delete_chords_message"),
      [
        {text: i18n.t("btn_cancel")},
        {text: i18n.t("btn_delete"), onPress: () => this.deleteLyricsItem(keyToDelete)},
      ],
    );
  }

  private deleteLyricsItem = (keyToDelete: MusicKeys) => {
    const lyrics: LyricsItem[] = _.clone(this.state.lyrics);

    lyrics.forEach((item, index) => {
      if (item.key === keyToDelete) {
        lyrics.splice(index, 1);
      }
    });
    this.setState({lyrics}, () => {
      // if the deleted item was selected, select first
      if (this.state.selectedLyricsItem!.key === keyToDelete) {
        this.setState({
          selectedLyricsItem: this.state.lyrics[0],
        });
      }
    });
  }

  private onLyricsInputChange = (val: string, updateAtIndex: number) => {
    this.setState((prevState) => {
      const lyrics = _.cloneDeep(prevState.lyrics);
      lyrics[updateAtIndex].text = val;
      return {lyrics};
    });
  }

  private changeChordKeyForLyrics = (text: string, index: number) => {
    this.chordModalRef!.openDialog(text, index);
  }

  private renderAddButton = () => {
    if (!this.state.lyrics.length) {
      return (
        <Button
          icon="add"
          onPress={() => this.chordModalRef!.openDialog()}
        >{i18n.t("btn_add_lyrics")}</Button>
      );
    } else {
      return (
        <IconButton
          icon="add"
          size={20}
          onPress={() => this.chordModalRef!.openDialog()}
        />
      );
    }
  }

  public render() {
    const {lyrics, selectedLyricsItem} = this.state;

    return (
      <View>
        <View style={{flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginBottom: 15}}>
          {lyrics.map((item, index) => {
            return (
              <Chip
                key={item.key}
                style={{marginRight: 5, marginBottom: 5}}
                icon="music-note"
                selected={item.key === selectedLyricsItem!.key}
                onPress={() => this.setState({selectedLyricsItem: item})}
                onClose={this.state.lyrics.length > 1 ? () => this.onDeleteLyricsItem(item.key) : undefined}
              >
                {item.key ? i18n.t("with_chords", {key: item.key}) : i18n.t("no_chords")}
              </Chip>
            );
          })}
          {this.renderAddButton()}
          <ChordKeySelectionModal
            ref={(ref) => this.chordModalRef = ref!}
            lyrics={lyrics}
            onKeySelected={this.onKeySelected}/>
        </View>

        {lyrics.map((item, index) => {
          if (item.key === selectedLyricsItem!.key) {
            return (
              <TextInput
                key={item.key}
                label={i18n.t("lyrics")}
                multiline={true}
                mode="outlined"
                style={[style.input, {backgroundColor: this.props.lyricsInputBackgroundColor}]}
                value={item.text}
                onChangeText={(val) => this.onLyricsInputChange(val, index)}/>
            );
          } else {
            return null;
          }
        })}
      </View>
    );
  }
}

export default LyricsEditor;

const style = StyleSheet.create({
  input: {
    marginBottom: 15,
  },
});

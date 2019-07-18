import _ from "lodash";
import React, { PureComponent } from "react";
import { Alert, StyleSheet, TextInput, View } from "react-native";
import { Button, Chip, IconButton } from "react-native-paper";
import { NavigationEvents } from "react-navigation";
import i18n from "../../../i18n";
import { guideTips } from "../../../models/GuideTips";
import { LyricsItem } from "../../../models/HymnItem";
import { MusicKeys } from "../../../models/MusicKeys";
import GuideBanner from "../../../shared/ui/GuideBanner";
import ChordKeySelectionModal from "./ChordKeySelectionModal";

interface OwnProps {
  visible: boolean;
  lyrics: LyricsItem[];
  inputTextColor: string;
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

  public getLyrics = (): LyricsItem[] => this.state.lyrics;

  private onNavFocus = () => {
    if (!this.state.lyrics.length) {
      this.chordModalRef!.openDialog();
    }
  }

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
    const textColor = this.props.inputTextColor;

    return (
      <View style={{display: this.props.visible ? "flex" : "none"}}>
        <NavigationEvents onDidFocus={this.onNavFocus}/>
        <GuideBanner tipType={guideTips.HYMN_EDITOR_STEP_1}/>
        <View style={style.container}>
          {lyrics.map((item, index) => {
            return (
              <Chip
                key={item.key}
                style={style.chip}
                icon={item.key ? "music-note" : "not-interested"}
                selected={item.key === selectedLyricsItem!.key}
                onPress={() => this.setState({selectedLyricsItem: item})}
                // onLongPress={() => this.changeChordKeyForLyrics(item.text, index)}
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
            isViewMode={false}
            onKeySelected={this.onKeySelected}/>
        </View>

        {lyrics.map((item, index) => {
          if (item.key === selectedLyricsItem!.key) {
            return (
              <TextInput
                key={item.key}
                placeholder={i18n.t("type_lyrics_here")}
                multiline={true}
                style={[style.input, {color: textColor}]}
                placeholderTextColor={"#999"}
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
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    alignContent: "center",
    marginBottom: 15,
  },
  chip: {
    marginRight: 5,
    marginVertical: 6,
  },
  input: {
    marginBottom: 15,
    fontSize: 17,
  },
});

import _ from "lodash";
import React, { PureComponent } from "react";
import { Animated, Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { Button, Dialog, Portal, Text, TouchableRipple } from "react-native-paper";
// @ts-ignore
import RadioBtn from "react-native-radio-button-android";
import i18n from "../../../i18n";
import { LyricsItem } from "../../../models/HymnItem";
import { MusicKeys, musicKeysArr } from "../../../models/MusicKeys";
import DialogButton from "../../../shared/ui/DialogButton";

interface OwnProps {
  lyrics: LyricsItem[];
  isViewMode: boolean;
  selectedLyricsItem?: LyricsItem;
  onKeySelected: (...args: any) => void;
}

type Props = OwnProps;

type State = Readonly<{
  lyrics: LyricsItem[];
  visible: boolean;
  availableKeys: string[]
  selectedKey: string | null
  modalMaxHeight: Animated.Value
}>;

class ChordKeySelectionModal extends PureComponent<Props, State> {

  public readonly state: State = {
    lyrics: this.props.lyrics,
    visible: false,
    availableKeys: [],
    selectedKey: this.props.selectedLyricsItem ? this.props.selectedLyricsItem.key : null,
    modalMaxHeight: new Animated.Value(0),
  };

  private editedLyricsText: string = "";
  private editedLyricsIndex: number | null = null;

  public componentWillMount(): void {
    this.setModalMaxHeight();
  }

  public componentWillReceiveProps(nextProps: Readonly<OwnProps>, nextContext: any): void {
    if (nextProps.lyrics) {
      this.setState({lyrics: nextProps.lyrics});
    }
    if (nextProps.selectedLyricsItem) {
      this.setState({selectedKey: nextProps.selectedLyricsItem.key});
    }
  }

  public openDialog = (text?: string, index?: number) => {
    this.setAvailableChordKeys();
    this.editedLyricsText = _.isString(text) ? text : "";
    this.editedLyricsIndex = _.isNumber(index) ? index : null;
    this.setState({visible: true});

    if (!this.props.isViewMode) {
      this.setState({selectedKey: null});
    }
  }

  private setAvailableChordKeys = () => {
    const availableKeys: string[] = [];
    if (!this.props.isViewMode) {
      const usedKeys: string[] = [];
      this.state.lyrics.forEach((item) => {
        usedKeys.push(item.key);
      });
      musicKeysArr.forEach((key) => {
        if (!usedKeys.includes(key)) {
          availableKeys.push(key);
        }
      });
    } else {
      this.props.lyrics.forEach((item) => {
        availableKeys.push(item.key);
      });
    }
    this.setState({availableKeys});
  }

  public hideDialog = () => {
    this.setState({visible: false});
  }

  private setModalMaxHeight = () => {
    const dims = Dimensions.get("window");
    const margin = dims.height > dims.width ? 250 : 200;

    Animated.spring(this.state.modalMaxHeight, {
      toValue: dims.height - margin,
      bounciness: 0,
    }).start();
  }

  private onRadioPress = (key: string) => {
    this.setState({selectedKey: key}, () => {
      this.onDoneSelecting();
    });
  }

  private onDoneSelecting = () => {
    const {lyrics, selectedKey} = this.state;

    if (this.props.isViewMode) {
      this.props.lyrics.forEach((item) => {
        if (item.key === selectedKey) {
          this.props.onKeySelected(item);
        }
      });

    } else {
      const newLyricsItem: LyricsItem = {
        key: selectedKey as MusicKeys,
        text: this.editedLyricsText,
      };
      const updatedLyrics = _.clone(lyrics);

      // if changing an existing lyrics item's key
      if (_.isNumber(this.editedLyricsIndex)) {
        updatedLyrics[this.editedLyricsIndex] = newLyricsItem;
      } else {
        updatedLyrics.push(newLyricsItem);
      }
      this.setState({
        lyrics: updatedLyrics,
      });

      this.props.onKeySelected(updatedLyrics, newLyricsItem);
    }
    this.hideDialog();
  }

  private renderRadioBtn = (key: string) => {
    return (
      <View key={key}>
        <TouchableRipple onPress={() => this.onRadioPress(key)}>
          <View pointerEvents="none" style={style.radioContainer}>
            <RadioBtn value={this.state.selectedKey === key}/>
            <Text style={style.radioLabel}>{key || i18n.t("no_chords")}</Text>
          </View>
        </TouchableRipple>
      </View>
    );
  }

  public render() {
    return (
      <Portal>
        <Dialog
          visible={this.state.visible}
          onDismiss={this.hideDialog}>
          <Dialog.Title>{i18n.t("select_chords_key")}</Dialog.Title>

          <Dialog.Content>
            <Animated.View style={{maxHeight: this.state.modalMaxHeight}}
                           onLayout={this.setModalMaxHeight}>
              <ScrollView>
                {this.state.availableKeys.map((key) => {
                  return this.renderRadioBtn(key);
                })}
              </ScrollView>
            </Animated.View>
          </Dialog.Content>

          <Dialog.Actions>
            <DialogButton title={i18n.t("btn_cancel")} onPress={this.hideDialog}/>
          </Dialog.Actions>

        </Dialog>
      </Portal>
    );
  }
}

export default ChordKeySelectionModal;

const style = StyleSheet.create({
  radioContainer: {
    width: "100%",
    marginVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  radioLabel: {
    opacity: 0.7,
    marginHorizontal: 10,
    fontFamily: "sans-serif-medium",
  },
});

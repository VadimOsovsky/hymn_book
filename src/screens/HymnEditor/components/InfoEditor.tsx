import React, { PureComponent } from "react";
import { View } from "react-native";
import HymnCoverAvatar from "../../../shared/HymnCoverAvatar";
import MyInput, { inputPresets } from "../../../shared/ui/MyInput";
import ImagePickerModal from "./ImagePickerModal";

interface OwnProps {
  visible: boolean;
  title?: string;
  musicBy?: string;
  lyricsBy?: string;
  hymnCoverImage?: string;
}

type Props = OwnProps;

type State = Readonly<{
  hymnTitleInput: string;
  musicByInput: string;
  lyricsByInput: string;
  hymnCoverUri: string;
}>;

class InfoEditor extends PureComponent<Props, State> {
  public readonly state: State = {
    hymnTitleInput: this.props.title || "",
    musicByInput: this.props.musicBy || "",
    lyricsByInput: this.props.lyricsBy || "",
    hymnCoverUri: this.props.hymnCoverImage || "",
  };

  public getHymnInfo = () => {
    const {hymnTitleInput, musicByInput, lyricsByInput, hymnCoverUri} = this.state;
    return {
      title: hymnTitleInput,
      lyricsBy: lyricsByInput,
      musicBy: musicByInput,
      hymnCoverImage: hymnCoverUri,
    };
  }

  public render() {
    const {hymnTitleInput, musicByInput, lyricsByInput, hymnCoverUri} = this.state;

    return (
      <View style={{display: this.props.visible ? "flex" : "none", marginBottom: 30}}>
        <View style={{alignItems: "center"}}>
          <HymnCoverAvatar hymnCoverImage={hymnCoverUri} size={120}/>
          <ImagePickerModal
            hymnCoverUri={hymnCoverUri}
            getNewHymnCoverUri={(newHymnCoverUri) => this.setState({hymnCoverUri: newHymnCoverUri})}/>
        </View>

        <MyInput
          preset={inputPresets.HYMN_TITLE}
          value={hymnTitleInput}
          onChangeText={(val: string) => this.setState({hymnTitleInput: val})}
        />
        <MyInput
          preset={inputPresets.HYMN_LYRICS_BY}
          value={lyricsByInput}
          onChangeText={(val: string) => this.setState({lyricsByInput: val})}
        />
        <MyInput
          preset={inputPresets.HYMN_MUSIC_BY}
          value={musicByInput}
          onChangeText={(val: string) => this.setState({musicByInput: val})}
        />
      </View>
    );
  }
}

export default InfoEditor;

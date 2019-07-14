import React from "react";
import { Image, ImageSourcePropType, StyleSheet } from "react-native";

interface Props {
  hymnCoverImage: string;
  size?: number;
}

interface State {
  hymnCoverSrc: ImageSourcePropType | { uri: string };
}

const DEFAULT_HYMN_COVER_PATH = "../assets/images/hymn_default_cover.jpg";

class HymnCoverAvatar extends React.Component<Props, State> {

  private size = this.props.size || 54;

  constructor(props: Props) {
    super(props);

    this.state = {
      // lateinit
      hymnCoverSrc: {uri: ""},
    };
  }

  public componentWillMount(): void {
    this.setHymnCoverSrc(this.props.hymnCoverImage);
  }

  public componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
    this.setHymnCoverSrc(nextProps.hymnCoverImage);
  }

  private setHymnCoverSrc = (src: string) => {
    if (src) {
      this.setState({hymnCoverSrc: {uri: src}});
    } else {
      this.setState({hymnCoverSrc: require(DEFAULT_HYMN_COVER_PATH)});
    }
  }

  private showDefaultCover = () => {
    this.setState({hymnCoverSrc: require(DEFAULT_HYMN_COVER_PATH)});
  }

  public render() {
    return (
      <Image
        style={[style.hymnCoverImage, {width: this.size, height: this.size}]}
        source={this.state.hymnCoverSrc}
        onError={this.showDefaultCover}
        defaultSource={require(DEFAULT_HYMN_COVER_PATH)}
      />
    );
  }
}

const style = StyleSheet.create({
  hymnCoverImage: {
    borderRadius: 500,
    backgroundColor: "transparent",
    margin: 5,
    alignSelf: "center",
  },
});

export default HymnCoverAvatar;

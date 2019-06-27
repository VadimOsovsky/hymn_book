import React from "react"
import { Image, ImageSourcePropType, StyleSheet } from "react-native";

interface Props {
  hymnCoverImage: string,
  size?: number,
}

interface State {
  hymnCoverSrc: ImageSourcePropType | {uri: string}
}

const DEFAULT_HYMN_COVER_PATH = "../assets/images/hymn_default_cover.png";

class HymnCoverAvatar extends React.Component<Props, State> {

  private size = this.props.size || 54;

  constructor(props: Props) {
    super(props);

    this.state = {
      hymnCoverSrc: {uri: this.props.hymnCoverImage} || require(DEFAULT_HYMN_COVER_PATH),
    };
  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
    this.setState({hymnCoverSrc: {uri: nextProps.hymnCoverImage}})
  }

  private showDefaultCover = () => {
    this.setState({hymnCoverSrc: require(DEFAULT_HYMN_COVER_PATH)})
  };

  render() {
    return (
      <Image
        style={[style.hymnCoverImage, {width: this.size, height: this.size}]}
        source={this.state.hymnCoverSrc}
        onError={this.showDefaultCover}
        defaultSource={require(DEFAULT_HYMN_COVER_PATH)}
      />
    )
  }
}

const style = StyleSheet.create({
  hymnCoverImage: {
    borderRadius: 500,
    backgroundColor: 'transparent',
    margin: 5,
    alignSelf: 'center',
  },
});

export default HymnCoverAvatar;

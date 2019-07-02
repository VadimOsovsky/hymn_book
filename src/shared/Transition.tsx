import React from "react";
import { Animated } from 'react-native';

interface Props {
  visible: boolean
  duration?: number
  style?: StyleMedia
  fade?: boolean
  scale?: boolean
}

interface State {
  visible: boolean
  isFadingOut: boolean
}

class Fade extends React.Component<Props, State> {

  private visibility = new Animated.Value(this.props.visible ? 1 : 0);
  private duration: number = this.props.duration || 150;

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: props.visible,
      isFadingOut: false,
    };
  };

  componentWillMount() {
    this.visibility = new Animated.Value(this.props.visible ? 1 : 0);
  }

  componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any): void {
    if (nextProps.visible) {
      this.setState({visible: true});
    } else {
      this.setState({isFadingOut: true})
    }
    Animated.timing(this.visibility, {
      toValue: nextProps.visible ? 1 : 0,
      duration: this.duration,
    }).start(() => {
      this.setState({
        visible: nextProps.visible,
        isFadingOut: false,
      });
    });
  }

  render() {
    const {visible, style, fade, scale, children, ...rest} = this.props;

    const fadeTransition = {
      opacity: this.visibility.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    };

    const scaleTransition = {
      transform: [
        {
          scale: this.visibility.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        },
      ],
    };

    const fadingOutStyle = {
      width: "100%",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
    };
    const combinedStyle = [];

    if (scale) combinedStyle.push(scaleTransition);
    if (fade) combinedStyle.push(fadeTransition);
    if (this.state.visible) combinedStyle.push(style);
    if (this.state.isFadingOut) combinedStyle.push(fadingOutStyle);
    return (
      <Animated.View style={combinedStyle} {...rest}>
        {this.state.visible ? children : null}
      </Animated.View>
    );
  }
}

export default Fade;

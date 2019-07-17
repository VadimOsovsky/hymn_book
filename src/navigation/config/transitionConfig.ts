import { Animated, Easing } from "react-native";
import { NavigationSceneRendererProps } from "react-navigation";

export default function () {
  return {
    transitionSpec: {
      duration: 500,
      easing: Easing.out(Easing.poly(4)),
      timing: Animated.timing,
      useNativeDriver: true,
    },
    screenInterpolator: (sceneProps: NavigationSceneRendererProps) => {
      const {layout, position, scene} = sceneProps;

      const thisSceneIndex = scene.index;
      const width = layout.initWidth;
      const inputRange = [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1];

      const translateX = position.interpolate({
        inputRange,
        outputRange: [width, 0, -100],
      });

      return {
        transform: [{translateX}],
      };
    },
  };
}

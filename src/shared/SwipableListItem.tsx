import React from "react";
import { Animated, PanResponder, PanResponderInstance, StyleSheet, Text, Vibration, View } from "react-native";
import SwipeableListItemAction from "../models/SwipeableListItemAction"
import Icon from "react-native-vector-icons/MaterialIcons";
import { TouchableRipple } from "react-native-paper";

interface Props {
  actions: SwipeableListItemAction[]
  actionWidth?: number
  vibrateOnOpen?: boolean
  vibrationLengthMs?: number
}

interface State {
  itemXPosition: Animated.ValueXY;
}

class SwipeableListItem extends React.Component<Props, State> {

  private panResponder: PanResponderInstance = PanResponder.create({});
  private panXValue = 0;
  private prevGestureStateDx = 0;
  private vibrateOnOpen = true;
  private vibrationLengthMs = this.props.vibrationLengthMs || 40;

  private actions = this.props.actions;
  private actionWidth = this.props.actionWidth || 70;

  constructor(props: Props) {
    super(props);

    this.state = {
      itemXPosition: new Animated.ValueXY()
    }
  }

  componentWillMount() {
    const rightThreshold = this.actionWidth * this.actions.length * -1;

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderMove: (evt, gestureState) => {
        const dxDiff = gestureState.dx - this.prevGestureStateDx;
        this.prevGestureStateDx = gestureState.dx;

        if (this.panXValue + dxDiff < rightThreshold) {
          this.panXValue = rightThreshold;
          if (this.vibrateOnOpen && this.props.vibrateOnOpen) {
            Vibration.vibrate(this.vibrationLengthMs);
            this.vibrateOnOpen = false;
          }
        } else if (this.panXValue + dxDiff > 0) {
          this.panXValue = 0;
          this.vibrateOnOpen = true;
        } else {
          this.panXValue += dxDiff;
        }

        Animated.event([null, {
          dx: this.state.itemXPosition.x,
          dy: this.state.itemXPosition.y
        }])(evt, {dx: this.panXValue, dy: 0});
      },
      onPanResponderRelease: (e, gesture) => {
        let stopValue = 0;
        this.prevGestureStateDx = 0;
        this.vibrateOnOpen = true;
        // to fix in open position
        // @ts-ignore
        if (this.panXValue < rightThreshold + 1) stopValue = rightThreshold;
        // else if (this.state.itemXPosition.x._value > leftThreshold) stopValue = leftThreshold;
        Animated.spring(this.state.itemXPosition, {
          toValue: {x: stopValue, y: 0},
          friction: 30
        }).start();
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const {dx, dy} = gestureState;
        return dx > 2 || dx < -2 || dy > 2 || dy < -2;
      }
    });
  }

  render() {

    const itemStyle = {
      transform: this.state.itemXPosition.getTranslateTransform(),
    };

    return (
      <View>
        <View style={style.actionsHolder}>
          {this.actions.map((action: SwipeableListItemAction, index: number) => {
            console.log("action", action);
            return (
              <TouchableRipple
                key={index}
                style={[style.actionContainer, {backgroundColor: action.backgroundColor, width: this.actionWidth}]}
                onPress={() => {
                }}>
                <View style={style.action}>
                  <Icon name={action.icon} color={action.iconColor} size={21}/>
                  <Text style={[style.actionText, {color: action.iconColor}]}>{action.actionName}</Text>
                </View>
              </TouchableRipple>
            )
          })}
        </View>

        <Animated.View {...this.panResponder.panHandlers} style={itemStyle}>
          {this.props.children}
        </Animated.View>
      </View>
    )
  }
}

const style = StyleSheet.create({
  actionsHolder: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: -5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionContainer: {
    height: '80%',
  },
  action: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 12,
    marginTop: 3,
  }
});

export default SwipeableListItem;

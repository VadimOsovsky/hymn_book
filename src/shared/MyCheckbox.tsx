import React, { PureComponent } from "react";
import { CheckBox, StyleProp, StyleSheet, Text, View } from "react-native";
import { TouchableRipple } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

interface OwnProps {
  value: boolean;
  label: string;
  icon?: string;
  style?: StyleProp<any>;
  textStyle?: StyleProp<any>;
  iconStyle?: StyleProp<any>;
  onCheckboxChange: () => void;
}

type Props = OwnProps;

type State = Readonly<{
  value: boolean,
}>;

class MyCheckbox extends PureComponent<Props, State> {
  public readonly state: State = {
    value: this.props.value,
  };

  public componentWillReceiveProps(nextProps: Readonly<OwnProps>, nextContext: any): void {
    this.setState({value: nextProps.value});
  }

  public render() {
    return (
      <View style={this.props.style}>
        <TouchableRipple style={style.ripple} onPress={this.props.onCheckboxChange}>
          <View style={style.row}>
            <View style={{flexDirection: "row", alignItems: "center"}}>
              {(() => {
                if (this.props.icon) {
                  return <Icon name={this.props.icon} size={24} style={this.props.iconStyle}/>;
                }
              })()}
              <Text style={this.props.textStyle}>{this.props.label}</Text>
            </View>
            <CheckBox onValueChange={this.props.onCheckboxChange} value={this.state.value}/>
          </View>
        </TouchableRipple>
      </View>
    );
  }
}

const style = StyleSheet.create({
  ripple: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default MyCheckbox;

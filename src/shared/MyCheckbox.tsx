import React, { PureComponent } from 'react';
import { TouchableRipple } from "react-native-paper";
import { CheckBox, StyleSheet, Text, View } from "react-native";

interface OwnProps {
  value: boolean
  label: string
  style?: StyleMedia
  textStyle?: StyleMedia
  onCheckboxChange: () => void
}

type Props = OwnProps;

type State = Readonly<{
  value: boolean
}>;

class MyCheckbox extends PureComponent<Props, State> {
  readonly state: State = {
    value: this.props.value
  };

  componentWillReceiveProps(nextProps: Readonly<OwnProps>, nextContext: any): void {
    this.setState({value: nextProps.value})
  }

  render() {
    return (
      <TouchableRipple style={this.props.style} onPress={() => this.props.onCheckboxChange()}>
        <View style={style.row}>
          <Text style={this.props.textStyle}>{this.props.label}</Text>
          <CheckBox onValueChange={() => this.props.onCheckboxChange()} value={this.state.value}/>
        </View>
      </TouchableRipple>
    );
  }
}

const style = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
  },
});

export default MyCheckbox;

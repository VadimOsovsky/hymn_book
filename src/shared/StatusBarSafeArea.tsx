import React from "react";
import {StatusBar, View} from "react-native";
import {lightTheme} from "../styles/appTheme";

export interface Props {
  backgroundColor?: string;
  transparent?: boolean;
}

function StatusBarSafeArea(props: Props) {
  const style = {
    height: StatusBar.currentHeight,
    width: "100%",
    opacity: props.transparent ? 0 : 1,
    backgroundColor: props.backgroundColor || lightTheme.colors.primary || "#FFF",
  };

  return <View style={style}/>;
}

export default StatusBarSafeArea;

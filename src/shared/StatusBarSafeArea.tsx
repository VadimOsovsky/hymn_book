import React from "react"
import {StatusBar, View} from "react-native";
import {lightTheme} from "../styles/appTheme";

interface Props {
  backgroundColor?: string
}

function StatusBarSafeArea(props: Props) {
  const bgc = props.backgroundColor || lightTheme.colors.primary || "#FFF";

  return <View style={{height: StatusBar.currentHeight, width: '100%', backgroundColor: bgc}}/>
}

export default StatusBarSafeArea;

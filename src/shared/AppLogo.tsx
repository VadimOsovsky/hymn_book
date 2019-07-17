import React from "react";
import { Text } from "react-native";

interface Props {
  color?: string;
  size?: number;
}

export default function (props: Props) {
  const style = {
    fontFamily: "Caveat",
    color: props.color || "#FFF",
    fontSize: props.size || 60,
    margin: 20,
  };

  return <Text style={style}>Hymn Book</Text>;
}

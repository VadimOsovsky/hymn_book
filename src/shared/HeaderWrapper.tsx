import React, {ReactChild, ReactChildren} from 'react';
import {Surface} from "react-native-paper";
import { Props as StatusBarSafeAreaProps } from "./StatusBarSafeArea";

interface Props extends StatusBarSafeAreaProps{
  children: ReactChildren | ReactChild
}

export default function (props: Props) {

    return (
      <Surface style={{elevation: 4}}>
        {/*<StatusBarSafeArea/>*/}
        {props.children}
      </Surface>
    );
}


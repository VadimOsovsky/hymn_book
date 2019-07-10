import { ImageSourcePropType } from "react-native";

export default class SwipeableListItemAction {

  actionName: string;
  icon: ImageSourcePropType;
  iconColor: string;
  backgroundColor: string;
  callback: Function;

  constructor(actionName: string, icon: ImageSourcePropType, iconColor: string, backgroundColor: string, callback: Function) {
    this.actionName = actionName;
    this.icon = icon;
    this.iconColor = iconColor;
    this.backgroundColor = backgroundColor;
    this.callback = callback;
  }

}

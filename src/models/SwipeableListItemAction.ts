import { ImageSourcePropType } from "react-native";

export default class SwipeableListItemAction {

  public actionName: string;
  public icon: ImageSourcePropType;
  public iconColor: string;
  public backgroundColor: string;
  public callback: () => void;

  constructor(
    actionName: string,
    icon: ImageSourcePropType,
    iconColor: string,
    backgroundColor: string,
    callback: () => void,
  ) {
    this.actionName = actionName;
    this.icon = icon;
    this.iconColor = iconColor;
    this.backgroundColor = backgroundColor;
    this.callback = callback;
  }

}

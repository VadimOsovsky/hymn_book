export default class SwipeableListItemAction {

  actionName: string;
  icon: string;
  iconColor: string;
  backgroundColor: string;
  callback: Function;

  constructor(actionName: string, icon: string, iconColor: string, backgroundColor: string, callback: Function) {
    this.actionName = actionName;
    this.icon = icon;
    this.iconColor = iconColor;
    this.backgroundColor = backgroundColor;
    this.callback = callback;
  }

}

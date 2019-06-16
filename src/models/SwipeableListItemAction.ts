export default class SwipeableListItemAction {

  actionName: string;
  icon: string;
  iconColor: string;
  backgroundColor: string;

  constructor(actionName: string, icon: string, iconColor: string, backgroundColor: string) {
    this.actionName = actionName;
    this.icon = icon;
    this.iconColor = iconColor;
    this.backgroundColor = backgroundColor;
  }

}

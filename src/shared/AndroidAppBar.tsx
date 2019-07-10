import React, { PureComponent } from 'react';
import { Surface } from "react-native-paper";
import StatusBarSafeArea from "./StatusBarSafeArea";
import { ImageURISource, StyleSheet, ToolbarAndroid } from "react-native";
import { AppState } from "../reducers";
import { connect } from "react-redux";
import icons from "../styles/icons";

export enum navIcons {
  BACK = "BACK",
  MENU = "MENU",
  CLOSE = "CLOSE",
}

export enum showAsAction {
  NEVER = "never",
  ALWAYS = "always",
  IF_ROOM = "ifRoom"
}

export interface AppBarAction {
  title: string
  icon?: ImageURISource
  show: showAsAction
  showWithText?: boolean
  onActionSelected: () => void
}

interface OwnProps {
  title: string
  navIcon?: navIcons
  onNavIconClick?: () => void
  actions: Array<AppBarAction>
  backgroundColor?: string
}

type Props = OwnProps & AppState;

interface State {
  title: string
  backgroundColor: string
}


class AndroidAppBar extends PureComponent<Props, State> {

  readonly state: State = {
    title: this.props.title,
    backgroundColor: this.props.backgroundColor || this.props.prefs!.userPrefs.theme.colors.primary
  };

  componentWillReceiveProps(nextProps: Readonly<OwnProps & AppState>, nextContext: any): void {
    if (nextProps.backgroundColor) {
      this.setState({backgroundColor: nextProps.backgroundColor})
    }
    if (nextProps.title) {
      this.setState({title: nextProps.title})
    }
  }

  private getNavIcon = (): ImageURISource | undefined => {
    switch (this.props.navIcon) {
      case navIcons.BACK:
        return icons.arrow_back;
      case navIcons.MENU:
        return icons.menu;
      case navIcons.CLOSE:
        return icons.close;
      default:
        return;
    }
  };

  private onActionSelected = (position: number) => {
    this.props.actions[position].onActionSelected()
  };

  render() {
    const {actions, prefs, onNavIconClick} = this.props;

    return (
      <Surface style={{elevation: 4}}>
        <StatusBarSafeArea backgroundColor={this.state.backgroundColor}/>
        <ToolbarAndroid
          style={[style.toolbar, {backgroundColor: this.state.backgroundColor}]}
          navIcon={this.getNavIcon()}
          onIconClicked={onNavIconClick}
          overflowIcon={icons.more_vert}
          title={this.state.title}
          titleColor={prefs!.userPrefs.theme.colors.headerText}
          actions={actions}
          onActionSelected={this.onActionSelected}/>
      </Surface>
    );
  }

}

const style = StyleSheet.create({
  toolbar: {
    height: 56,
    alignSelf: 'stretch',
    textAlign: 'center',
  },
});

const mapStateToProps = (state: AppState) => {
  const {prefs} = state;
  return {prefs};
};

export default connect(mapStateToProps)(AndroidAppBar);

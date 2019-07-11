import React from "react";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import i18n from "../../i18n";
import Action from "../../models/Action";
import { AppState } from "../../reducers";
import AndroidAppBar, { navIcons } from "../../shared/AndroidAppBar";
import ThemedView from "../../shared/ThemedView";
import globalStyles from "../../styles/globalStyles";

interface ReduxDispatch {
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = AppState & ReduxDispatch & OwnProps;

interface State {
}

class SavedHymns extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  private renderHeader = () => {
    return (
      <AndroidAppBar
        title={i18n.t("my_groups")}
        navIcon={navIcons.MENU}
        onNavIconClick={this.props.navigation.openDrawer}
        actions={[]}
      />
    );
  }

  public render() {
    return (
      <ThemedView style={globalStyles.screen}>
        {this.renderHeader()}
      </ThemedView>
    );
  }

}

const mapStateToProps = (state: AppState) => {
  const {} = state;
  return {};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    // removeFromSavedHymns: (ids: number[]) => dispatch(removeFromSavedHymns(ids)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedHymns);

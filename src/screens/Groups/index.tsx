import React from "react";
import { StatusBar } from "react-native";
import globalStyles from "../../styles/globalStyles";
import { AppState } from "../../reducers";
import { ThunkDispatch } from "redux-thunk";
import Action from "../../models/Action";
import { connect } from "react-redux";
import { Appbar } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import ThemedView from "../../shared/ThemedView";
import i18n from "../../i18n";

interface ReduxDispatch {
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

type Props = AppState & ReduxDispatch & OwnProps

interface State {
}

class SavedHymns extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {}
  }

  private renderHeader = () => {
    return (
      <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
        <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()}/>
        <Appbar.Content title={i18n.t('my_groups')}/>
      </Appbar.Header>
    )
  };

  render() {
    return (
      <ThemedView style={globalStyles.screen}>
        {this.renderHeader()}
      </ThemedView>
    );
  }

}

const mapStateToProps = (state: AppState) => {
  const {} = state;
  return {}
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    // removeFromSavedHymns: (ids: number[]) => dispatch(removeFromSavedHymns(ids)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedHymns);

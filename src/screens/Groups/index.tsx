import React from "react";
import { StatusBar, View } from "react-native";
import globalStyles from "../../styles/globalStyles";
import { AppState } from "../../reducers";
import { ThunkDispatch } from "redux-thunk";
import Action from "../../models/Action";
import { connect } from "react-redux";
import { Appbar } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";

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
        <Appbar.Content title="My Groups"/>
      </Appbar.Header>
    )
  };

  render() {
    return (
      <View style={globalStyles.screen}>
        {this.renderHeader()}
      </View>
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

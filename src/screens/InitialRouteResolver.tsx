import React from "react";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { screens } from "../navigation/rootStack";
import { AppState } from "../reducers";
import ThemedView from "../shared/ThemedView";
import { fullWH } from "../styles/styleVariables";

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = OwnProps & AppState;

class InitialRouteResolver extends React.Component<Props> {

  public componentWillMount(): void {
    this.bootstrap();
  }

  // Fetch the token from storage then navigate to our appropriate place
  private bootstrap = () => {
    const {tipsToShow, isGuideReady} = this.props.guide!;
    if (isGuideReady) {
      if (!tipsToShow.GUEST_MODE_WARNING) {
        this.props.navigation.navigate(screens.MAIN_APP);
      } else {
        this.props.navigation.navigate(screens.AUTH);
      }
    }
  }

  // Render any loading content that you like here
  public render() {
    return (
      <ThemedView style={{...fullWH}}/>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  const {guide} = state;
  return {guide};
};

export default connect(mapStateToProps)(InitialRouteResolver);

import React, { PureComponent } from "react";
import { Image } from "react-native";
import { Banner } from "react-native-paper";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { setTipToNeverBeShownAgain } from "../actions/guideActions";
import i18n from "../i18n";
import Action from "../models/Action";
import { GuideTips } from "../models/GuideTips";
import { AppState } from "../reducers";

interface OwnProps {
  tipType: GuideTips;
}

interface ReduxDispatch {
  setTip: (tip: GuideTips) => void;
}

type Props = OwnProps & AppState & ReduxDispatch;

type State = Readonly<{}>;

class GuideBanner extends PureComponent<Props, State> {
  public readonly state: State = {};

  public render() {
    const {tipType, guide, setTip} = this.props;
    return (
      <Banner
        visible={guide!.isGuideReady && guide!.tipsToShow[tipType]}
        actions={[
          {label: i18n.t("btn_got_it"), onPress: () => setTip(tipType)},
        ]}
        image={({size}) =>
          <Image
            source={require("../assets/images/app_logo.png")}
            style={{width: size - 5, height: size}}
          />
        }
      >
        {i18n.t("wizard_" + tipType)}
      </Banner>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  const {guide} = state;
  return {guide};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    setTip: (tip: GuideTips) => dispatch(setTipToNeverBeShownAgain(tip)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(GuideBanner);

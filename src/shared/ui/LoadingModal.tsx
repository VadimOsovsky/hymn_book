import React, { PureComponent } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { Dialog, Paragraph, Portal } from "react-native-paper";
import i18n from "../../i18n";
import dialogStyles from "../../styles/dialogStyles";

interface OwnProps {
  visible: boolean;
  text?: string;
}

type Props = OwnProps;

interface State {
  visible: boolean;
  text: string;
}

class LoadingModal extends PureComponent<Props, State> {
  public readonly state: State = {
    visible: this.props.visible,
    text: this.props.text || i18n.t("loader_default_text"),
  };

  public componentWillReceiveProps(nextProps: Readonly<OwnProps>, nextContext: any): void {
    if (nextProps.visible) {
      this.setState({visible: nextProps.visible});
    }
    if (nextProps.text) {
      this.setState({text: nextProps.text});
    }
  }

  public render() {
    const { visible, text } = this.state;
    return (
      <Portal>
        <Dialog
          visible={visible}
          dismissable={false}>
          <Dialog.Content style={style.container}>
            <ActivityIndicator size="large" style={style.loader}/>
            <Paragraph style={dialogStyles.description}>{text}</Paragraph>
          </Dialog.Content>
        </Dialog>
      </Portal>
    );
  }
}

const style = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  loader: {
    marginEnd: 20,
  },
});

export default LoadingModal;

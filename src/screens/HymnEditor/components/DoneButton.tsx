import React, { PureComponent } from "react";
import { Dialog } from "react-native-dialog";
import { Portal } from "react-native-paper";

interface OwnProps {}

type Props = OwnProps;

type State = Readonly<{

}>;

class DoneModal extends PureComponent<Props, State> {
  public readonly state: State = {

  };

  public render() {
    return (
      <Portal>
        <Dialog.Container>
          <Dialog.Title>Account delete</Dialog.Title>
          <Dialog.Description>
            Do you want to delete this account? You cannot undo this action.
          </Dialog.Description>
          <Dialog.Button label="Cancel" />
          <Dialog.Button label="Delete" />
        </Dialog.Container>
      </Portal>
    );
  }
}

export default DoneModal;

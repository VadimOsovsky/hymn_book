import React from "react";
import { StyleSheet, View } from "react-native";
import ImagePicker from "react-native-image-picker";
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper";
import i18n from "../../../i18n";
import HymnCoverAvatar from "../../../shared/HymnCoverAvatar";
import globalStyles from "../../../styles/globalStyles";

interface Props {
  hymnCoverUri?: string;
  getNewHymnCoverUri: (hymnCoverUri: string) => void;
}

interface State {
  isDialogShown: boolean;
  imageSrc: string;
  hymnCoverImageUrlInput: string;
}

class ImagePickerModal extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      isDialogShown: false,
      imageSrc: "",
      hymnCoverImageUrlInput: "",
    };
  }

  private initHymnCoverFromProps = () => {
    const {hymnCoverUri} = this.props;
    if (hymnCoverUri && hymnCoverUri.startsWith("content://")) {
      this.setState({imageSrc: hymnCoverUri});
    } else if (hymnCoverUri && hymnCoverUri.startsWith("http")) {
      this.setState({hymnCoverImageUrlInput: hymnCoverUri});
    }
  }

  private showImagePicker = () => {
    this.hideDialog();

    const options = {
      title: i18n.t("select_hymn_image"),
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = response.uri;
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          imageSrc: source,
          hymnCoverImageUrlInput: "",
        }, this.showDialog);
      }
    });
  }

  private onImageSelectDone = () => {
    const {imageSrc, hymnCoverImageUrlInput} = this.state;
    this.props.getNewHymnCoverUri(imageSrc || hymnCoverImageUrlInput);
    this.hideDialog();
  }

  private cancelSelection = () => {
    this.setState({
      imageSrc: "",
      hymnCoverImageUrlInput: "",
    });
  }

  private showDialog = () => {
    this.initHymnCoverFromProps();
    this.setState({isDialogShown: true});
  }

  private hideDialog = () => {
    this.setState({isDialogShown: false});
    // to compensate closing transition time
    setTimeout(this.cancelSelection, 300);
  }

  private renderDialogContent = () => {
    const {imageSrc, hymnCoverImageUrlInput} = this.state;

    if (imageSrc) {
      return (
        <Dialog.Content style={style.dialogContent}>
          <HymnCoverAvatar hymnCoverImage={imageSrc} size={120}/>
          <Text style={style.or}>{i18n.t("or")}</Text>
          <Text style={[globalStyles.pressableText, globalStyles.textCenter]} onPress={this.cancelSelection}>
            {i18n.t("select_another_image")}
          </Text>
        </Dialog.Content>
      );
    } else if (hymnCoverImageUrlInput) {
      return (
        <Dialog.Content style={style.dialogContent}>
          <HymnCoverAvatar hymnCoverImage={hymnCoverImageUrlInput} size={120}/>
          <Text style={style.or}/>
          <TextInput
            label={i18n.t("hymn_cover_url")}
            style={style.input}
            value={this.state.hymnCoverImageUrlInput}
            onChangeText={(val: string) => this.setState({hymnCoverImageUrlInput: val})}/>
        </Dialog.Content>
      );
    } else {
      return (
        <Dialog.Content>
          <Text style={[globalStyles.pressableText, globalStyles.textCenter]} onPress={this.showImagePicker}>
            {i18n.t("select_image")}
          </Text>
          <Text style={style.or}>{i18n.t("or")}</Text>
          <TextInput
            label={i18n.t("hymn_cover_url")}
            style={style.input}
            value={this.state.hymnCoverImageUrlInput}
            onChangeText={(val: string) => this.setState({hymnCoverImageUrlInput: val})}/>
        </Dialog.Content>
      );
    }
  }

  public render() {
    return (
      <View style={style.container}>
        <Text style={[globalStyles.pressableText, globalStyles.textCenter]}
              onPress={this.showDialog}>{i18n.t("edit_hymn_image")}
        </Text>
        <Portal>
          <Dialog
            visible={this.state.isDialogShown}
            onDismiss={this.hideDialog}>
            <Dialog.Title>{i18n.t("set_hymn_image")}</Dialog.Title>

            {this.renderDialogContent()}

            <Dialog.Actions>
              <Button onPress={this.hideDialog}>{i18n.t("btn_cancel")}</Button>
              <Button onPress={this.onImageSelectDone}>{i18n.t("btn_done")}</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    );
  }
}

const style = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  dialogContent: {
    alignItems: "center",
    width: "100%",
  },
  input: {
    width: "100%",
  },
  or: {
    margin: 10,
    textAlign: "center",
    fontSize: 16,
  },
});

export default ImagePickerModal;

import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, Dialog, Portal, TextInput, Avatar } from "react-native-paper"
import ImagePicker from 'react-native-image-picker';

interface Props {
  hymnCoverUri?: string
}

interface State {
  isDialogShown: boolean,
  imageSrc: { uri: string },
  hymnCoverImageUrlInput: string,
}

class ImagePickerModal extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      isDialogShown: false,
      imageSrc: {uri: ""},
      hymnCoverImageUrlInput: ""
    }
  }

  componentWillMount(): void {
    const { hymnCoverUri } = this.props;
    if (hymnCoverUri && hymnCoverUri.startsWith("content://")) {
      this.setState({imageSrc: {uri: hymnCoverUri}})
    } else if (hymnCoverUri && hymnCoverUri.startsWith("http")) {
      this.setState({hymnCoverImageUrlInput: hymnCoverUri})
    }
  }

  private showImagePicker = () => {
    this.hideDialog();

    const options = {
      title: 'Select hymn cover image',
      // customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          imageSrc: source,
          hymnCoverImageUrlInput: "",
        }, this.showDialog);
      }
    });
  };

  private onImageSelectDone = () => {
    this.hideDialog();
  };

  private cancelSelection = () => {
    this.setState({
      imageSrc: {uri: ""},
      hymnCoverImageUrlInput: "",
    })
  };

  private showDialog = () => this.setState({isDialogShown: true});
  private hideDialog = () => this.setState({isDialogShown: false});

  private renderDialogContent = () => {
    const {imageSrc, hymnCoverImageUrlInput} = this.state;

    if (imageSrc.uri) {
      return (
        <Dialog.Content style={style.dialogContent}>
          <Avatar.Image size={120} source={imageSrc} />
          <Text style={style.or}>or</Text>
          <Button onPress={this.cancelSelection}>Select another image</Button>
        </Dialog.Content>
      )
    } else if (hymnCoverImageUrlInput) {
      return (
        <Dialog.Content style={style.dialogContent}>
          <Avatar.Image size={120} source={{uri: hymnCoverImageUrlInput}} />
          <Text style={style.or} />
          <TextInput
            label="Hymn cover URL"
            style={style.input}
            value={this.state.hymnCoverImageUrlInput}
            onChangeText={(val: string) => this.setState({hymnCoverImageUrlInput: val})}/>
        </Dialog.Content>
      )
    } else {
      return (
        <Dialog.Content>
          <Button onPress={this.showImagePicker}>Select image</Button>
          <Text style={style.or}>or</Text>
          <TextInput
            label="Hymn cover URL"
            style={style.input}
            value={this.state.hymnCoverImageUrlInput}
            onChangeText={(val: string) => this.setState({hymnCoverImageUrlInput: val})}/>
        </Dialog.Content>
      )
    }
  };

  render() {
    const {imageSrc, hymnCoverImageUrlInput} = this.state;

    return (
      <View>
        <Button onPress={this.showDialog}>Add cover image</Button>
        <Portal>
          <Dialog
            visible={this.state.isDialogShown}
            onDismiss={this.hideDialog}>
            <Dialog.Title>Set hymn cover</Dialog.Title>

            {this.renderDialogContent()}

            <Dialog.Actions>
              <Button onPress={this.hideDialog}>Cancel</Button>
              <Button onPress={this.onImageSelectDone} disabled={!imageSrc.uri && !hymnCoverImageUrlInput}>Done</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    )
  }
}

const style = StyleSheet.create({
  dialogContent: {
    alignItems: "center",
    width: "100%"
  },
  input: {
    width: "100%"
  },
  or: {
    margin: 10,
    textAlign: "center",
    fontSize: 16,
  }
});

export default ImagePickerModal

import React from 'react';
import { FAB } from 'react-native-paper';
import { NavigationParams } from "react-navigation";
import { StyleSheet, ToastAndroid } from "react-native";

interface Props {
  navigation: NavigationParams
}

interface State {
  isOpen: boolean
}

export default class SavedHymnsFAB extends React.Component<Props, State> {
  state = {
    isOpen: false,
  };

  render() {
    return (
      <FAB.Group
        open={this.state.isOpen}
        style={style}
        icon={this.state.isOpen ? 'close' : 'add'}
        actions={[
          {
            icon: 'playlist-add',
            label: 'Add manually',
            onPress: () => this.props.navigation.navigate("HymnEditor", {hymnToEdit: null})
          },
          {icon: 'cloud-upload', label: 'Import file', onPress: () => ToastAndroid.show('Import WIP', ToastAndroid.SHORT)},
        ]}
        onStateChange={({open: isOpen}) => this.setState({isOpen})}
      />
    )
    // return (
    //   <FAB
    //     icon={this.state.isOpen ? 'close' : 'add'}
    //     style={style.fab}
    //     onPress={() => this.props.navigation.navigate("HymnEditor", {hymnToEdit: null})}
    //   />
    // )
  }
}

const style = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

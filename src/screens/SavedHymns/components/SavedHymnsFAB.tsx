import React from 'react';
import { FAB } from 'react-native-paper';
import { NavigationParams } from "react-navigation";

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
        icon={this.state.isOpen ? 'close' : 'add'}
        actions={[
          {
            icon: 'playlist-add',
            label: 'Add manually',
            onPress: () => this.props.navigation.navigate("HymnEditor", {hymnToEdit: null})
          },
          {icon: 'cloud-upload', label: 'Import file', onPress: () => console.log('Import')},
        ]}
        onStateChange={({open: isOpen}) => this.setState({isOpen})}
      />
    )
  }
}

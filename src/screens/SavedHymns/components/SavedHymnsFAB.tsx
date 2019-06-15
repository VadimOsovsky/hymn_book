import React from 'react';
import { FAB } from 'react-native-paper';

export default class SavedHymnsFAB extends React.Component {
  state = {
    isOpen: false,
  };

  render() {
    return (
      <FAB.Group
        open={this.state.isOpen}
        icon={this.state.isOpen ? 'close' : 'add'}
        actions={[
          {icon: 'playlist-add', label: 'Add manually', onPress: () => console.log('manually')},
          {icon: 'cloud-upload', label: 'Import file', onPress: () => console.log('Import')},
        ]}
        onStateChange={({open: isOpen}) => this.setState({isOpen})}
      />
    )
  }
}

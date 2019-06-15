import React from "react";
import { View, StyleSheet } from "react-native";
import { List } from "react-native-paper"

interface Props {

}

class BottomSheetContent extends React.Component<Props> {

  constructor(props: Props) {
    super(props)
  }

  render() {
    return (
      <View>
        <List.Section>
          <List.Subheader>Settings</List.Subheader>
          <List.Item
            title="Edit"
            style={style.menuItem}
            left={props => <List.Icon {...props} icon="edit"/>}
            onPress={() => {}}
          />
          <List.Item
            title="Remove from saved"
            style={style.menuItem}
            left={props => <List.Icon {...props} icon="delete"/>}
            onPress={() => {}}
          />
        </List.Section>
      </View>
    )
  }
}

const style = StyleSheet.create({
  menuItem: {
    padding: 0,
    maxHeight: 60
  }
});

export default BottomSheetContent

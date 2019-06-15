import React from "react";
import { Text, View } from "react-native"
import { Appbar } from "react-native-paper";
import globalStyles from "../../styles/globalStyles";

interface Props {

}

class HymnView extends React.Component<Props> {

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  // @ts-ignore
  static navigationOptions = ({navigation}) => {
    return {
      header: (
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()}/>
          <Appbar.Content
            title="Hymn Title"
          />
        </Appbar.Header>
      )
    }
  };

  render() {
    return (
      <View style={globalStyles.screen}>
        <Text>affsd</Text>
      </View>
    );
  }
}

export default HymnView

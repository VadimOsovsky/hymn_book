import React from "react";
import {Text, View, ScrollView} from "react-native"
import {Appbar} from "react-native-paper";
import {NavigationParams} from "react-navigation";
import globalStyles from "../../styles/globalStyles";
import HymnItem from "../../models/HymnItem";
import style from "./style";

interface Props {
  // default
  navigation: NavigationParams
}

class HymnView extends React.Component<Props> {

  hymnToView: HymnItem = this.props.navigation.getParam('hymnToView');

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  static navigationOptions = {
    header: null
  };

  render() {
    return (
      <View style={globalStyles.screen}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()}/>
          <Appbar.Content
            title={this.hymnToView.title}
          />
        </Appbar.Header>

        <ScrollView>
          <View style={style.lyricsView}>
            <Text style={style.lyricsText}>{this.hymnToView.lyrics}</Text>
          </View>
        </ScrollView>

      </View>
    );
  }
}

export default HymnView

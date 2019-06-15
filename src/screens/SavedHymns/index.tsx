import React from "react";
import { FlatList, View } from "react-native"
import RBSheet from "react-native-raw-bottom-sheet";
import { Appbar, Avatar, List } from "react-native-paper"
import SavedHymnsFAB from "./components/SavedHymnsFAB";
import { connect } from "react-redux";
import { hymnsInterface } from "../../reducers/hymnsReducer";
import HymnItem from "../../models/HymnItem";
import style from "./style";
import { NavigationParams } from "react-navigation";
import globalStyles from "../../styles/globalStyles";
import BottomSheetContent from "./components/BottomSheetContent";

interface Props {
  // from redux
  hymns: hymnsInterface

  // default
  navigation: NavigationParams
}

class SavedHymns extends React.Component<Props> {

  static navigationOptions = {
    header: (
      <Appbar.Header>
        <Appbar.Action icon="menu" onPress={() => {
        }}/>
        <Appbar.Content
          title="My Saved Hymns"
        />
        <Appbar.Action icon="search" onPress={() => {
        }}/>
      </Appbar.Header>
    )
  };
  // lateinit var
  RBSheet: RBSheet | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {}
  }

  componentDidMount(): void {
    console.log("this.props", this.props);
  }

  buildSavedHymn(item: HymnItem) {
    return (
      <List.Item title={item.title}
                 description={item.formatLyricsForPreview(item.lyrics)}
                 left={() => this.buildAuthorAvatar(item.authorImage)}
                 onPress={() => this.props.navigation.navigate('HymnView')}
                 onLongPress={() => this.RBSheet && this.RBSheet.open()}/>
    )
  }

  buildAuthorAvatar(avatarSrc: string) {
    const authorImage = avatarSrc ? {uri: avatarSrc} : require("../../assets/images/author_placeholder.png");
    return <Avatar.Image style={style.authorAvatar} size={54} source={authorImage}/>;
  }

  render() {
    return (
      <View style={globalStyles.screen}>
        <FlatList
          data={this.props.hymns.savedHymns}
          keyExtractor={(item => item.hymnId)}
          renderItem={({item}) => this.buildSavedHymn(item)}
        />
        <SavedHymnsFAB/>
        <RBSheet
          ref={(ref: RBSheet) => {
            this.RBSheet = ref;
          }}
          height={200}
          closeOnDragDown
          duration={150}
        >
          <BottomSheetContent/>
        </RBSheet>
      </View>
    );
  }

}

// @ts-ignore
const mapStateToProps = (state) => {
  const {hymns} = state;
  return {hymns}
};

export default connect(mapStateToProps)(SavedHymns);

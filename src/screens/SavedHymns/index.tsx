import React from "react";
import { FlatList, View } from "react-native"
import RBSheet from "react-native-raw-bottom-sheet";
import { Appbar, Searchbar } from "react-native-paper"
import SavedHymnsFAB from "./components/SavedHymnsFAB";
import { connect } from "react-redux";
import { hymnsInterface } from "../../reducers/hymnsReducer";
import { NavigationParams } from "react-navigation";
import globalStyles from "../../styles/globalStyles";
import BottomSheetContent from "./components/BottomSheetContent";
import SavedHymnElement from "./components/SavedHymnElement";

interface Props {
  // from redux
  hymns: hymnsInterface

  // default
  navigation: NavigationParams
}

interface State {
  isSearchMode: boolean,
  searchQuery: string,
}

class SavedHymns extends React.Component<Props, State> {
  static navigationOptions = {
    header: null
  };
  private RBSheetRef: RBSheet | null = null;
  private SearchbarRef: Searchbar | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      isSearchMode: false,
      searchQuery: "",
    }
  }

  render() {
    return (
      <View style={globalStyles.screen}>
        {this.renderHeader()}
        <FlatList
          data={this.props.hymns.savedHymns}
          keyExtractor={(item => item.hymnId)}
          renderItem={({item}) => <SavedHymnElement navigation={this.props.navigation} savedHymn={item}/>}
        />
        <SavedHymnsFAB/>
        <RBSheet
          ref={(ref: RBSheet) => {
            this.RBSheetRef = ref;
          }}
          height={300}
          closeOnDragDown
          duration={150}
        >
          <BottomSheetContent/>
        </RBSheet>
      </View>
    );
  }

  private openSearch = () => {
    this.setState({isSearchMode: true}, () => {
      this.SearchbarRef && this.SearchbarRef.focus();
    });
  };

  private closeSearch = () => this.setState({isSearchMode: false});

  private renderHeader() {
    if (this.state.isSearchMode) {
      return (
        <Appbar.Header>
          <Searchbar
            icon="arrow-back"
            placeholder="Search"
            ref={(ref: Searchbar) => this.SearchbarRef = ref}
            onIconPress={this.closeSearch}
            onChangeText={query => this.setState({searchQuery: query})}
            value={this.state.searchQuery}
          />
        </Appbar.Header>
      )
    } else {
      return (
        <Appbar.Header>
          <Appbar.Action icon="menu" onPress={() => {
          }}/>
          <Appbar.Content
            title="My Saved Hymns"
          />
          <Appbar.Action icon="search" onPress={this.openSearch}/>
        </Appbar.Header>
      )
    }
  }

}

// @ts-ignore
const mapStateToProps = (state) => {
  const {hymns} = state;
  return {hymns}
};

export default connect(mapStateToProps)(SavedHymns);

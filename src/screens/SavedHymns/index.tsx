import React from "react";
import { FlatList, StatusBar, View } from "react-native"
import { Appbar, Searchbar } from "react-native-paper"
import SavedHymnsFAB from "./components/SavedHymnsFAB";
import { connect } from "react-redux";
import { hymnsInterface } from "../../reducers/hymnsReducer";
import { NavigationParams } from "react-navigation";
import globalStyles from "../../styles/globalStyles";
import SavedHymnElement from "./components/SavedHymnElement";
import HeaderWrapper from "../../shared/HeaderWrapper";

interface Props {
  // from redux
  hymns: hymnsInterface

  navigation: NavigationParams
}

interface State {
  isSearchMode: boolean,
  searchQuery: string,
}

class SavedHymns extends React.Component<Props, State> {

  static navigationOptions = {
    header: null,
  };

  private SearchbarRef: Searchbar | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      isSearchMode: false,
      searchQuery: "",
    }
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
        <HeaderWrapper>
          <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
            <Searchbar
              icon="arrow-back"
              placeholder="Search"
              ref={(ref: Searchbar) => this.SearchbarRef = ref}
              onIconPress={this.closeSearch}
              onChangeText={query => this.setState({searchQuery: query})}
              value={this.state.searchQuery}
            />
          </Appbar.Header>
        </HeaderWrapper>
      )
    } else {
      return (
        <HeaderWrapper>
          <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
            <Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()}/>
            <Appbar.Content
              title="My Saved Hymns"
            />
            <Appbar.Action icon="search" onPress={this.openSearch}/>
          </Appbar.Header>
        </HeaderWrapper>
      )
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
        <SavedHymnsFAB navigation={this.props.navigation}/>
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

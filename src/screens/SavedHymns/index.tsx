import React from "react";
import { ActivityIndicator, Alert, FlatList, StatusBar, Text, View } from "react-native"
import { Appbar, Searchbar } from "react-native-paper"
import SavedHymnsFAB from "./components/SavedHymnsFAB";
import { connect } from "react-redux";
import { HymnsInterface } from "../../reducers/hymnsReducer";
import { NavigationParams } from "react-navigation";
import globalStyles from "../../styles/globalStyles";
import SavedHymnElement from "./components/SavedHymnElement";
import HeaderWrapper from "../../shared/HeaderWrapper";
import style from "./style";
import HymnItem from "../../models/HymnItem";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../reducers";
import Action from "../../models/Action";
import { removeFromSavedHymns } from "../../actions/hymnActions";
import { lightTheme } from "../../styles/appTheme";

interface ReduxState {
  hymns: HymnsInterface
}

interface ReduxDispatch {
  removeFromSavedHymns: (hymnIds: number[]) => void
}

interface OwnProps {
  navigation: NavigationParams
}

type Props = ReduxState & ReduxDispatch & OwnProps

interface State {
  isSearchMode: boolean,
  searchQuery: string,
  selectedHymns: number[], // hymn ids array
}

class SavedHymns extends React.Component<Props, State> {

  private SearchbarRef: Searchbar | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      isSearchMode: false,
      searchQuery: "",
      selectedHymns: [],
    }
  }

  private openSearch = () => {
    this.setState({isSearchMode: true}, () => {
      this.SearchbarRef && this.SearchbarRef.focus();
    });
  };

  private closeSearch = () => this.setState({isSearchMode: false});

  private filterSavedHymns = () => {
    if (this.state.searchQuery) {
      return this.props.hymns.savedHymns.filter((hymn: HymnItem) => {
        return hymn.title.toLowerCase().includes(this.state.searchQuery.toLowerCase())
      })
    } else {
      return this.props.hymns.savedHymns
    }
  };

  private onHymnPress = (hymn: HymnItem) => {
    const {selectedHymns} = this.state;

    if (selectedHymns.length) {
      const newSelectedHymnsArray = [...selectedHymns];
      if (selectedHymns.includes(hymn.hymnId)) {
        newSelectedHymnsArray.splice(selectedHymns.indexOf(hymn.hymnId), 1)
      } else {
        newSelectedHymnsArray.push(hymn.hymnId);
      }

      this.setState({selectedHymns: newSelectedHymnsArray})
    } else {
      this.props.navigation.navigate('HymnView', {hymnToView: hymn})
    }
  };

  private onHymnLongPress = (hymnId: number) => {
    this.setState({selectedHymns: [...this.state.selectedHymns, hymnId]})
  };

  private onDeleteSelectedHymns = () => {
    const {selectedHymns} = this.state;
    const hymnsNumber = selectedHymns.length === 1 ? `this song` : `these ${selectedHymns.length} songs`;

    Alert.alert(
      "Delete Hymns",
      `Are you sure you want to delete ${hymnsNumber} from Saved Hymns?`,
      [
        {text: "Cancel"},
        {
          text: "Delete", onPress: () => {
            this.props.removeFromSavedHymns(this.state.selectedHymns);
            this.setState({selectedHymns: []});
          }
        }
      ]
    );
  };

  private renderHeader() {
    if (this.state.isSearchMode) {
      return (
        <HeaderWrapper>
          <Appbar.Header statusBarHeight={StatusBar.currentHeight} style={{backgroundColor: lightTheme.colors.surface}}>
            <Searchbar
              icon="arrow-back"
              placeholder="Search"
              style={{elevation: 0}}
              ref={(ref: Searchbar) => this.SearchbarRef = ref}
              onIconPress={this.closeSearch}
              onChangeText={query => this.setState({searchQuery: query})}
              value={this.state.searchQuery}
            />
          </Appbar.Header>
        </HeaderWrapper>
      )
    } else if (this.state.selectedHymns.length) {
      return (
        <HeaderWrapper>
          <Appbar.Header statusBarHeight={StatusBar.currentHeight} style={{backgroundColor: lightTheme.colors.primaryDark}}>
            <Appbar.BackAction onPress={() => this.setState({
              selectedHymns: []
            })}/>
            <Appbar.Content title={"Selected: " + this.state.selectedHymns.length}/>
            <Appbar.Action icon="delete" onPress={this.onDeleteSelectedHymns}/>
          </Appbar.Header>
        </HeaderWrapper>
      )
    } else {
      return (
        <HeaderWrapper>
          <Appbar.Header statusBarHeight={StatusBar.currentHeight}>
            {/*<Appbar.Action icon="menu" onPress={() => this.props.navigation.openDrawer()}/>*/}
            <Appbar.Content title="My Saved Hymns"/>
            <Appbar.Action icon="search" onPress={this.openSearch}/>
          </Appbar.Header>
        </HeaderWrapper>
      )
    }
  }

  private renderSearchQuery = () => {
    return (
      <Text style={[style.searchQuery, {display: this.state.searchQuery ? "flex" : "none"}]}>
        Results found for: {this.state.searchQuery}
      </Text>
    )
  };

  private renderSavedHymns = () => {
    if (this.props.hymns.isSavedHymnsLoading) {
      return (
        <ActivityIndicator size="large" style={style.noHymns}/>
      )
    } else if (!this.filterSavedHymns().length) {
      return (
        <Text style={style.noHymns}>Empty here</Text>
      )
    } else {
      return (
        <FlatList
          data={this.filterSavedHymns()}
          keyExtractor={(item => String(item.hymnId))}
          extraData={this.state.selectedHymns}
          renderItem={({item}) => {
            return (
              <SavedHymnElement
                navigation={this.props.navigation}
                isHymnSelected={this.state.selectedHymns.includes(item.hymnId)}
                isSwipingDisabled={this.state.selectedHymns.length > 0}
                onPress={this.onHymnPress}
                onLongPress={this.onHymnLongPress}
                savedHymn={item}/>
            )
          }}
        />
      )
    }
  };

  private renderFAB = () => {
    if (!this.props.hymns.isSavedHymnsLoading && !this.state.selectedHymns.length) {
      return <SavedHymnsFAB navigation={this.props.navigation}/>
    }
  };

  render() {
    return (
      <View style={globalStyles.screen}>
        {this.renderHeader()}
        {this.renderSearchQuery()}
        {this.renderSavedHymns()}
        {this.renderFAB()}
      </View>
    );
  }

}

const mapStateToProps = (state: AppState) => {
  const {hymns} = state;
  return {hymns}
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    removeFromSavedHymns: (ids: number[]) => dispatch(removeFromSavedHymns(ids)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedHymns);

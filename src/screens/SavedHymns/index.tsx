import React from "react";
import { ActivityIndicator, Alert, FlatList, StatusBar } from "react-native"
import { Appbar, Searchbar, Surface, Text } from "react-native-paper"
import SavedHymnsFAB from "./components/SavedHymnsFAB";
import { connect } from "react-redux";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import globalStyles from "../../styles/globalStyles";
import SavedHymnElement from "./components/SavedHymnElement";
import style from "./style";
import HymnItem from "../../models/HymnItem";
import { ThunkDispatch } from "redux-thunk";
import { AppState } from "../../reducers";
import Action from "../../models/Action";
import { removeFromSavedHymns } from "../../actions/hymnActions";
import Transition from "../../shared/Transition";
import ThemedView from "../../shared/ThemedView";
import i18n from "../../i18n";
import { screens } from "../../navigation/savedHymnsStack";
import AndroidAppBar, { AppBarAction, navIcons, showAsAction } from "../../shared/AndroidAppBar";
import icons from "../../styles/icons";

interface ReduxDispatch {
  removeFromSavedHymns: (hymnIds: number[]) => void
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>
}

type Props = AppState & ReduxDispatch & OwnProps

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

  private getFilteredSavedHymns = () => {
    if (this.state.searchQuery) {
      return this.props.hymns!.savedHymns.filter((hymn: HymnItem) => {
        return hymn.title.toLowerCase().includes(this.state.searchQuery.toLowerCase())
      })
    } else {
      return this.props.hymns!.savedHymns
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
      this.props.navigation.navigate(screens.HYMN_VIEW, {hymnToView: hymn})
    }
  };

  private onHymnLongPress = (hymnId: number) => {
    if (!this.state.isSearchMode) {
      this.setState({selectedHymns: [...this.state.selectedHymns, hymnId]})
    }
  };

  private onDeleteSelectedHymns = () => {
    Alert.alert(
      i18n.t('delete_selected_title'),
      i18n.t('delete_selected_message', {count: this.state.selectedHymns.length}),
      [
        {text: i18n.t('btn_cancel')},
        {
          text: i18n.t('btn_delete'), onPress: () => {
            this.props.removeFromSavedHymns(this.state.selectedHymns);
            this.setState({selectedHymns: []});
          }
        }
      ]
    );
  };

  private onSelectAll = () => {
    const savedHymns = this.getFilteredSavedHymns();
    const allSelectedHymns: number[] = [];

    savedHymns.forEach((hymn: HymnItem) => allSelectedHymns.push(hymn.hymnId));

    this.setState({selectedHymns: allSelectedHymns})
  };

  private getSelectModeAppBarActions = (): AppBarAction[] => {
    const action: AppBarAction[] = [];

    action.push({
      title: i18n.t('delete_from_saved'),
      icon: icons.delete,
      show: showAsAction.IF_ROOM,
      onActionSelected: this.onDeleteSelectedHymns,
    });

    action.push({
      title: i18n.t('select_all'),
      icon: icons.select_all,
      show: showAsAction.IF_ROOM,
      onActionSelected: this.onSelectAll,
    });

    return action;
  };

  private getMainAppBarActions = (): AppBarAction[] => {
    const action: AppBarAction[] = [];

    action.push({
      title: i18n.t('search'),
      icon: icons.search,
      show: showAsAction.ALWAYS,
      onActionSelected: this.openSearch,
    });

    return action;
  };

  private renderHeader = () => {
    const { surface, primaryDark } = this.props.prefs!.userPrefs.theme.colors;
    const hymnsLength = this.state.selectedHymns.length;
    return (
      <ThemedView style={{zIndex: 9}}>
        {/*SEARCH*/}
        <Transition visible={this.state.isSearchMode} fade swappingHeader>
          <Surface style={{elevation: 4}}>
            <Appbar.Header statusBarHeight={StatusBar.currentHeight}
                           style={{backgroundColor: surface}}>
              <Searchbar
                icon="arrow-back"
                placeholder={i18n.t('search')}
                style={{elevation: 0, backgroundColor: "transparent"}}
                ref={(ref: Searchbar) => this.SearchbarRef = ref}
                onIconPress={this.closeSearch}
                onChangeText={query => this.setState({searchQuery: query})}
                value={this.state.searchQuery}
              />
            </Appbar.Header>
          </Surface>
        </Transition>

        {/*SELECTION*/}
        <Transition visible={!!hymnsLength} fade swappingHeader>

          <AndroidAppBar
            title={i18n.t("hymns_selected", {selectedNumber: hymnsLength})}
            navIcon={navIcons.CLOSE}
            onNavIconClick={() => this.setState({selectedHymns: []})}
            actions={this.getSelectModeAppBarActions()}
            backgroundColor={primaryDark}
          />
        </Transition>

        {/*MAIN*/}
        <Transition visible={!hymnsLength && !this.state.isSearchMode} fade swappingHeader>
          <AndroidAppBar
            title={i18n.t('my_saved_hymns')}
            navIcon={navIcons.MENU}
            onNavIconClick={this.props.navigation.openDrawer}
            actions={this.getMainAppBarActions()}
          />
        </Transition>
      </ThemedView>
    )
  };

  private renderSearchQuery = () => {
    const query = this.state.searchQuery;
    return (
      <Text style={[style.searchQuery, {display: query ? "flex" : "none"}]}>{i18n.t('search_results', {query})}</Text>
    )
  };

  private renderSavedHymns = () => {
    if (this.props.hymns!.isSavedHymnsLoading) {
      return (
        <ActivityIndicator size="large" style={style.noHymns}/>
      )
    } else if (!this.getFilteredSavedHymns().length) {
      return (
        <Text style={style.noHymns}>{i18n.t('no_hymns')}</Text>
      )
    } else {
      return (
        <FlatList
          data={this.getFilteredSavedHymns()}
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
    if (!this.props.hymns!.isSavedHymnsLoading && !this.state.selectedHymns.length && !this.state.isSearchMode) {
      return <SavedHymnsFAB navigation={this.props.navigation}/>
    }
  };

  render() {
    return (
      <ThemedView style={globalStyles.screen}>
        {this.renderHeader()}
        {this.renderSearchQuery()}
        {this.renderSavedHymns()}
        {this.renderFAB()}
      </ThemedView>
    );
  }

}

const mapStateToProps = (state: AppState) => {
  const {hymns, prefs} = state;
  return {hymns, prefs}
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    removeFromSavedHymns: (ids: number[]) => dispatch(removeFromSavedHymns(ids)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedHymns);

import React from "react";
import { ActivityIndicator, Alert, FlatList, StatusBar } from "react-native";
import { Appbar, Searchbar, Surface, Text } from "react-native-paper";
import { NavigationParams, NavigationScreenProp, NavigationState } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { deleteHymnFromServer, getSavedHymnsFromStorage, removeFromSavedHymns } from "../../actions/hymnActions";
import i18n from "../../i18n";
import Action from "../../models/Action";
import { guideTips } from "../../models/GuideTips";
import HymnItem from "../../models/HymnItem";
import { screens } from "../../navigation/savedHymnsStack";
import { AppState } from "../../reducers";
import Transition from "../../shared/Transition";
import AndroidAppBar, { AppBarAction, navIcons, showAsAction } from "../../shared/ui/AndroidAppBar";
import GuideBanner from "../../shared/ui/GuideBanner";
import ThemedView from "../../shared/ui/ThemedView";
import globalStyles from "../../styles/globalStyles";
import icons from "../../styles/icons";
import BottomSheet from "./components/BottomSheet";
import SavedHymnElement from "./components/SavedHymnElement";
import SavedHymnsFAB from "./components/SavedHymnsFAB";
import style from "./style";

interface ReduxDispatch {
  getSavedHymnsFromStorage: () => void;
  removeFromSavedHymns: (hymnIds: string[]) => void;
  deleteHymnFromServer: (id: string) => void;
}

interface OwnProps {
  navigation: NavigationScreenProp<NavigationState, NavigationParams>;
}

type Props = AppState & ReduxDispatch & OwnProps;

interface State {
  isSearchMode: boolean;
  searchQuery: string;
  selectedHymns: string[]; // hymn ids array
}

class SavedHymns extends React.Component<Props, State> {

  private searchbarRef: Searchbar | null = null;
  private bottomSheetRef: BottomSheet | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      isSearchMode: false,
      searchQuery: "",
      selectedHymns: [],
    };
  }

  private openSearch = () => {
    this.setState({isSearchMode: true}, () => {
      if (this.searchbarRef) {
        this.searchbarRef.focus();
      }
    });
  }

  private closeSearch = () => this.setState({isSearchMode: false});

  private getFilteredSavedHymns = (): HymnItem[] => {
    if (this.state.searchQuery) {
      return this.props.hymns!.savedHymns.filter((hymn: HymnItem) => {
        return hymn.title.toLowerCase().includes(this.state.searchQuery.toLowerCase());
      });
    } else {
      return this.props.hymns!.savedHymns;
    }
  }

  private onHymnPress = (hymn: HymnItem) => {
    const {selectedHymns} = this.state;

    if (selectedHymns.length) {
      const newSelectedHymnsArray = [...selectedHymns];
      if (selectedHymns.includes(hymn.hymnId)) {
        newSelectedHymnsArray.splice(selectedHymns.indexOf(hymn.hymnId), 1);
      } else {
        newSelectedHymnsArray.push(hymn.hymnId);
      }

      this.setState({selectedHymns: newSelectedHymnsArray});
    } else {
      this.props.navigation.navigate(screens.HYMN_VIEW, {hymnToView: hymn});
    }
  }

  private onHymnLongPress = (hymn: HymnItem) => {
    // if (!this.state.isSearchMode) {
    if (!this.state.selectedHymns.length) {
      this.bottomSheetRef!.openSheet(hymn);
    } else {
      this.onHymnPress(hymn);
    }
    // }
  }

  private onDeleteSelectedHymns = () => {
    Alert.alert(
      i18n.t("delete_selected_title"),
      i18n.t("delete_selected_message", {count: this.state.selectedHymns.length}),
      [
        {text: i18n.t("btn_cancel")},
        {
          text: i18n.t("btn_delete"), onPress: () => {
            this.props.removeFromSavedHymns(this.state.selectedHymns);
            this.setState({selectedHymns: []});
          },
        },
      ],
    );
  }

  private onSelectHymn = (hymnId: string) => {
    this.setState({selectedHymns: [...this.state.selectedHymns, hymnId]});
  }

  private onSelectAll = () => {
    const savedHymns = this.getFilteredSavedHymns();
    const allSelectedHymns: string[] = [];

    savedHymns.forEach((hymn: HymnItem) => allSelectedHymns.push(hymn.hymnId));

    this.setState({selectedHymns: allSelectedHymns});
  }

  private getSelectModeAppBarActions = (): AppBarAction[] => {
    const action: AppBarAction[] = [];

    action.push({
      title: i18n.t("delete_from_saved"),
      icon: icons.unstar,
      show: showAsAction.ALWAYS,
      onActionSelected: this.onDeleteSelectedHymns,
    });

    action.push({
      title: i18n.t("select_all"),
      icon: icons.select_all,
      show: showAsAction.ALWAYS,
      onActionSelected: this.onSelectAll,
    });

    return action;
  }

  private getMainAppBarActions = (): AppBarAction[] => {
    const action: AppBarAction[] = [];

    action.push({
      title: i18n.t("search"),
      icon: icons.search,
      show: showAsAction.ALWAYS,
      onActionSelected: this.openSearch,
    });

    return action;
  }

  private renderHeader = () => {
    const {surface, primaryDark} = this.props.prefs!.userPrefs.theme.colors;
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
                placeholder={i18n.t("search")}
                style={{elevation: 0, backgroundColor: "transparent"}}
                ref={(ref: Searchbar) => this.searchbarRef = ref}
                onIconPress={this.closeSearch}
                onChangeText={(query) => this.setState({searchQuery: query})}
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
            title={i18n.t("app_name")}
            navIcon={navIcons.MENU}
            onNavIconClick={this.props.navigation.openDrawer}
            actions={this.getMainAppBarActions()}
          />
        </Transition>
      </ThemedView>
    );
  }

  private renderSearchQuery = () => {
    const query = this.state.searchQuery;
    return (
      <Text style={[style.searchQuery, {display: query ? "flex" : "none"}]}>{i18n.t("search_results", {query})}</Text>
    );
  }

  private renderSavedHymns = () => {
    if (this.props.hymns!.savedHymnsLoading) {
      return (
        <ActivityIndicator size="large" style={style.noHymns}/>
      );
    } else {
      return (
        <FlatList
          data={this.getFilteredSavedHymns()}
          onRefresh={this.props.getSavedHymnsFromStorage}
          refreshing={this.props.hymns!.savedHymnsLoading}
          ListEmptyComponent={<Text style={style.noHymns}>{i18n.t("no_hymns")}</Text>}
          keyExtractor={((item: HymnItem) => String(item.hymnId))}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
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
            );
          }}
        />
      );
    }
  }

  private renderFAB = () => {
    if (!this.props.hymns!.savedHymnsLoading && !this.state.selectedHymns.length && !this.state.isSearchMode) {
      return (
        <SavedHymnsFAB
          navigation={this.props.navigation}
          openSearch={this.openSearch}/>
      );
    }
  }

  public render() {
    return (
      <ThemedView style={globalStyles.screen}>
        {this.renderHeader()}
        {this.renderSearchQuery()}
        <GuideBanner tipType={guideTips.PRELOADED_HYMNS}/>
        {this.renderSavedHymns()}
        {this.renderFAB()}
        <BottomSheet ref={(ref) => this.bottomSheetRef = ref}
                     user={this.props.auth!.user}
                     isSearchMode={this.state.isSearchMode}
                     onSelectHymn={this.onSelectHymn}
                     onRemoveFromSaved={(hymnId: string) => this.props.removeFromSavedHymns([hymnId])}
                     onDeleteHymnFromServer={this.props.deleteHymnFromServer}
                     navigation={this.props.navigation}/>
      </ThemedView>
    );
  }

}

const mapStateToProps = (state: AppState) => {
  const {hymns, prefs, auth} = state;
  return {hymns, prefs, auth};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    getSavedHymnsFromStorage: () => dispatch(getSavedHymnsFromStorage()),
    removeFromSavedHymns: (ids: string[]) => dispatch(removeFromSavedHymns(ids)),
    deleteHymnFromServer: (id: string) => dispatch(deleteHymnFromServer(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SavedHymns);

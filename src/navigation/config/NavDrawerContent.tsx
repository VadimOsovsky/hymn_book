import React, { PureComponent } from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Drawer, Text, Title } from "react-native-paper";
import { DrawerItemsProps } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { logout } from "../../actions/authActions";
import { setTheme } from "../../actions/preferencesActions";
import i18n from "../../i18n";
import Action from "../../models/Action";
import { AppState } from "../../reducers";
import StatusBarSafeArea from "../../shared/StatusBarSafeArea";
import MyCheckbox from "../../shared/ui/MyCheckbox";
import ThemedView from "../../shared/ui/ThemedView";
import { darkTheme, lightTheme, MyTheme } from "../../styles/appTheme";
import { screens } from "../rootStack";

interface ReduxDispatch {
  logout: () => void;
  setTheme: (theme: MyTheme) => void;
}

type Props = DrawerItemsProps & ReduxDispatch & AppState;

class NavDrawerContent extends PureComponent<Props> {

  private onNavItemPress = (navItemKey: string) => {
    this.props.navigation.closeDrawer();
    this.props.navigation.navigate(navItemKey);
  }

  private getNameAlias = (): string => {
    const {user} = this.props.auth!;

    if (user && user.name) {
      const words = user.name.split(" ");
      if (words.length <= 1) {
        return words[0][0];
      } else {
        return words[0][0] + words[1][0];
      }
    } else {
      return i18n.t("guest")[0];
    }
  }

  public render() {
    const {user} = this.props.auth!;
    return (
      <ThemedView style={style.drawer}>
        <ScrollView contentContainerStyle={{justifyContent: "space-between", flexGrow: 1}}>
          <View style={{paddingVertical: 10}}>
            <StatusBarSafeArea transparent/>
            <Drawer.Section style={style.userSection}>
              {user && user.profilePicture ?
                <Avatar.Image style={style.profilePicture} source={{uri: user.profilePicture}}/>
                :
                <Avatar.Text style={style.profilePicture} label={this.getNameAlias()}/>
              }
              <Title style={style.title}>{user ? user.name : i18n.t("guest")}</Title>
              <Text style={style.caption}>{user ? user.email : i18n.t("enter_wycliffe_account")}</Text>
            </Drawer.Section>

            <Drawer.Section>
              {this.props.items.map((navItem: any) => {
                if (navItem.params.showInDrawer) {
                  return (
                    <Drawer.Item
                      key={navItem.key}
                      label={navItem.params.label}
                      icon={navItem.params.icon}
                      active={this.props.activeItemKey === navItem.key}
                      onPress={() => this.onNavItemPress(navItem.key)}
                    />
                  );
                }
              })}
            </Drawer.Section>
            {this.props.auth!.token ?
              <Drawer.Item
                label={i18n.t("route_logout")}
                icon="launch"
                onPress={this.props.logout}
              />
              :
              <Drawer.Item
                label={i18n.t("route_login")}
                icon="launch"
                onPress={() => this.props.navigation.navigate(screens.AUTH)}
              />
            }
          </View>

          <View>
            <Drawer.Item
              label={i18n.t("route_about_wycliffe")}
              icon="info"
              onPress={() => Linking.openURL("https://wycliffe.ru/")}
            />
            <MyCheckbox
              value={this.props.prefs!.userPrefs.theme.dark}
              label={i18n.t("night_mode")}
              icon="brightness-4"
              style={style.checkboxContainer}
              textStyle={[style.checkboxLabel, {color: this.props.prefs!.userPrefs.theme.colors.text}]}
              iconStyle={[style.checkboxIcon, {color: this.props.prefs!.userPrefs.theme.colors.text}]}
              onCheckboxChange={() => {
                this.props.setTheme(!this.props.prefs!.userPrefs.theme.dark ? darkTheme : lightTheme);
              }}
            />
          </View>
        </ScrollView>
      </ThemedView>
    );
  }
}

const mapStateToProps = (state: AppState) => {
  const {prefs, auth} = state;
  return {prefs, auth};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    logout: () => dispatch(logout()),
    setTheme: (theme: MyTheme) => dispatch(setTheme(theme)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavDrawerContent);

const style = StyleSheet.create({
  drawer: {
    height: "100%",
  },
  userSection: {},
  profilePicture: {
    margin: 10,
  },
  title: {
    marginHorizontal: 10,
  },
  caption: {
    opacity: 0.5,
    marginBottom: 10,
    marginHorizontal: 10,
  },
  checkboxContainer: {
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 4,
    overflow: "hidden",
  },
  checkboxIcon: {
    opacity: 0.7,
  },
  checkboxLabel: {
    opacity: 0.7,
    marginHorizontal: 32,
    fontFamily: "sans-serif-medium",
  },
});

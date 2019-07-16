import React, { PureComponent } from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Drawer, Text, Title } from "react-native-paper";
import { DrawerItemsProps } from "react-navigation";
import { connect } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { setTheme } from "../../actions/preferencesActions";
import i18n from "../../i18n";
import Action from "../../models/Action";
import { AppState } from "../../reducers";
import MyCheckbox from "../../shared/MyCheckbox";
import StatusBarSafeArea from "../../shared/StatusBarSafeArea";
import ThemedView from "../../shared/ThemedView";
import { darkTheme, lightTheme, MyTheme } from "../../styles/appTheme";
import { screens } from "../rootStack";

interface ReduxDispatch {
  setTheme: (theme: MyTheme) => void;
}

type Props = DrawerItemsProps & ReduxDispatch & AppState;

class NavDrawerContent extends PureComponent<Props> {

  private firstName = i18n.t("guest");
  private lastName = i18n.t("user");
  private email = i18n.t("enter_wycliffe_account");
  private profilePicture = "";

  private onNavItemPress = (navItemKey: string) => {
    this.props.navigation.closeDrawer();
    this.props.navigation.navigate(navItemKey);
  }

  public render() {
    return (
      <ThemedView style={style.drawer}>
        <ScrollView contentContainerStyle={{justifyContent: "space-between", flexGrow: 1}}>
          <View style={{paddingVertical: 10}}>
            <StatusBarSafeArea transparent/>
            <Drawer.Section style={style.userSection}>
              {(() => {
                if (this.profilePicture) {
                  return <Avatar.Image style={style.profilePicture} source={{uri: this.profilePicture}}/>;
                } else {
                  return <Avatar.Text style={style.profilePicture} label={this.firstName[0] + this.lastName[0]}/>;
                }
              })()}
              <Title style={style.title}>{`${this.firstName} ${this.lastName}`}</Title>
              <Text style={style.caption}>{this.email}</Text>
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
            <Drawer.Item
              label={i18n.t("route_login")}
              icon="launch"
              onPress={() => this.props.navigation.replace(screens.AUTH)}
            />
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
  const {prefs} = state;
  return {prefs};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
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

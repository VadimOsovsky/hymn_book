import React from "react";
import { Linking, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Drawer, Text, Title } from 'react-native-paper';
import StatusBarSafeArea from "../shared/StatusBarSafeArea";
import { DrawerItemsProps } from "react-navigation";
import { AppState } from "../reducers";
import { darkTheme, lightTheme, MyTheme } from "../styles/appTheme";
import { setTheme } from "../actions/preferencesActions";
import { connect } from "react-redux";
import MyCheckbox from "../shared/MyCheckbox";
import ThemedView from "../shared/ThemedView";
import { ThunkDispatch } from "redux-thunk";
import Action from "../models/Action";
import i18n from "../i18n";
import { screens } from "./rootStack";

interface ReduxDispatch {
  setTheme: (theme: MyTheme) => void
}

type Props = DrawerItemsProps & ReduxDispatch & AppState

function NavDrawerContent(props: Props) {

  // TODO get user from store
  const firstName = i18n.t('guest');
  const lastName = i18n.t('user');
  const email = i18n.t('enter_wycliffe_account');
  const profilePicture = "";

  return (
    <ThemedView style={style.drawer}>
      <ScrollView>
        <View style={{paddingVertical: 10}}>
          <StatusBarSafeArea transparent/>
          <Drawer.Section style={style.userSection}>
            {(() => {
              if (profilePicture) {
                return <Avatar.Image style={style.profilePicture} source={{uri: profilePicture}}/>
              } else {
                return <Avatar.Text style={style.profilePicture} label={firstName[0] + lastName[0]}/>
              }
            })()}
            <Title style={style.title}>{`${firstName} ${lastName}`}</Title>
            <Text style={style.caption}>{email}</Text>
          </Drawer.Section>

          <Drawer.Section>
            {props.items.map((navItem: any) => {
              if (navItem.params.showInDrawer) {
                return (
                  <Drawer.Item
                    key={navItem.key}
                    label={navItem.params.label}
                    icon={navItem.params.icon}
                    active={props.activeItemKey === navItem.key}
                    onPress={() => {
                      props.navigation.closeDrawer();
                      props.navigation.navigate(navItem.key);
                    }}
                  />
                )
              }
            })}
          </Drawer.Section>
          <Drawer.Item
            label={i18n.t('route_login')}
            icon="launch"
            onPress={() => props.navigation.replace(screens.AUTH)}
          />
          <Drawer.Item
            label={i18n.t('route_about_wycliffe')}
            icon="info"
            onPress={() => Linking.openURL("https://wycliffe.ru/")}
          />
          <MyCheckbox
            value={props.prefs!.userPrefs.theme === darkTheme}
            label={i18n.t('night_mode')}
            icon="brightness-4"
            style={style.checkboxContainer}
            textStyle={[style.checkboxLabel, {color: props.prefs!.userPrefs.theme.colors.text}]}
            iconStyle={[style.checkboxIcon, {color: props.prefs!.userPrefs.theme.colors.text}]}
            onCheckboxChange={() => props.setTheme(props.prefs!.userPrefs.theme !== darkTheme ? darkTheme : lightTheme)}
          />
        </View>
      </ScrollView>
    </ThemedView>
  )
}

const mapStateToProps = (state: AppState) => {
  const {prefs} = state;
  return {prefs};
};

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>) => {
  return {
    setTheme: (theme: MyTheme) => dispatch(setTheme(theme)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NavDrawerContent);

const style = StyleSheet.create({
  drawer: {
    height: '100%',
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
  }
});


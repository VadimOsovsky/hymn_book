import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Drawer, Text, Title } from 'react-native-paper';
import StatusBarSafeArea from "../shared/StatusBarSafeArea";
import { DrawerItemsProps } from "react-navigation";
import { AppState } from "../reducers";
import { darkTheme, lightTheme, MyTheme } from "../styles/appTheme";
import { Dispatch } from "redux";
import { setTheme } from "../actions/preferencesActions";
import { connect } from "react-redux";
import MyCheckbox from "../shared/MyCheckbox";

interface ReduxDispatch {
  setTheme: (theme: MyTheme) => void
}

type Props = DrawerItemsProps & ReduxDispatch & AppState

function NavDrawerContent(props: Props) {

  const firstName = "Guest";
  const lastName = "User";
  const email = "Enter your Wycliffe account";
  const profilePicture = "";

  return (
    <View
      style={{backgroundColor: props.prefs.theme.colors.background, height: '100%', justifyContent: 'space-between'}}>
      <StatusBarSafeArea transparent/>
      <ScrollView>
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
      </ScrollView>

      <Drawer.Section>
        <Drawer.Item
          label="Log in"
          icon="launch"
          onPress={() => props.navigation.replace("AuthScreen")}
        />
      </Drawer.Section>
      <MyCheckbox
        value={props.prefs.theme === darkTheme}
        label="Night Mode"
        style={{marginBottom: 10}}
        textStyle={{color: props.prefs.theme.colors.text, fontFamily: "sans-serif-medium"}}
        onCheckboxChange={() => props.setTheme(props.prefs.theme !== darkTheme ? darkTheme : lightTheme)}
      />
    </View>
  )
}

const mapStateToProps = (state: AppState) => {
  const {prefs} = state;
  return {prefs};
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    setTheme: (theme: MyTheme) => dispatch(setTheme(theme)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(NavDrawerContent);

const style = StyleSheet.create({
  userSection: {
    paddingTop: 10,
  },
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
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    margin: 10,
  }
});


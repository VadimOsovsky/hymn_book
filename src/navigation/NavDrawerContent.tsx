import React from "react";
import {View, ScrollView} from "react-native";
import {Drawer} from 'react-native-paper';
import StatusBarSafeArea from "../shared/StatusBarSafeArea";

function NavDrawerContent(props: any) {
  // console.log("VO: props", props)

  return (
    <View style={{height: '100%', justifyContent: 'space-between'}}>
      <StatusBarSafeArea transparent/>
      <ScrollView>
        <Drawer.Section>
          {props.items.map((navItem: any) => {
            if (navItem.params.showInDrawer) {
              return (
                <Drawer.Item
                  key={navItem.key}
                  label={navItem.params.label}
                  icon={navItem.params.icon}
                  active={props.activeItemKey === navItem.key}
                  onPress={() => props.navigation.navigate(navItem.key)}
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
    </View>
  )
}

export default NavDrawerContent;

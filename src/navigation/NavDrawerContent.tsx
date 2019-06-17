import React from "react";
import {View, ScrollView, SafeAreaView} from "react-native";
import {Drawer} from 'react-native-paper';

function NavDrawerContent(props: any) {
  console.log("VO: props", props)

  return (
    <SafeAreaView style={{height: '100%', justifyContent: 'space-between'}}>
      <ScrollView>
        <Drawer.Section>
          {props.items.map((navItem: any) => {
            return (
              <Drawer.Item
                key={navItem.key}
                label={navItem.params.label}
                icon={navItem.params.icon}
                active={props.activeItemKey === navItem.key}
                onPress={() => {
                }}
              />
            )
          })}
        </Drawer.Section>
      </ScrollView>

      <Drawer.Section>
        <Drawer.Item
          label="Log in"
          icon="launch"
          onPress={() => {
          }}
        />
      </Drawer.Section>
    </SafeAreaView>
  )
}

export default NavDrawerContent;

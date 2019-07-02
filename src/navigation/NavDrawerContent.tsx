import React from "react";
import { ScrollView, View, Text } from "react-native";
import { Avatar, Drawer, Title } from 'react-native-paper';
import StatusBarSafeArea from "../shared/StatusBarSafeArea";

function NavDrawerContent(props: any) {

  const firstName = props.firstName || "Guest";
  const lastName = props.lastName || "User";
  const email = props.email || "Enter your Wycliffe account";

  return (
    <View style={{height: '100%', justifyContent: 'space-between'}}>
      <StatusBarSafeArea transparent/>
      <ScrollView>
        <Drawer.Section style={{paddingHorizontal: 10, paddingTop: 10}}>
          {(() => {
            if (props.profilePicture) {
              return <Avatar.Image style={{marginVertical: 10}} source={props.profilePicture} />
            } else {
              return <Avatar.Text style={{marginVertical: 10}} label={firstName[0] + lastName[0]}/>
            }
          })()}
          <Title>{`${firstName} ${lastName}`}</Title>
          <Text style={{marginBottom: 10}}>{email}</Text>
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
    </View>
  )
}

export default NavDrawerContent;

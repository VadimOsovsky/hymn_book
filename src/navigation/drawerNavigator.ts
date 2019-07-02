import { createDrawerNavigator } from 'react-navigation';
import savedHymnsStack from "./savedHymnsStack";
import NavDrawerContent from "./NavDrawerContent";
import settingsStack from "./settingsStack";
import groupsStack from "./groupsStack";

const drawerNavigator = createDrawerNavigator(
  {
    SavedHymnsStack: {
      screen: savedHymnsStack,
      params: {
        icon: "star",
        label: "Saved hymns",
        showInDrawer: true
      }
    },
    GroupsStack: {
      screen: groupsStack,
      params: {
        icon: "people",
        label: "My Groups",
        showInDrawer: true
      }
    },
    SettingsStack: {
      screen: settingsStack,
      params: {
        icon: "settings",
        label: "Settings",
        showInDrawer: true
      }
    },
  },
// @ts-ignore
  {
    drawerType: 'back',
    contentComponent: NavDrawerContent
  }
);

export default drawerNavigator;

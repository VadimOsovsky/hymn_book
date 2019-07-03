import { createDrawerNavigator } from 'react-navigation';
import savedHymnsStack from "./savedHymnsStack";
import NavDrawerContent from "./NavDrawerContent";
import settingsStack from "./settingsStack";
import groupsStack from "./groupsStack";
import i18n from '../i18n';

const drawerNavigator = createDrawerNavigator(
  {
    SavedHymnsStack: {
      screen: savedHymnsStack,
      params: {
        icon: "star",
        label: i18n.t('route_saved_hymns'),
        showInDrawer: true
      }
    },
    GroupsStack: {
      screen: groupsStack,
      params: {
        icon: "people",
        label: i18n.t('route_my_groups'),
        showInDrawer: true
      }
    },
    SettingsStack: {
      screen: settingsStack,
      params: {
        icon: "settings",
        label: i18n.t('route_settings'),
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

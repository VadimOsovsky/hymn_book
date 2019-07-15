// @ts-ignore
import { createDrawerNavigator } from "react-navigation-drawer";
import i18n from "../i18n";
import NavDrawerContent from "./config/NavDrawerContent";
import groupsStack from "./groupsStack";
import savedHymnsStack from "./savedHymnsStack";
import settingsStack from "./settingsStack";

const drawerNavigator = createDrawerNavigator(
  {
    SavedHymnsStack: {
      screen: savedHymnsStack,
      params: {
        icon: "star",
        label: i18n.t("route_saved_hymns"),
        showInDrawer: true,
      },
    },
    MyProfile: {
      screen: groupsStack,
      params: {
        icon: "person",
        label: i18n.t("route_my_profile"),
        showInDrawer: true,
      },
    },
    GroupsStack: {
      screen: groupsStack,
      params: {
        icon: "people",
        label: i18n.t("route_my_groups"),
        showInDrawer: true,
      },
    },
    SettingsStack: {
      screen: settingsStack,
      params: {
        icon: "settings",
        label: i18n.t("route_settings"),
        showInDrawer: true,
      },
    },
  },
  {
    drawerType: "back",
    contentComponent: NavDrawerContent,
  },
);

export default drawerNavigator;

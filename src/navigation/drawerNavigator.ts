import { createDrawerNavigator } from 'react-navigation';
import savedHymnsStack from "./savedHymnsStack";
import NavDrawerContent from "./NavDrawerContent";

const drawerNavigator = createDrawerNavigator(
  {
    SavedHymnsStack: { screen: savedHymnsStack, params: { icon: 'star', label: "Saved hymns" }},
  },
  {
    // drawerType: 'back',
    contentComponent: NavDrawerContent
  }
);

export default drawerNavigator;

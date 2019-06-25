import { createDrawerNavigator } from 'react-navigation';
import savedHymnsStack from "./savedHymnsStack";
import NavDrawerContent from "./NavDrawerContent";

const drawerNavigator = createDrawerNavigator(
  {
    SavedHymnsStack: {
      screen: savedHymnsStack,
      params: {
        icon: "star",
        label: "Saved hymns",
        showInDrawer: true
      },
      // VO: Temporarily disable navigation
      navigationOptions: {
        drawerLockMode: 'locked-open',
      }
    },
  },
  {
    // drawerType: 'back',
    contentComponent: NavDrawerContent
  }
);

export default drawerNavigator;

import React from "react";
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from "@react-navigation/drawer";
import MainStack from "./MainStack";
import SettingsScreen from "../pages/SettingsScreen";
import CustomDrawer from "../components/CustomDrawer";

type DrawerNavigationType = {
  [key: string]: undefined;
};

export type DrawerTypes = DrawerNavigationProp<DrawerNavigationType>;

const Drawer = createDrawerNavigator<DrawerNavigationType>();

const options = {
  headerShown: false,
  // drawerActiveBackgroundColor: "#ffffff",
  // drawerActiveTintColor: "#282828",
  // drawerInactiveTintColor: "#fff",
  // drawerInactiveBackgroundColor: "#ffffff28",
};

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: "right",
      }}
      drawerContent={props => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={MainStack}
        options={{...options,
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{...options,
          drawerLabel: "Settings",
        }}
      />
    </Drawer.Navigator>
  );
};
export default DrawerNavigation;

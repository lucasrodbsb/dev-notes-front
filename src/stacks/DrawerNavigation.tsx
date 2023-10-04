import React from "react";
import {
  createDrawerNavigator,
  DrawerNavigationProp,
} from "@react-navigation/drawer";
import MainStack from "./MainStack";
import SettingsScreen from "../pages/SettingsScreen";

type DrawerNavigationType = {
  [key: string]: undefined;
};

export type DrawerTypes = DrawerNavigationProp<DrawerNavigationType>;

const Drawer = createDrawerNavigator();

const options = {
  headerShown: false,
  drawerActiveBackgroundColor: "#ffffff",
  drawerActiveTintColor: "#282828",
  drawerInactiveTintColor: "#fff",
  drawerInactiveBackgroundColor: "#ffffff28",
};

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: "#282828" },
        drawerPosition: "right",
      }}
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

import React from "react";
import {
  createDrawerNavigator,
  DrawerNavigationOptions,
  DrawerNavigationProp,
} from "@react-navigation/drawer";
import MainStack from "./MainStack";
import SettingsScreen from "../pages/SettingsScreen";
import CustomDrawer from "../components/CustomDrawer";
import { useTheme, useThemeMode } from "@rneui/themed";
import { ThemeConsumer } from "react-native-elements";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import ConfigStack from "./ConfigStack";

type DrawerNavigationType = {
  [key: string]: undefined;
};

export type DrawerTypes = DrawerNavigationProp<DrawerNavigationType>;

const Drawer = createDrawerNavigator<DrawerNavigationType>();

const DrawerNavigation = () => {
  const { theme, updateTheme } = useTheme();
  const { mode, setMode } = useThemeMode();

  const options: DrawerNavigationOptions = {
    headerShown: false,
    drawerActiveTintColor: mode == 'dark' ? theme.colors.tintColor : theme.colors.text,
    drawerInactiveTintColor: theme.colors.text
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: "right",
      }}

      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="MainStack"
        component={MainStack}
        options={{ ...options, drawerLabel: "Suas Notas"}}
        
      />
      <Drawer.Screen
        name="ConfigStack"
        component={ConfigStack}
        options={{ ...options, drawerLabel: "Ajustes" }}
      />
    </Drawer.Navigator>
  );
};
export default DrawerNavigation;

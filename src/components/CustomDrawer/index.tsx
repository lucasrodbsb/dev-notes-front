import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Theme, Colors, useTheme, useThemeMode } from "@rneui/themed";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Avatar, Divider } from "react-native-elements";
import { useAppSelector } from "../../hooks/reduxHooks";
import { generateColor } from "../../helpers";

const CustomDrawer = (props: DrawerContentComponentProps) => {
  const { theme, updateTheme } = useTheme();
  const { mode, setMode } = useThemeMode();
  const userData = useAppSelector((store) => store.authReducer.user);

  const getInitialsFromFullName = (): string => {
    if (userData) {
      return (
        userData.full_name.split(" ")[0][0] +
        (userData.full_name.split(" ")?.at(1)?.at(0) ?? "")
      );
    } else {
      return "";
    }
  };

  return (
    <DrawerContentScrollView
      style={{ backgroundColor: theme.colors.primary }}
      {...props}
    >
      <View style={styles(theme).header}>
        <Avatar
          title={getInitialsFromFullName()}
          size={100}
          rounded
          containerStyle={{
            backgroundColor: generateColor(userData?.user_Id ?? 0),
          }}
          titleStyle={{}}
        />
        <Text numberOfLines={1} style={styles(theme).loginText}>
          {userData?.username}
        </Text>
      </View>
      <Divider style={styles(theme).divider} color={theme.colors.divider} />
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = (
  theme: {
    colors: Colors;
  } & Theme
) =>
  StyleSheet.create({
    header: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      gap: 10,
    },
    loginText: {
      fontSize: 25,
      color: theme.colors.text,
    },
    divider: {
      marginBottom: 20
    }
  });

import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import React from "react";

import {
  Colors,
  useTheme,
  useThemeMode,
  ListItem,
  Avatar,
  ListItemProps,
} from "@rneui/themed";
import { Theme } from "@rneui/base";
import TouchableScale from "react-native-touchable-scale";

type Props = {
  title: string;
  danger?: boolean;
  childrenProps: ListItemProps
};

const CustomListItem = ({ title, danger , childrenProps}: Props)=> {
  const { mode, setMode } = useThemeMode();
  const { theme, updateTheme } = useTheme();

  return (
    <ListItem
      Component={TouchableScale}
      style={styles(theme).listItemContainer}
      containerStyle={
        !danger
          ? styles(theme).listItem
          : { ...styles(theme).listItem, backgroundColor: theme.colors.error }
      }
      {...childrenProps}
    >
      <ListItem.Content>
        <ListItem.Title
          style={{
            color: danger
              ? mode == "light"
                ? theme.colors.primary
                : theme.colors.text
              : theme.colors.text,
          }}
        >
          {title}
        </ListItem.Title>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;

const styles = (
  theme: {
    colors: Colors;
  } & Theme
) =>
  StyleSheet.create({
    listItemContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "row",
      alignItems: 'center',
      justifyContent: 'center'
    },

    listItem: {
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      color: theme.colors.text,
      borderWidth: 2,
      borderColor: theme.colors.secondary
    },
  });

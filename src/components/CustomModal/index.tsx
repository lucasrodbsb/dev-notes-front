import { ThemeConsumer, useTheme, Theme, Colors } from "@rneui/themed";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Text,
  ScrollView,
} from "react-native";
import { Overlay } from "react-native-elements";

const { height } = Dimensions.get("window");

type Props = {
  show: boolean;
  close: () => void;
  children?: JSX.Element | JSX.Element[] | undefined;
  noteTitle: string;
  noteBody: string;
};

const CustomModal = ({ show, close, noteBody, noteTitle }: Props) => {
  const [isOverlayOpen, setIsOverlayOpen] = React.useState<boolean>(false);
  const { theme, updateTheme } = useTheme();

  return (
    <Overlay
      isVisible={show}
      onBackdropPress={close}
      overlayStyle={{
        alignItems: "center",
        justifyContent: "center",
        padding: 0,
        backgroundColor: "#ffffff7",
        width: "90%",
        paddingHorizontal: 0,
        paddingVertical: 0,
        height: "70%",
        borderRadius: 50,
      }}
      backdropStyle={{
        backgroundColor: "#00000073",
      }}
      transparent={true}
      animationType="fade"
    >
      <Animated.View style={[styles(theme).container]}>
        <View style={styles(theme).noteContainer}>
          <View
            style={[
              styles(theme).noteHeader,
            ]}
          >
            <Text
              style={styles(theme).noteTitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {noteTitle}
            </Text>
          </View>
          <ScrollView
            style={styles(theme).noteBody}
            contentInsetAdjustmentBehavior="scrollableAxes"
            bouncesZoom
          >
            <Text style={styles(theme).noteBodyText}>{noteBody.trim()}</Text>
            <View style={styles(theme).noteBody.placeholder}></View>
          </ScrollView>
        </View>
      </Animated.View>
    </Overlay>
  );
};

const styles = (
  theme: {
    colors: Colors;
  } & Theme
) =>
  StyleSheet.create({
    container: {
      width: "100%",
      display: "flex",
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    noteContainer: {
      height: "100%",
      width: "100%",
      borderRadius: 10,
      overflow: "hidden",
    },
    noteHeader: {
      backgroundColor: theme.colors.tintColor,
      minHeight: 60,
      minWidth: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 9,
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: .2,
    },
    noteTitle: {
      color: theme.colors.noteTitleColor,
      fontWeight: "bold",
      width: "100%",
      fontSize: 20,
      textAlign: "center",
    },
    noteBadge: {
      height: 25,
      width: 25,
      backgroundColor: "#e5c02a",
      borderRadius: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    noteBody: {
      backgroundColor: theme.colors.noteBodyColor,
      overflow: "scroll",
      padding: 15,
      flex: 1,
      placeholder: { width: 20, height: 20 },
    },
    noteBodyText: {
      fontSize: 16,
      textAlign: "justify",
      textDecorationLine: "underline",
      textDecorationColor: "#00000020",
      color: theme.colors.text,
    },
  });

export default CustomModal;

import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { Button } from "@react-native-material/core";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { useDeleteNoteByIdMutation } from "../../services/redux/api/notesApi";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { StackTypes } from "../../stacks/MainStack";
import CustomBottomModal from "../CustomBottomModal";
import * as Clipboard from "expo-clipboard";
import CustomModal from "../CustomModal";
import { Colors, useTheme } from "@rneui/themed";
import { Theme } from "react-native-elements";

type Props = {
  title: string;
  body: string;
  count: number;
  datetime: number;
  noteId: number;
  userName: string;
};

const Note = ({
  title = "Sem Título",
  body = "Corpo da nota corpo da nota corpo da nota corpo da nota, Corpo da nota corpo da nota corpo da nota corpo da nota, Corpo da nota corpo da nota corpo da nota corpo da nota, Corpo da nota corpo da nota corpo da nota corpo da nota",
  count = 1,
  datetime,
  noteId,
  userName,
}: Props) => {
  const [isBottomModalVisible, setIsBottomModalVisible] =
    React.useState<boolean>(false);

  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);

  const navig = useNavigation<StackTypes>();

  const { theme, updateTheme } = useTheme();

  const [deleteNoteById, responseDeleteNoteById] = useDeleteNoteByIdMutation();

  const copyTextToClipboard = async () => {
    await Clipboard.setStringAsync(
      `*${title.trim()}*\n\n${body.trim()}\n---------------------- \nAutor:\n${userName.trim()}`
    );
  };

  return (
    <View style={styles(theme).noteContainer}>
      <View style={styles(theme).noteHeader}>
        <Text
          onPress={() => {
            setIsModalVisible(!isModalVisible);
          }}
          numberOfLines={1}
          style={styles(theme).noteTitle}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={styles(theme).noteBadge}>
            <Pressable style={{ borderRadius: 50 }}>
              <Icon
                name="dots-horizontal"
                size={20}
                color={theme.colors.noteTitleColor}
                onPress={() => {
                  setIsBottomModalVisible(!isBottomModalVisible);
                }}
              />
            </Pressable>
          </View>
        </View>
      </View>
      <ScrollView
        style={styles(theme).noteBody}
        contentInsetAdjustmentBehavior="scrollableAxes"
        bouncesZoom
      >
        <Text style={styles(theme).noteBodyText}>{body}</Text>
        <View style={styles(theme).noteBody.placeholder}></View>
      </ScrollView>
      <CustomBottomModal
        show={isBottomModalVisible}
        close={() => {
          setIsBottomModalVisible(!isBottomModalVisible);
        }}
      >
        <View
          style={{
            paddingVertical: 30,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <View style={{ gap: 5, marginBottom: 30, width: "100%" }}>
            <Text
              style={{ textAlign: "center", color: theme.colors.text, fontSize: 30 }}
            >
              {title}
            </Text>
            <Text
              style={{ color: theme.colors.textSecondary, fontSize: 15, textAlign: "center" }}
            >
              {`${moment(datetime).format("DD/MM/YYYY - HH:mm:ss")}`}
            </Text>
          </View>
          <View style={{ gap: 15 }}>
            <Button
              title={"Editar"}
              color={theme.colors.tintColor}
              onPress={() => {
                navig.navigate("EditNote", {
                  note_id: noteId,
                  note_body: body,
                  note_title: title,
                });
                setIsBottomModalVisible(!isBottomModalVisible);
              }}
              variant="contained"
            />
            <Button
              title="Copiar"
              color={theme.colors.text}
              onPress={() => {
                copyTextToClipboard()
                  .then(() => {
                    Toast.show({
                      type: "success",
                      text1: "Êxito!",
                      text2: "Nota copiada para sua área de transferência.",
                    });
                    setIsBottomModalVisible(!isBottomModalVisible);
                  })
                  .catch(() => {
                    Toast.show({
                      type: "error",
                      text1: "Erro!",
                      text2: "Erro ao copiar nota.",
                    });
                  });
              }}
              variant="outlined"
              contentContainerStyle={{backgroundColor: theme.colors.primary}}
              
            />
            <Button
              title="Deletar"
              color={theme.colors.error}
              onPress={() => {
                deleteNoteById({ note_id: +noteId ?? 0 })
                  .then(() => {
                    Toast.show({
                      type: "success",
                      text1: "Êxito!",
                      text2: "Nota deletada com sucesso.",
                    });
                    setIsBottomModalVisible(!isBottomModalVisible);
                  })
                  .catch(() => {
                    Toast.show({
                      type: "error",
                      text1: "Erro!",
                      text2: "Erro ao deletar nota.",
                    });
                  });
              }}
              variant="contained"
              titleStyle={{ color: "#fff" }}
              style={{ marginTop: 20 }}
            />
          </View>
        </View>
      </CustomBottomModal>
      <CustomModal
        show={isModalVisible}
        close={() => {
          setIsModalVisible(!isModalVisible);
        }}
        noteTitle={title}
        noteBody={body}
      >
        <></>
      </CustomModal>
    </View>
  );
};

export default Note;

const styles = (
  theme: {
    colors: Colors;
  } & Theme
) =>
  StyleSheet.create({
    noteContainer: {
      minHeight: 180,
      minWidth: 140,
      maxWidth: "49%",
      flex: 0.5,
      borderRadius: 10,
      shadowColor: "#707070",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    noteHeader: {
      backgroundColor: theme.colors.tintColor,
      minHeight: 40,
      minWidth: "100%",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 9,
      borderBottomColor: theme.colors.divider,
      borderBottomWidth: 0.2,
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
    },
    noteTitle: {
      color: theme.colors.noteTitleColor,
      fontWeight: "bold",
      width: 130,
    },
    noteBadge: {
      height: 25,
      width: 25,
      backgroundColor: '#0000001e',
      borderRadius: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    noteBody: {
      backgroundColor: theme.colors.noteBodyColor,
      overflow: "scroll",
      padding: 9,
      maxHeight: 140,
      flex: 1,
      placeholder: { width: 20, height: 20 },
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
    },
    noteBodyText: {
      color: theme.colors.text,
    },
  });


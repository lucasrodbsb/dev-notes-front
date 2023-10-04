import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  Alert,
} from "react-native";
import React from "react";
import { Skeleton, Dialog, FAB } from "@rneui/themed";
import { Button } from "@react-native-material/core";
import { Badge, Overlay } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { useDeleteNoteByIdMutation } from "../../services/redux/api/notesApi";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackTypes } from "../../stacks/MainStack";

type Props = {
  title: string;
  body: string;
  count: number;
  datetime: number;
  noteId: number;
};

const Note = ({
  title = "Sem Título",
  body = "Corpo da nota corpo da nota corpo da nota corpo da nota, Corpo da nota corpo da nota corpo da nota corpo da nota, Corpo da nota corpo da nota corpo da nota corpo da nota, Corpo da nota corpo da nota corpo da nota corpo da nota",
  count = 1,
  datetime,
  noteId,
}: Props) => {
  const [isVisible, setIsVisible] = React.useState<boolean>(false);
  const navig = useNavigation<StackTypes>()

  const [deleteNoteById, responseDeleteNoteById] = useDeleteNoteByIdMutation();

  return (
    <View style={styles.noteContainer}>
      <View style={styles.noteHeader}>
        <Text style={styles.noteTitle}>{title}</Text>
        <View style={styles.noteBadge}>
          {/* <Text style={styles.noteBadge.text}>{count++}</Text> */}
          <Pressable style={{borderRadius: 50}}>
            <Icon
              name="dots-horizontal"
              size={20}
              color="#414141"
              onPress={() => {
                setIsVisible(!isVisible);
              }}
            />
          </Pressable>
        </View>
      </View>
      <ScrollView style={styles.noteBody}>
        <Text>{body}</Text>
        <View style={styles.noteBody.placeholder}></View>
      </ScrollView>
      <Overlay
        isVisible={isVisible}
        onBackdropPress={() => {
          setIsVisible(!isVisible);
        }}
        overlayStyle={{
          backgroundColor: "#282828",
          width: "80%",
          gap: 15,
          borderRadius: 10,
        }}
      >
        <View>
          <Text style={{ color: "#ffffff", fontSize: 20, marginBottom: 5 }}>
            {title}
          </Text>
          <Text style={{ color: "#ffffff80", fontSize: 15 }}>
            {moment(datetime).format("DD/MM/YYYY - HH:mm:ss")}
          </Text>
        </View>

        <Button
          title={"Editar"}
          color="#fff"
          onPress={() => {
            navig.navigate("EditNote", {
              note_id: noteId,
              note_body: body,
              note_title: title
            });
            setIsVisible(!isVisible);
          }}
          variant="contained"
        />
        <Button
          title="Deletar"
          color="red"
          onPress={() => {
            deleteNoteById({ note_id: +noteId ?? 0 })
              .then(() => {
                Toast.show({
                  type: "success",
                  text1: "Êxito!",
                  text2: "Nota deletada com sucesso.",
                });
                setIsVisible(!isVisible);
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
        />
      </Overlay>
    </View>
  );
};

export default Note;

const styles = StyleSheet.create({
  noteContainer: {
    minHeight: 180,
    minWidth: 140,
    maxWidth: "49%",
    flex: 0.5,
    backgroundColor: "#282828",
    borderRadius: 10,
    overflow: "hidden",
  },
  noteHeader: {
    backgroundColor: "#ffd52e",
    minHeight: 40,
    minWidth: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 9,
  },
  noteTitle: {
    color: "#414141",
    fontWeight: "bold",
  },
  noteBadge: {
    height: 25,
    width: 25,
    backgroundColor: "#e5c02a",
    borderRadius: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    text: {
      color: "#414141",
    },
  },
  noteBody: {
    backgroundColor: "#e4e4e4",
    overflow: "scroll",
    padding: 9,
    maxHeight: 140,
    flex: 1,

    placeholder: { width: 20, height: 20 },
  },
});

{
  /* <Skeleton
animation="wave"
width={185}
skeletonStyle={{backgroundColor: '#3a3a3a' }}
style={{backgroundColor: '#282828'}}
height={180}
/> */
}

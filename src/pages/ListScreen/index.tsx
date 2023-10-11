import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React from "react";
import {
  ParamListBase,
  useFocusEffect,
  useNavigation,
} from "@react-navigation/native";
import { StackNavigation, StackTypes } from "../../stacks/MainStack";
import Header from "../../components/Header";
import { Button } from "@react-native-material/core";
import Note from "../../components/Note";
import { SafeAreaView } from "react-native-safe-area-context";
import { Skeleton, SpeedDial } from "@rneui/themed";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { signOut } from "../../services/redux/slices/authSlice";
import { storage } from "../../services/mmkv";
import { useGetAllNotesByUserIDQuery } from "../../services/redux/api/notesApi";
import { Avatar, SearchBar } from "react-native-elements";
import Skeletons from "../../components/Skeletons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import {
  StackNavigationOptions,
  StackScreenProps,
} from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Note as noteType } from "../../types/notesTypes";
import { useController, useForm } from "react-hook-form";
import { SearchBarCommands } from "react-native-screens";

const ListScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<StackNavigation>) => {
  const drawerNavigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();

  const [userNotesFiltered, setUserNotesFiltered] = React.useState<noteType[]>(
    []
  );
  const [searchBar, setSearchBar] = React.useState<string>("");

  const searchBarRef = React.useRef() as React.RefObject<SearchBarCommands>;

  //   type SearchType = {
  //     searchBar: string
  //   }

  const userData = useAppSelector((store) => store.authReducer.user);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: "Pesquisar Nota",
        cancelButtonText: "Cancelar",
        onChangeText: (event) => {
          setSearchBar(event.nativeEvent.text);
        },
      },
    });
  }, [navigation]);

  const {
    data: userNotes,
    isSuccess,
    isLoading,
    isUninitialized,
    currentData,
    refetch,
    error,
  } = useGetAllNotesByUserIDQuery((userData?.user_Id as number) ?? 0);

  const firstName = (fullname: string) => {
    let firstname = fullname;
    firstname = fullname.split(" ").at(0) ?? "";
    return firstname;
  };

  const handleLogOut = () => {
    return Alert.alert("Sair", "Tem certeza que deseja sair?", [
      {
        text: "Sim",
        onPress: async () => {
          dispatch(signOut()), navigation.navigate("LoaderScreen");
          await AsyncStorage.removeItem("token");
        },
      },
      {
        text: "Cancelar",
      },
    ]);
  };

  const notes =
    userNotesFiltered?.map((item, index) => (
      <Note
        key={index + 1}
        count={index}
        title={item.title}
        body={item.body}
        datetime={item.datetime}
        noteId={item.id}
      />
    )) ?? [];

  React.useEffect(() => {
    if (userNotesFiltered?.length < 1 && userNotes?.length) {
      setUserNotesFiltered(userNotes);
    }
    if (userNotes) {
      setUserNotesFiltered(userNotes);
    }
  }, [userNotes]);

  React.useEffect(() => {
    setUserNotesFiltered(
      userNotes?.filter((item, index) => {
        return (
          !!item.title
            .trim()
            .toLocaleLowerCase()
            .includes(searchBar.trim().toLocaleLowerCase()) ||
          !!item.body
            .trim()
            .toLocaleLowerCase()
            .includes(searchBar.trim().toLocaleLowerCase())
        );
      }) ?? []
    );
  }, [searchBar]);
  return (
    <>
      <StatusBar style="light" />
      <ScrollView
        style={{ backgroundColor: "#141414" }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SafeAreaView style={styles.container}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              paddingBottom: 30,
            }}
          >
            {isLoading ? (
              <Skeletons />
            ) : isSuccess ? (
              !!notes.length ? (
                notes
              ) : (
                <View
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    gap: 30,
                  }}
                >
                  <Text
                    style={{ color: "#fff", textAlign: "center", fontSize: 20 }}
                  >
                    Nenhuma nota a ser exibida.
                  </Text>
                  <Button
                    variant="contained"
                    color="#fff"
                    title="Adicionar nova nota"
                    onPress={() => {
                      navigation.navigate("CreateNote");
                    }}
                  />
                </View>
              )
            ) : (
              <Text style={{ color: "#fff" }}>
                Erro de conexão, favor logar novamente!
              </Text>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
      <SpeedDial
        isOpen={isOpen}
        icon={{ name: "more-horiz", color: "#414141", type: "material" }}
        openIcon={{ name: "more-vert", color: "#414141", type: "material" }}
        onOpen={() => setIsOpen(!isOpen)}
        onClose={() => setIsOpen(!isOpen)}
        color={"#ffd52e"}
      >
        <SpeedDial.Action
          icon={{ name: "logout", color: "#414141" }}
          title="Sair"
          onPress={() => {
            handleLogOut();
            setIsOpen(false);
          }}
          color={"#ffd52e"}
        />
        <SpeedDial.Action
          icon={{ name: "add", color: "#414141" }}
          title="Criar Nota"
          onPress={() => {
            navigation.navigate("CreateNote");
            setIsOpen(false);
          }}
          color={"#ffd52e"}
        />
      </SpeedDial>
    </>
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#141414",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
});

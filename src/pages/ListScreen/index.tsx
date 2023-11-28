import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { StackNavigation } from "../../stacks/MainStack";
import { Button } from "@react-native-material/core";
import Note from "../../components/Note";
import { SafeAreaView } from "react-native-safe-area-context";
import { SpeedDial, useTheme } from "@rneui/themed";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { signOut } from "../../services/redux/slices/authSlice";
import { useGetAllNotesByUserIDQuery } from "../../services/redux/api/notesApi";
import { Avatar, SearchBar } from "react-native-elements";
import Skeletons from "../../components/Skeletons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import {
  StackNavigationOptions,
  StackScreenProps,
} from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Note as noteType } from "../../types/notesTypes";
import { useController, useForm } from "react-hook-form";
import { useThemeMode } from "@rneui/themed";
import { LinearGradient } from "expo-linear-gradient";

const ListScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<StackNavigation>) => {
  const drawerNavigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  const { mode, setMode } = useThemeMode();

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();

  const [userNotesFiltered, setUserNotesFiltered] = React.useState<noteType[]>(
    []
  );
  const [searchBar, setSearchBar] = React.useState<string>("");
  const { theme, updateTheme } = useTheme();

  const userData = useAppSelector((store) => store.authReducer.user);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placeholder: "Pesquisar Nota",
        cancelButtonText: "Cancelar",
        onChangeText: (event) => {
          setSearchBar(event.nativeEvent.text);
        },
        tintColor: mode == "dark" ? theme.colors.tintColor : theme.colors.text,
        hideWhenScrolling: true,
        textColor: theme.colors.text,
      },
    });
  }, [navigation, theme]);

  const {
    data: userNotes,
    isSuccess,
    isLoading,
    refetch,
    error,
  } = useGetAllNotesByUserIDQuery((userData?.user_Id as number) ?? 0);

  const handleLogOut = () => {
    return Alert.alert("Sair", "Tem certeza que deseja sair?", [
      {
        text: "Sim",
        onPress: async () => {
          dispatch(signOut());
          navigation.navigate("LoaderScreen");
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
        userName={userData?.full_name ?? ""}
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
      <StatusBar style={mode == "dark" ? "light" : "dark"} />
      <ScrollView
        style={{ backgroundColor: theme.colors.secondary }}
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
                    style={{
                      color: theme.colors.text,
                      textAlign: "center",
                      fontSize: 20,
                    }}
                  >
                    {searchBar !== ""
                      ? "Nenhuma nota encontrada."
                      : "Nenhuma nota a ser exibida."}
                  </Text>
                  {searchBar == "" ? (
                    <Button
                      variant="contained"
                      color={theme.colors.tintColor}
                      title="Adicionar nova nota"
                      onPress={() => {
                        navigation.navigate("CreateNote");
                      }}
                    />
                  ) : (
                    <></>
                  )}
                </View>
              )
            ) : (
              <Text style={{ color: theme.colors.text }}>
                Erro de conexão, favor logar novamente!
              </Text>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
      <LinearGradient
        colors={
          mode == "dark"
            ? ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 1)"]
            : ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255)"]
        }
        style={{ position: "absolute", bottom: 0, height: 90, width: "100%" }}
      ></LinearGradient>
      <SpeedDial
        isOpen={isOpen}
        icon={{
          name: "more-horiz",
          color: theme.colors.noteTitleColor,
          type: "material",
        }}
        openIcon={{
          name: "more-vert",
          color: theme.colors.noteTitleColor,
          type: "material",
        }}
        onOpen={() => setIsOpen(!isOpen)}
        onClose={() => setIsOpen(!isOpen)}
        color={theme.colors.tintColor}
        style={{
          shadowColor: "#707070",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        overlayColor="#00000042"
      >
        <SpeedDial.Action
          icon={{ name: "add", color: theme.colors.noteTitleColor }}
          title="Criar Nota"
          onPress={() => {
            navigation.navigate("CreateNote");
            setIsOpen(false);
          }}
          color={theme.colors.tintColor}
        />
        <></>
      </SpeedDial>
    </>
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
});

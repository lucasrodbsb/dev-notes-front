import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import React from "react";
import { StackScreenProps } from "@react-navigation/stack";
import { StackNavigation } from "../../stacks/MainStack";
import { StatusBar } from "expo-status-bar";
import {
  Colors,
  useTheme,
  useThemeMode,
  ListItem,
  Avatar,
} from "@rneui/themed";
import { Theme } from "@rneui/base";
import TouchableScale from "react-native-touchable-scale";
import { LinearGradient } from "expo-linear-gradient";
import CustomListItem from "../../components/CustomListItem";
import { Divider } from "react-native-elements";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { signOut } from "../../services/redux/slices/authSlice";
import { useDeleteAllNotesByUserIdMutation } from "../../services/redux/api/notesApi";
import Toast from "react-native-toast-message";
import { useDeleteUserByUserIdMutation } from "../../services/redux/api/authApi";

const SettingsScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<StackNavigation>) => {
  const { mode, setMode } = useThemeMode();
  const { theme, updateTheme } = useTheme();
  const dispatch = useAppDispatch();
  const [deleteAllNotesByUserId, responseDeleteAllNotesByUserId] =
    useDeleteAllNotesByUserIdMutation();

  const [deleteUserById, responseDeleteUserByID] =
    useDeleteUserByUserIdMutation();
  const userData = useAppSelector((store) => store.authReducer.user);

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

  const handleDeleteAllNotes = () => {
    return Alert.alert(
      "Deletar Notas",
      "Tem certeza que deseja deletar todas suas notas?",
      [
        {
          text: "Sim",
          onPress: async () => {
            deleteAllNotesByUserId({
              user_id: userData?.user_Id ?? 0,
            })
              .then(() => {
                Toast.show({
                  type: "success",
                  text1: "Êxito!",
                  text2: "Notas deletadas com sucesso!.",
                });
                navigation.navigate("LoaderScreen");
              })
              .catch(() => {
                Toast.show({
                  type: "error",
                  text1: "Erro!",
                  text2: "Erro ao deletar notas.",
                });
              });
          },
        },
        {
          text: "Cancelar",
        },
      ]
    );
  };

  const handleDeleteUser = () => {
    return Alert.alert(
      "Deletar Usuário",
      "Tem certeza que deseja deletar seu usuário?",
      [
        {
          text: "Sim",
          onPress: () => {
            return Alert.alert(
              "Você tem certeza?",
              "Essa ação não poderá ser desfeita.",
              [
                {
                  text: "Excluir",
                  onPress: async () => {
                    deleteAllNotesByUserId({
                      user_id: userData?.user_Id ?? 0,
                    })
                      .then(() => {
                        deleteUserById({
                          user_id: userData?.user_Id ?? 0,
                        }).then(async () => {
                          Toast.show({
                            type: "success",
                            text1: "Êxito!",
                            text2: "Usuário deletado com sucesso!.",
                          });
                          await AsyncStorage.removeItem("token");
                          navigation.navigate("LoaderScreen");
                        });
                      })
                      .catch(() => {
                        Toast.show({
                          type: "error",
                          text1: "Erro!",
                          text2: "Erro ao deletar usuário.",
                        });
                      });
                  },
                },
                {
                  text: "Cancelar",
                },
              ]
            );
          },
        },
        {
          text: "Cancelar",
        },
      ]
    );
  };

  return (
    <>
      <StatusBar style={mode == "dark" ? "light" : "dark"} />
      <ScrollView
        style={{ backgroundColor: theme.colors.secondary }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SafeAreaView style={styles(theme).container}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 10,
              paddingBottom: 30,
              paddingTop: 15,
            }}
          >
            <CustomListItem
              childrenProps={{
                onPress: () => {},
              }}
              title={`Informações Sobre o Sistema`}
            />
            <CustomListItem
              childrenProps={{
                onPress: () => {},
              }}
              title={`Fazer Uma Doação`}
            />

            <CustomListItem
              childrenProps={{
                onPress: () => {
                  handleLogOut();
                },
              }}
              title={`Sair`}
            />
            <View style={styles(theme).divider} />
            <CustomListItem
              childrenProps={{
                onPress: () => {
                  handleDeleteAllNotes();
                },
              }}
              danger
              title={`Deletar Todas as Notas`}
            />
            <CustomListItem
              childrenProps={{
                onPress: () => {
                  handleDeleteUser();
                },
              }}
              danger
              title={`Deletar Seu Usuário`}
            />
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

export default SettingsScreen;

const styles = (
  theme: {
    colors: Colors;
  } & Theme
) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingHorizontal: 15,
      paddingBottom: 15,
    },

    divider: {
      marginVertical: 20,
      height: 1,
      backgroundColor: theme.colors.divider,
      width: "100%",
    },
  });

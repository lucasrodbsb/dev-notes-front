import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Pressable,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import React, { PropsWithChildren, RefObject } from "react";
import Header from "../../components/Header";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { Button } from "@react-native-material/core";
import { Input } from "react-native-elements";
import { useForm, Controller, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  useAddNoteMutation,
  useEditNoteByIdMutation,
} from "../../services/redux/api/notesApi";
import { useAppSelector } from "../../hooks/reduxHooks";
import moment from "moment";
import Toast from "react-native-toast-message";
import { StackScreenProps } from "@react-navigation/stack";
import { StackNavigation } from "../../stacks/MainStack";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Colors, useTheme, useThemeMode } from "@rneui/themed";
import { Theme } from "@rneui/base";

const EditNoteScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<StackNavigation>) => {
  const drawerNavigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  type FormData = {
    title: string;
    noteBody: string;
  };

  const inputSchema = yup.object().shape({
    title: yup
      .string()
      .required("Valor inválido!")
      .min(3, "Mínimo de 3 caracteres!")
      .max(30, "Muitos caracteres!"),

    noteBody: yup
      .string()
      .required("Valor inválido!")
      .min(1, "Mínimo de 1 caracter!")
      .max(10000, "Muitos caracteres!"),
  });

  const methods = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(inputSchema),
    defaultValues: {
      title: route.params?.note_title ?? "",
      noteBody: route.params?.note_body ?? "",
    },
  });

  const [editNoteById, responseEditNoteById] = useEditNoteByIdMutation();

  const userData = useAppSelector((store) => store.authReducer.user);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const submitForm = async (data: FormData) => {
    let result;
    result = await editNoteById({
      note_id: route.params?.note_id ?? 0,
      user_id: userData?.user_Id ?? 0,
      datetime: moment().valueOf(),
      noteBody: data.noteBody.trim(),
      title: data.title.trim(),
    })
      .unwrap()
      .then((response) => {
        if (response.message) {
        }

        Toast.show({
          type: "success",
          text1: "Êxito!",
          text2: response.message,
        });

        navigation.goBack();
      })
      .catch((err) => {
        console.log(
          JSON.stringify(
            responseEditNoteById.isError ? responseEditNoteById.error : ""
          )
        );

        Toast.show({
          type: "error",
          text1: "Erro!",
          text2: responseEditNoteById.data?.message,
        });
      });
  };

  const { theme, updateTheme } = useTheme();
  const { mode, setMode } = useThemeMode();

  return (
    <>
      <StatusBar style={mode == "dark" ? "light" : "dark"} />
       
        <ScrollView
          style={{ backgroundColor: theme.colors.secondary }}
          contentContainerStyle={{ paddingTop: 20 }}
          contentInsetAdjustmentBehavior="automatic"
        >
          
          <SafeAreaView style={styles(theme).container}>
            <FormProvider {...methods}>
            <KeyboardAvoidingView behavior="position"></KeyboardAvoidingView>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Título:"
                    labelStyle={{
                      padding: 5,
                      color: theme.colors.textSecondary,
                      fontWeight: "500",
                    }}
                    InputComponent={TextInput}
                    inputStyle={styles(theme).inputStyle}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    errorStyle={{ color: theme.colors.error }}
                    errorMessage={errors.title?.message}
                    inputContainerStyle={{ borderColor: "transparent" }}
                    containerStyle={{ paddingHorizontal: 0 }}
                  />
                )}
                name="title"
              />
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Corpo:"
                    labelStyle={{
                      padding: 5,
                      color: theme.colors.textSecondary,
                      fontWeight: "500",
                    }}
                    secureTextEntry={false}
                    InputComponent={TextInput}
                    inputStyle={styles(theme).textAreaStyle}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    errorStyle={{ color: theme.colors.error }}
                    errorMessage={errors.noteBody?.message}
                    multiline={true}
                    inputContainerStyle={{ borderColor: "transparent" }}
                    containerStyle={{ paddingHorizontal: 0 }}
                  />
                )}
                name="noteBody"
              />

              <Button
                color={theme.colors.tintColor}
                style={{ marginTop: 20 }}
                title={"Salvar nota"}
                onPress={handleSubmit(submitForm)}
                variant="contained"
              />
            </FormProvider>
          </SafeAreaView>
        </ScrollView>
    </>
  );
};

export default EditNoteScreen;

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
    textAreaStyle: {
      borderColor: theme.colors.divider,
      borderWidth: 0.5,
      color: theme.colors.text,
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      padding: 15,
      paddingTop: 10,
      paddingBottom: 10,
      minHeight: 200,
      height: 400,
      marginHorizontal: 0,
      shadowColor: theme.colors.divider,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    inputStyle: {
      borderColor: theme.colors.divider,
      borderWidth: 0.5,
      color: theme.colors.text,
      padding: 15,
      paddingTop: 10,
      paddingBottom: 10,
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      shadowColor: theme.colors.divider,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  });

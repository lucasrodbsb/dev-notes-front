import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Pressable,
  ScrollView,
  SafeAreaView,
  TextInput,
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
import { useAddNoteMutation } from "../../services/redux/api/notesApi";
import { useAppSelector } from "../../hooks/reduxHooks";
import moment from "moment";
import Toast from "react-native-toast-message";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { StackScreenProps } from "@react-navigation/stack";
import { StackNavigation } from "../../stacks/MainStack";
import { StatusBar } from "expo-status-bar";
import { Colors, useTheme, useThemeMode } from "@rneui/themed";
import { Theme } from "@rneui/base";

const CreateNoteScreen = ({
  navigation,
  route,
}: StackScreenProps<StackNavigation>) => {
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
      title: "",
      noteBody: "",
    },
  });

  const [addNote, addNoteResults] = useAddNoteMutation();

  const userData = useAppSelector((store) => store.authReducer.user);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const submitForm = async (data: FormData) => {
    let result;
    result = await addNote({
      title: data.title.trim(),
      noteBody: data.noteBody.trim(),
      user_id: userData?.user_Id ?? 0,
      datetime: moment().valueOf(),
    })
      .unwrap()
      .then((response) => {
        Toast.show({
          type: "success",
          text1: "Êxito!",
          text2: response.message,
        });

        navigation.goBack();
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: "Erro!",
          text2: addNoteResults.data?.message,
        });
      });
  };

  const { theme, updateTheme } = useTheme();
  const {mode, setMode} = useThemeMode()

  return (
    <>
      <StatusBar style={mode == 'dark' ? 'light' : 'dark' } />
      <ScrollView
        style={{ backgroundColor: theme.colors.secondary }}
        contentContainerStyle={{ paddingTop: 20 }}
        bounces={true}
        contentInsetAdjustmentBehavior="automatic"
      >
        <SafeAreaView style={styles(theme).container}>
          <FormProvider {...methods}>
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
                  errorStyle={{color: theme.colors.error}}
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
                  style={{}}
                  inputStyle={styles(theme).textAreaStyle}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorStyle={{color: theme.colors.error}}
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
              title={"Adicionar nota"}
              onPress={handleSubmit(submitForm)}
              variant="contained"
            />
          </FormProvider>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

export default CreateNoteScreen;

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
      borderWidth: .5,
      color: theme.colors.text,
      backgroundColor: theme.colors.primary,
      borderRadius: 10,
      padding: 15,
      paddingTop: 10,
      paddingBottom: 10,
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
      borderWidth: .5,
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
    }
  });

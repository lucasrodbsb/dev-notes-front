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


const CreateNoteScreen = ({ navigation, route }: StackScreenProps<StackNavigation>) => {

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

  const [ addNote, addNoteResults ] = useAddNoteMutation();

  const userData = useAppSelector((store)=> store.authReducer.user)

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const submitForm = async (data: FormData) => {
    let result;
    result = await addNote({
      title: data.title,
      noteBody: data.noteBody,
      user_id: userData?.user_Id ?? 0,
      datetime: moment().valueOf()
    })
    .unwrap()
    .then((response)=>{
      Toast.show({
        type: "success",
        text1: "Êxito!",
        text2: response.message
      });

      navigation.goBack()

    }).catch((err)=>{
      Toast.show({
        type: "error",
        text1: "Erro!",
        text2: addNoteResults.data?.message
      })
    })
  };

  return (
    <>
      <Header title={"Criar nota"} openDrawer={() => drawerNavigation.openDrawer()} />
      <StatusBar style="light" />
      <ScrollView style={{ backgroundColor: "#141414"}} contentContainerStyle={{paddingTop: 20}} bounces={false}>
        <SafeAreaView style={styles.container}>
          {/* <Button title={'Editar Nota'} color='#fff' style={{width: 150}} onPress={()=> navigation.navigate("EditNote")}/> */}
          <FormProvider {...methods}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  // placeholder="Título da nota"
                  label="Título:"
                  labelStyle={{padding:5, color: "#fff", fontWeight: "500"}}
                  InputComponent={TextInput}
                  inputStyle={{
                    color: "white",
                    backgroundColor: "#282828",
                    borderRadius: 10,
                    padding: 15,
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorStyle={{ color: "#f16868" }}
                  errorMessage={errors.title?.message}
                  inputContainerStyle={{ borderColor: "transparent" }}
                  containerStyle={{paddingHorizontal: 0}}
                />
              )}
              name="title"
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  // placeholder="Corpo da nota"
                  label="Corpo:"
                  labelStyle={{padding:5, color: "#fff", fontWeight: "500"}}
                  secureTextEntry={false}
                  InputComponent={TextInput}
                  style={{
                    height: 400,
                    backgroundColor: "#282828",
                    borderRadius: 10,
                    marginHorizontal: 0
                  }}
                  inputStyle={{
                    color: "white",
                    padding: 15,
                    paddingTop: 10,
                    paddingBottom: 10,
                  }}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorStyle={{ color: "#f16868" }}
                  errorMessage={errors.noteBody?.message}
                  multiline={true}
                  inputContainerStyle={{ borderColor: "transparent" }}
                  containerStyle={{paddingHorizontal: 0}}
                />
              )}
              name="noteBody"
            />
            <Button
              color="#fff"
              style={{ marginTop: 20, }}
              title={"Adicionar nota"}

              onPress={handleSubmit(submitForm)}
              variant="contained"
            />
            <Button
              color="#fff"
              style={{ marginTop: 50, }}
              title={"Voltar"}

              onPress={()=>{
                methods.reset();
                navigation.goBack()
              }}
              variant="text"
            />
          </FormProvider>
          {/* <Button title={"Voltar"} onPress={() => navig.goBack()} /> */}
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

export default CreateNoteScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#141414",
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
});


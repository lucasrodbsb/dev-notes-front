import { View, StyleSheet, TextInput, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation, StackTypes } from "../../stacks/MainStack";
import { NativeStackNavigationProp, NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackNavigationHelpers, StackScreenProps } from "@react-navigation/stack/lib/typescript/src/types";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "@react-native-material/core";
import Note from "../../components/Note";
import { SafeAreaView } from "react-native-safe-area-context";
import { SpeedDial, Input, Tile, Text } from "@rneui/themed";
import React, { PropsWithChildren, RefObject } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { StatusBar } from "expo-status-bar";
import { useAddNewUserMutation } from "../../services/redux/api/authApi";
import Toast from "react-native-toast-message";

const SignInScreen = ({ navigation, route }: NativeStackScreenProps<StackNavigation>) => {


  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const usernameInput = React.createRef() as RefObject<PropsWithChildren<any>>;
  const passwordInput = React.createRef() as RefObject<PropsWithChildren<any>>;
  const confirmPasswordInput = React.createRef() as RefObject<
    PropsWithChildren<any>
  >;
  const fullnameInput = React.createRef() as RefObject<PropsWithChildren<any>>;

  const initialTypeState: { name: keyof FormData; state: boolean }[] = [
    {
      name: "fullname",
      state: true,
    },
    {
      name: "username",
      state: true,
    },
    {
      name: "password",
      state: true,
    },
    {
      name: "confirmPassword",
      state: true,
    },
    {
      name: "email",
      state: true,
    },
  ];

  const [textFieldsType, setTextFieldsType] =
    React.useState<{ name: keyof FormData; state: boolean }[]>(
      initialTypeState
    );

  type FormData = {
    fullname: string;
    username: string;
    password: string;
    confirmPassword: string;
    email: string;
  };

  const handleTextFieldsType = ({
    name,
    state,
  }: {
    name: keyof FormData;
    state: boolean;
  }) => {
    let newState = [...textFieldsType].filter((item) => item.name !== name);
    newState = [...newState, { name, state }];
    setTextFieldsType(newState);
  };

  const getStateByName = (name: string) => {
    return textFieldsType.find((item) => name == item.name);
  };

  const inputSchema = yup.object().shape({
    username: yup
      .string()
      .required("Valor inválido!")
      .min(3, "Mínimo de 3 caracteres!")
      .max(20, "Muitos caracteres!"),
    password: yup
      .string()
      .required("Valor inválido!")
      .min(8, "Mínimo de 8 caracteres!")
      .max(30, "Muitos caracteres!")
      .matches(/[A-Z]/, "Ao menos uma letra maiúscula é necessária!")
      .matches(/[0-9]/, "Ao menos um número é necessário!"),
    confirmPassword: yup
      .string()
      .required("Valor inválido!")
      .test(
        "passwordConfirmCheck",
        "Valor precisa ser igual ao campo de senha!",
        (value) => {
          if (value == methods.watch("password")) {
            return true;
          } else {
            return false;
          }
        }
      ),
    fullname: yup
      .string()
      .required("Valor inválido!")
      .matches(/^[aA-zZ\s]+$/, "Apneas letras são permitidas!"),
    email: yup
      .string()
      .required("Valor inválido!")
      .email("Coloque um email válido!"),
  });

  const methods = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(inputSchema),
    defaultValues: {
      fullname: "",
      username: "",
      password: "",
      confirmPassword: "",
      email: "",
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const [addNewUser, addNewUserResponse] = useAddNewUserMutation();

  const submitForm = async (data: FormData) => {
    let result;

    result = await addNewUser({
      username: data.username,
      full_name: data.fullname,
      email: data.email,
      password: data.password,
    })
      .unwrap()
      .then((response) => {
        switch (response.status) {
          case "success":
            Toast.show({
              type: "success",
              text1: "Êxito!",
              text2: response.message,
            });
            navigation.goBack();
            break;
          case "unauthorized":
            Toast.show({
              type: "error",
              text1: "Erro!",
              text2: response.message,
            });
            break;
        }
      })
      .catch((err) => {
        Toast.show({
          type: "error",
          text1: "Erro!",
          text2: err.data?.message,
        });

        console.log(err);
      });
  };

  return (
    <ScrollView style={{ backgroundColor: "#141414", height: "100%" }}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Text h4 h4Style={styles.title}>
            Preencha seus dados:
          </Text>
          <FormProvider {...methods}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Nome Completo"
                  ref={fullnameInput}
                  InputComponent={TextInput}
                  inputStyle={{ color: "white" }}
                  rightIcon={
                    methods.watch("fullname")?.length ? (
                      <Icon
                        name="close"
                        color="#ffffff42"
                        size={20}
                        onPress={() => {
                          methods.resetField("fullname");
                        }}
                      />
                    ) : (
                      <></>
                    )
                  }
                  leftIcon={<Icon name="account" color="#fff" size={20} />}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorStyle={{ color: "#f16868" }}
                  errorMessage={errors.fullname?.message}
                />
              )}
              name="fullname"
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Email"
                  ref={fullnameInput}
                  InputComponent={TextInput}
                  inputStyle={{ color: "white" }}
                  rightIcon={
                    methods.watch("email")?.length ? (
                      <Icon
                        name="close"
                        color="#ffffff42"
                        size={20}
                        onPress={() => {
                          methods.resetField("email");
                        }}
                      />
                    ) : (
                      <></>
                    )
                  }
                  leftIcon={<Icon name="email" color="#fff" size={20} />}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorStyle={{ color: "#f16868" }}
                  errorMessage={errors.email?.message}
                />
              )}
              name="email"
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Login"
                  ref={usernameInput}
                  InputComponent={TextInput}
                  inputStyle={{ color: "white" }}
                  rightIcon={
                    methods.watch("username")?.length ? (
                      <Icon
                        name="close"
                        color="#ffffff42"
                        size={20}
                        onPress={() => {
                          methods.resetField("username");
                        }}
                      />
                    ) : (
                      <></>
                    )
                  }
                  leftIcon={
                    <Icon name="account-outline" color="#fff" size={20} />
                  }
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorStyle={{ color: "#f16868" }}
                  errorMessage={errors.username?.message}
                />
              )}
              name="username"
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Senha"
                  secureTextEntry={getStateByName("password")?.state}
                  ref={passwordInput}
                  InputComponent={TextInput}
                  inputStyle={{ color: "white" }}
                  rightIcon={
                    methods.watch("password")?.length ? (
                      <Icon
                        name="eye"
                        color="#ffffff42"
                        size={20}
                        onPress={() =>
                          handleTextFieldsType({
                            name: "password",
                            state: !!!getStateByName("password")?.state,
                          })
                        }
                      />
                    ) : (
                      <></>
                    )
                  }
                  leftIcon={<Icon name="lock-outline" color="#fff" size={20} />}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorStyle={{ color: "#f16868" }}
                  errorMessage={errors.password?.message}
                />
              )}
              name="password"
            />
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Confirmar Senha"
                  secureTextEntry={getStateByName("confirmPassword")?.state}
                  ref={confirmPasswordInput}
                  InputComponent={TextInput}
                  inputStyle={{ color: "white" }}
                  rightIcon={
                    methods.watch("confirmPassword")?.length ? (
                      <Icon
                        name="close"
                        color="#ffffff42"
                        size={20}
                        onPress={() => {
                          methods.resetField("confirmPassword");
                        }}
                      />
                    ) : (
                      <></>
                    )
                  }
                  leftIcon={<Icon name="lock" color="#fff" size={20} />}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorStyle={{ color: "#f16868" }}
                  errorMessage={errors.confirmPassword?.message}
                />
              )}
              name="confirmPassword"
            />
            <Button
              color="#fff"
              style={{ marginTop: 25 }}
              title={"Cadastrar"}
              onPress={handleSubmit(submitForm)}
            />
          </FormProvider>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingBottom: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  formContainer: {
    // backgroundColor: "#503838",
    borderRadius: 7,
    width: "100%",
    paddingTop: 30,
  },

  elevation: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 30,
    // fontVariant: ["small-caps"],
    fontWeight: "400",
  },

  subtitle: {
    fontWeight: "400",
    color: "#ffd52e",
  },
});

// React.useEffect(()=>{
//     const promessa = new Promise<void>((resolve, reject)=>{
//         setTimeout(function(){ }, 3000);
//         if(new Date().valueOf() % 2 == 0){
//             resolve()
//         }else{
//             reject()
//         }
//     })

//     Promise.resolve(promessa).then(alert).catch(alert)
//   })

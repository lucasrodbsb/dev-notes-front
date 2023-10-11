import { View, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation, StackTypes } from "../../stacks/MainStack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "@react-native-material/core";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input, Text } from "@rneui/themed";
import React, { PropsWithChildren, RefObject } from "react";
import { useForm, Controller, FormProvider } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { StatusBar } from "expo-status-bar";
import { useLoginUserMutation } from "../../services/redux/api/authApi";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { storage } from "../../services/mmkv";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StackScreenProps } from "@react-navigation/stack";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

const WelcomeScreen = ({ navigation, route }: NativeStackScreenProps<StackNavigation>) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const emailInput = React.createRef() as RefObject<PropsWithChildren<any>>;
  const passwordInput = React.createRef() as RefObject<PropsWithChildren<any>>;

  const userData = useAppSelector((store) => store.authReducer.user);

  const dispatch = useAppDispatch();

  type FormData = {
    email: string;
    password: string;
  };

  const inputSchema = yup.object().shape({
    email: yup
      .string()
      .required("Valor inválido!")
      .min(3, "Mínimo de 3 caracteres!")
      .max(30, "Muitos caracteres!"),

    password: yup
      .string()
      .required("Valor inválido!")
      .min(3, "Mínimo de 3 caracteres!")
      .max(20, "Muitos caracteres!"),
  });

  const methods = useForm<FormData>({
    mode: "onChange",
    resolver: yupResolver(inputSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const [
    loginUser,
    {
      data: dataToken,
      isError: isLoginError,
      isLoading: isLoginLoading,
      isSuccess: isLoginSuccess,
      error: loginError,
    },
  ] = useLoginUserMutation();

  const submitForm = async (data: FormData) => {
    let result;

    result = await loginUser({
      email: data.email,
      password: data.password,
    })
      .unwrap()
      .then(async (dataToken) => {
        try {
          await AsyncStorage.setItem("token", dataToken.token);
          navigation.navigate("LoaderScreen");
          Toast.show({
            type: "success",
            text1: "Êxito!",
            text2: `Usuário logado com sucesso!`,
          });
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Erro!",
            text2: `${JSON.stringify(error)}`,
          });
        }
        console.log(await AsyncStorage.getItem("token"));
      })
      .catch((loginError) => {
        Toast.show({
          type: "error",
          text1: "Erro!",
          text2: `${JSON.stringify(loginError.data.status).replaceAll(
            '"',
            ""
          )}`,
        });
      });
  };

  return (
    <View style={{ backgroundColor: "#141414", height: "100%" }}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        <View style={styles.formContainer}>
          <Text h1 h1Style={styles.title}>
            Dev
            <Text h1 h1Style={styles.subtitle}>
              Notes.
            </Text>
          </Text>
          <FormProvider {...methods}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Login"
                  ref={emailInput}
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
                  leftIcon={
                    <Icon name="account-outline" color="#fff" size={20} />
                  }
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
                  placeholder="Senha"
                  secureTextEntry={true}
                  ref={passwordInput}
                  InputComponent={TextInput}
                  inputStyle={{ color: "white" }}
                  rightIcon={
                    methods.watch("password")?.length ? (
                      <Icon
                        name="close"
                        color="#ffffff42"
                        size={20}
                        onPress={() => {
                          methods.resetField("password");
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
                  errorMessage={errors.password?.message}
                />
              )}
              name="password"
            />
            <Button
              color="#fff"
              style={{ marginTop: 25 }}
              title={"Entrar"}
              onPress={handleSubmit(submitForm)}
            />
          </FormProvider>
          <Text
            style={styles.newAccountText}
            onPress={() => navigation.navigate("SignIn")}
          >
            Ainda não possui sua conta?
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WelcomeScreen;

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
    marginBottom: 40,
    fontVariant: ["small-caps"],
    fontWeight: "700",
  },

  subtitle: {
    fontWeight: "400",
    color: "#ffd52e",
  },

  newAccountText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
    fontSize: 15,
  },
});

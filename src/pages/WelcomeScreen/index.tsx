import { View, StyleSheet, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation, StackTypes } from "../../stacks/MainStack";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "@react-native-material/core";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Colors,
  Input,
  Text,
  ThemeMode,
  useTheme,
  useThemeMode,
} from "@rneui/themed";
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
import { Theme } from "@rneui/base";

const WelcomeScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<StackNavigation>) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const usernameInput = React.createRef() as RefObject<PropsWithChildren<any>>;
  const passwordInput = React.createRef() as RefObject<PropsWithChildren<any>>;

  const userData = useAppSelector((store) => store.authReducer.user);

  const dispatch = useAppDispatch();

  type FormData = {
    username: string;
    password: string;
  };

  const { theme, updateTheme } = useTheme();
  const { mode, setMode } = useThemeMode();

  const inputSchema = yup.object().shape({
    username: yup
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
      username: "",
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
      username: data.username,
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
    <View
      style={{
        backgroundColor: mode == "dark" ? theme.colors.primary : "#ffffff",
        height: "100%",
      }}
    >
      <StatusBar style={mode == "dark" ? "light" : "dark"} />
      <SafeAreaView style={styles(theme, mode).container}>
        <View style={styles(theme, mode).formContainer}>
          <Text h1 h1Style={styles(theme, mode).title}>
            Dev
            <Text h1 h1Style={styles(theme, mode).subtitle}>
              Notes.
            </Text>
          </Text>
          <FormProvider {...methods}>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  placeholder="Login"
                  ref={usernameInput}
                  InputComponent={TextInput}
                  inputStyle={{ color: theme.colors.text }}
                  cursorColor={theme.colors.text}
                  rightIcon={
                    methods.watch("username")?.length ? (
                      <Icon
                        name="close"
                        color={theme.colors.text}
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
                    <Icon
                      name="account-outline"
                      color={theme.colors.text}
                      size={20}
                    />
                  }
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorStyle={{ color: theme.colors.error }}
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
                  secureTextEntry={true}
                  ref={passwordInput}
                  InputComponent={TextInput}
                  inputStyle={{ color: theme.colors.text }}
                  cursorColor={theme.colors.text}
                  rightIcon={
                    methods.watch("password")?.length ? (
                      <Icon
                        name="close"
                        color={theme.colors.text}
                        size={20}
                        onPress={() => {
                          methods.resetField("password");
                        }}
                      />
                    ) : (
                      <></>
                    )
                  }
                  leftIcon={
                    <Icon name="lock" color={theme.colors.text} size={20} />
                  }
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  errorStyle={{ color: theme.colors.error }}
                  errorMessage={errors.password?.message}
                />
              )}
              name="password"
            />
            <Button
              color={theme.colors.tintColor}
              style={{ marginTop: 25 }}
              title={"Entrar"}
              onPress={handleSubmit(submitForm)}
            />
          </FormProvider>
          <Text
            style={styles(theme, mode).newAccountText}
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

const styles = (
  theme: {
    colors: Colors;
  } & Theme,
  mode: ThemeMode
) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 15,
      paddingBottom: 15,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
    },

    formContainer: {
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
      color: mode == "dark" ? theme.colors.text : theme.colors.tintColor,
      textAlign: "center",
      marginBottom: 40,
      fontVariant: ["small-caps"],
      fontWeight: "700",
    },

    subtitle: {
      fontWeight: "400",
      color: mode == "dark" ? theme.colors.tintColor : theme.colors.text,
      shadowColor: "#707070",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },

    newAccountText: {
      color: theme.colors.text,
      textAlign: "center",
      marginTop: 50,
      fontSize: 15,
    },
  });

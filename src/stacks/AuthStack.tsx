import React from "react";
import ListScreen from "../pages/ListScreen";
import EditNoteScreen from "../pages/CreateNoteScreen";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import WelcomeScreen from "../pages/WelcomeScreen";
import SignInScreen from "../pages/SignInScreen";
import MainStack from "./MainStack";
import DrawerNavigation from "./DrawerNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppSelector } from "../hooks/reduxHooks";
import { StackScreenProps } from "@react-navigation/stack";
import { Icon } from "@react-native-material/core";
import { useTheme, useThemeMode } from "@rneui/themed";

export type StackNavigation = {
  [key: string]: undefined;
};

export type StackTypes = NativeStackNavigationProp<StackNavigation>;

const Stack = createNativeStackNavigator<StackNavigation>();

const AuthStack = ({navigation, route}: StackScreenProps<StackNavigation>) => {
  const userData = useAppSelector((store) => store.authReducer.user);

  const {mode, setMode} = useThemeMode()
  const {theme, updateTheme} = useTheme()

  const customHeader: NativeStackNavigationOptions = {
    headerTintColor: theme.colors.text,
    headerShown: true, 
    animation: 'simple_push',
    headerStyle: {
      backgroundColor: theme.colors.primary,
    },
    headerTitleStyle: {
      fontSize: 20
    },
    headerBackTitleVisible: false,
  }

  return (
    <Stack.Navigator
      screenOptions={{ animation: "simple_push" }}
    >
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{
          title: "WelcomeScreen",
          gestureEnabled: false,
          headerShown: false
        }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          title: "Cadastro",
          ...customHeader
        }}
      />
    </Stack.Navigator>
  );
};
export default AuthStack;

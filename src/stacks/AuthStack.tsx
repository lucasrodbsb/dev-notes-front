import React from "react";
import ListScreen from "../pages/ListScreen";
import EditNoteScreen from "../pages/CreateNoteScreen";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import WelcomeScreen from "../pages/WelcomeScreen";
import SignInScreen from "../pages/SignInScreen";
import MainStack from "./MainStack";
import DrawerNavigation from "./DrawerNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppSelector } from "../hooks/reduxHooks";
import { StackScreenProps } from "@react-navigation/stack";

export type StackNavigation = {
  [key: string]: undefined;
};

export type StackTypes = NativeStackNavigationProp<StackNavigation>;

const Stack = createNativeStackNavigator<StackNavigation>();

const AuthStack = ({navigation, route}: StackScreenProps<StackNavigation>) => {
  const userData = useAppSelector((store) => store.authReducer.user);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "simple_push" }}
    >
      <Stack.Screen
        name="WelcomeScreen"
        component={WelcomeScreen}
        options={{
          title: "WelcomeScreen",
          gestureEnabled: false
        }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{
          title: "SignIn",
          
        }}
      />
    </Stack.Navigator>
  );
};
export default AuthStack;

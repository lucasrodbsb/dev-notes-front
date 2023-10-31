import React from "react";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import DrawerNavigation from "./DrawerNavigation";
import { useAppSelector } from "../hooks/reduxHooks";
import LoaderScreen from "../pages/LoaderScreen";
import AuthStack from "./AuthStack";

export type StackNavigation = {
  [key: string]: undefined;
};

export type StackTypes = NativeStackNavigationProp<StackNavigation>;

const Stack = createNativeStackNavigator<StackNavigation>();

const LoaderStack = () => {
  const userData = useAppSelector((store) => store.authReducer?.user);

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: "simple_push" }}
    >
      <Stack.Screen
        name="LoaderScreen"
        component={LoaderScreen}
        options={{
          title: "LoaderScreen",
          gestureEnabled: false
        }}
      />
      <Stack.Screen
        name="LogedScreen"
        component={DrawerNavigation}
        options={{
          title: "LogedScreen",
          gestureEnabled: false
        }}
      />
      <Stack.Screen
        name="LoginScreen"
        component={AuthStack}
        options={{
          title: "LoginScreen",
          gestureEnabled: false
        }}
      />
    </Stack.Navigator>
  );
};
export default LoaderStack;

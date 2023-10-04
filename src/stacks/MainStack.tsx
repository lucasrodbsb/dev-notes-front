import { StackActionHelpers } from "@react-navigation/native";
import React from "react";
import ListScreen from "../pages/ListScreen";
import EditNoteScreen from "../pages/EditNoteScreen";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { useAppSelector } from "../hooks/reduxHooks";
import CreateNoteScreen from "../pages/CreateNoteScreen";

export type StackNavigation = {
  [key: string]: undefined | {
    note_id: number,
    note_title: string,
    note_body: string
  };
};

export type MainStackParams = {
  List: undefined,
  CreateNote: undefined,
  EditNote: {
    note_id: number,
    note_title: string,
    note_body: string
  }
}

export type StackTypes = NativeStackNavigationProp<StackNavigation>;

const Stack = createNativeStackNavigator<MainStackParams>();

const MainStack = () => {

  const userData = useAppSelector((store)=> store.authReducer.user);

  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: 'simple_push'}} initialRouteName="List"  >
      <Stack.Screen
        name="List"
        component={ListScreen}
        options={{
          title: userData?.full_name,
        }}
        
      />
      <Stack.Screen
        name="CreateNote"
        component={CreateNoteScreen}
        options={{ title: "Criar Nota" }}
      />
      <Stack.Screen
        name="EditNote"
        component={EditNoteScreen}
        options={{ title: "Editar Nota" }}
      />
    </Stack.Navigator>
  );
};
export default MainStack;

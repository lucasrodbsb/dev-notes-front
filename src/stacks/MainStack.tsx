import { ParamListBase, StackActionHelpers, useNavigation } from "@react-navigation/native";
import React from "react";
import ListScreen from "../pages/ListScreen";
import EditNoteScreen from "../pages/EditNoteScreen";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from "@react-navigation/native-stack";
import { useAppSelector } from "../hooks/reduxHooks";
import CreateNoteScreen from "../pages/CreateNoteScreen";
import Header from "../components/Header";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { StackScreenProps } from "@react-navigation/stack";
import { Avatar } from "react-native-elements";
import { transparent } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

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

const MainStack = ({navigation, route}: StackScreenProps<StackNavigation>) => {

  const userData = useAppSelector((store)=> store.authReducer.user);
  const drawerNavigation  = useNavigation<DrawerNavigationProp<ParamListBase>>();

  const getInitialsFromFullName = (): string  => {
    if(userData){
      return userData.full_name.split(" ")[0][0] + (userData.full_name.split(" ")?.at(1)?.at(0) ?? "")
    } else {
      return ""
    }
  }

  const customHeader: NativeStackNavigationOptions = {
    headerTintColor: "#fff",
    headerShown: true, 
    animation: 'simple_push',
    headerStyle: {
      backgroundColor: '#282828',
    },
    headerTitleStyle: {
      fontSize: 20
    },
    headerBackTitleVisible: false,
    headerRight: (props) => (<Icon name="menu" color="#fff" size={30} onPress={()=> drawerNavigation.openDrawer()}/> ),
  }

  const listScreenOptions: NativeStackNavigationOptions = {
    ...customHeader,
    title: `Olá, ${userData?.full_name.split(" ")[0]}`,
    headerLargeTitle: true,
    gestureEnabled: false,
    headerLeft: (props) => {
      return <Avatar 
        title={getInitialsFromFullName()}
        size={35}
        rounded
        containerStyle={{ backgroundColor: "#3d4db7" }}
      />
    },
  }

  return (
    <Stack.Navigator screenOptions={customHeader} initialRouteName="List" >
      <Stack.Screen
        name="List"
        component={ListScreen}
        options={listScreenOptions}
        
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

import {
    ParamListBase,
    StackActionHelpers,
    useNavigation,
  } from "@react-navigation/native";
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
  import { useTheme, useThemeMode } from "@rneui/themed";
  import { HeaderButtonProps } from "@react-navigation/native-stack/lib/typescript/src/types";
  import { generateColor } from "../helpers";
import SettingsScreen from "../pages/SettingsScreen";
  
  export type StackNavigation = {
    [key: string]:
      | undefined
      | {
          note_id: number;
          note_title: string;
          note_body: string;
        };
  };
  
  export type ConfigStackParams = {
    MainSettings: undefined;
  };
  
  export type StackTypes = NativeStackNavigationProp<StackNavigation>;
  
  const Stack = createNativeStackNavigator<ConfigStackParams>();
  
  const ConfigStack = ({
    navigation,
    route,
  }: StackScreenProps<StackNavigation>) => {
    const userData = useAppSelector((store) => store.authReducer.user);
    const drawerNavigation = useNavigation<DrawerNavigationProp<ParamListBase>>();
  
    const getInitialsFromFullName = (): string => {
      if (userData) {
        return (
          userData.full_name.split(" ")[0][0] +
          (userData.full_name.split(" ")?.at(1)?.at(0) ?? "")
        );
      } else {
        return "";
      }
    };
  
    const { mode, setMode } = useThemeMode();
    const { theme, updateTheme } = useTheme();
  
    const customHeader: NativeStackNavigationOptions = {
      headerTintColor: theme.colors.text,
      headerShown: true,
      animation: "simple_push",
      headerStyle: {
        backgroundColor: theme.colors.primary,
      },
      headerTitleStyle: {
        fontSize: 20,
      },
      headerBackTitleVisible: false,
    };
  
    const MainSettingsOptions: NativeStackNavigationOptions = {
      ...customHeader,
      title: `Configurações`,
      headerLargeTitle: true,
      gestureEnabled: false,
      headerRight: (props: HeaderButtonProps) => {
        return (
          <Avatar
            title={getInitialsFromFullName()}
            size={30}
            rounded
            containerStyle={{
              backgroundColor:
                generateColor(userData?.user_Id ?? 0) ?? theme.colors.primary,
            }}
            onPress={() => {
              drawerNavigation.openDrawer();
            }}
          />
        );
      },
    };
  
    return (
      <Stack.Navigator screenOptions={customHeader} initialRouteName="MainSettings">
        <Stack.Screen
          name="MainSettings"
          component={SettingsScreen}
          options={MainSettingsOptions}
        />
      </Stack.Navigator>
    );
  };
  export default ConfigStack;
  
import { View, StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { StackNavigation, StackTypes } from "../../stacks/MainStack";
import { Button } from "@react-native-material/core";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch } from "../../hooks/reduxHooks";
import { storage } from "../../services/mmkv";
import jwtDecode from "jwt-decode";
import { setUserData, User } from "../../services/redux/slices/authSlice";
import { StackScreenProps } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTheme, useThemeMode } from "@rneui/themed";

const LoaderScreen = ({ navigation, route }: NativeStackScreenProps<StackNavigation>) => {

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();

  useFocusEffect(() => {
    (async ()=>{
      let activeToken = await AsyncStorage.getItem("token");
      if(!!!activeToken){
        navigation.navigate("LoginScreen");
      } else {
        let decoded: User = jwtDecode(activeToken) ?? ""
        dispatch(setUserData(decoded))
        navigation.navigate("LogedScreen")
      }
    })()
  });

  const {mode, setMode} = useThemeMode()
  const {theme, updateTheme} = useTheme()

  return (
    <>
    <StatusBar style={mode == 'dark' ? 'light' : 'dark' } />
      <View style={{ backgroundColor: theme.colors.primary, height: "100%" }}>
      
        <SafeAreaView style={styles.container}>
          <View
            style={{
              display: "flex",
              gap: 10,
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator size={"large"} color={mode == 'light' ? theme.colors.text : theme.colors.tintColor}/>
          </View>
        </SafeAreaView>
      </View>
    </>
  );
};

export default LoaderScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  inputContainer: {
    marginHorizontal: 20,
    backgroundColor: "white",
    marginVertical: 20,
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "90%",
    height: "5%",
    borderRadius: 28,
    color: "black",
  },
});

{
  /* <Button title='Editar Nota' onPress={()=> navigate.navigate('EditNote')} />
<Button title="abrir drawer" /> */
}

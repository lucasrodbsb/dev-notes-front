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

const LoaderScreen = ({ navigation, route }: StackScreenProps<StackNavigation>) => {
  const navigate = useNavigation<StackTypes>();

  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const dispatch = useAppDispatch();

  useFocusEffect(() => {
    let activeToken = storage.getString("token");
    let decoded: User;

    if (activeToken == undefined) {
      navigate.navigate("LoginScreen");
    } else {
      decoded = jwtDecode(activeToken);
      dispatch(setUserData(decoded));
      navigate.navigate("LogedScreen");
    }
  });

  return (
    <>
      <View style={{ backgroundColor: "#141414", height: "100%" }}>
      <StatusBar style="light" />
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
            <ActivityIndicator size={"large"} color="#ffd52e" />
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
    backgroundColor: "#141414",
    // backgroundColor: "#4a1313",

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

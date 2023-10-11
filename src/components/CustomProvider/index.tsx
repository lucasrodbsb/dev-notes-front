import { View, Text, Alert } from "react-native";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserData, User } from "../../services/redux/slices/authSlice";
import jwtDecode from "jwt-decode";
import AuthStack from "../../stacks/AuthStack";
import DrawerNavigation from "../../stacks/DrawerNavigation";
import { useNavigation } from "@react-navigation/native";
import { storage } from "../../services/mmkv";
import { StackScreenProps } from "@react-navigation/stack";
import { StackNavigation, StackTypes } from "../../stacks/MainStack";

type Props = {
    children : JSX.Element
}

const CustomProvider = ({children}: Props) => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((store)=> store.authReducer.user)
  const navigate = useNavigation<StackTypes>()
  

  React.useEffect(()=>{
    (async ()=>{
      let activeToken = await AsyncStorage.getItem("token");
      if(!!!activeToken){
        navigate.navigate("LoginScreen");
      } else {
        let decoded: User = jwtDecode(activeToken) ?? ""
        dispatch(setUserData(decoded))
        // console.log(decoded);
        navigate.navigate("LogedScreen")
      }
    })()
  },[])

  return (
      children
    )
};



export default CustomProvider;

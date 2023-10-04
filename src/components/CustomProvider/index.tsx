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

type Props = {
    children : JSX.Element
}

const CustomProvider = ({children}: Props) => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((store)=> store.authReducer.user)
  const navigate = useNavigation()

  React.useEffect(()=>{
    let decoded: User;
    const activeToken = storage.getString("token")

    if(activeToken !== undefined){
      decoded = jwtDecode(activeToken);

      dispatch(setUserData(decoded))
      console.log(decoded)
    }
    
  },[])

  return (
    // userData == undefined ? <AuthStack/> : <DrawerNavigation/>)
    children)
//   return <AuthStack/>;
};


//criar pagina intermediadora para validar se está logado ou n

export default CustomProvider;

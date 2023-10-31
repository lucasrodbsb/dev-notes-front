import React from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserData, User } from "../../services/redux/slices/authSlice";
import jwtDecode from "jwt-decode";
import { useNavigation } from "@react-navigation/native";
import { StackNavigation, StackTypes } from "../../stacks/MainStack";

type Props = {
  children: JSX.Element;
};

const CustomProvider = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const userData = useAppSelector((store) => store.authReducer.user);
  const navigate = useNavigation<StackTypes>();

  React.useEffect(() => {
    (async () => {
      let activeToken = await AsyncStorage.getItem("token");
      if (!!!activeToken) {
        navigate.navigate("LoginScreen");
      } else {
        let decoded: User = jwtDecode(activeToken) ?? "";
        dispatch(setUserData(decoded));
        navigate.navigate("LogedScreen");
      }
    })();
  }, []);

  return children;
};

export default CustomProvider;

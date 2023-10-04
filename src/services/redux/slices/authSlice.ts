import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note } from "../../../types/notesTypes";

type InitialState = {
  user: User | undefined;
};

export type User = {
  user_Id: number;
  full_name: string;
  username: string;
  iat: number;
};

const initialState: InitialState = {
  user: undefined,
};

export const authSlice = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      return {
        user:  action.payload,
      };
    },
    signOut: (state, action: PayloadAction<void>) => {
      return {
        user: undefined,
      };
    },

    // teste: (state, action: PayloadAction<{ name: string; token: string }>) => {
    //   return {
    //     data: [
    //       {
    //         name: action.payload.name,
    //         token: action.payload.token
    //       }
    //     ]
    //   }
    // }
  },
});

export const { setUserData, signOut } = authSlice.actions;

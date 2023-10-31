import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://192.168.118.156:3001/`,
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem("token");
      if (!!token) {
        headers.set("x-access-token", token as string);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    loginUser: builder.mutation<
      { token: string },
      {
        email: string;
        password: string;
      }
    >({
      query: (body: { email: string; password: string }) => {
        return {
          url: "auth/authenticate-user",
          method: "POST",
          body,
        };
      },
    }),

    addNewUser: builder.mutation<
      {message: string, status: string},
      { email: string; password: string; username: string; full_name: string }
    >({
      query: (body: {
        email: string;
        password: string;
        username: string;
        full_name: string;
      }) => {
        return {
          url: "auth/add-user",
          method: "POST",
          body,
        };
      },
    }),

    getUserData: builder.query<{}, number>({
      query: (note_id) => ({
        url: `notes/get/${note_id}`,
        method: "GET",
        
      }),
      providesTags: [],
    }),
  }),
});

export const { useLoginUserMutation, useAddNewUserMutation } = authApi;

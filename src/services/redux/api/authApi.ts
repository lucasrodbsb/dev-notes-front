import AsyncStorage from "@react-native-async-storage/async-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://192.168.118.146:3001/`,
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
        username: string;
        password: string;
      }
    >({
      query: (body: { username: string; password: string }) => {
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
    deleteUserByUserId: builder.mutation<void, { user_id: number }>({
      query: ({ user_id }) => ({
        url: `user/delete/${user_id}`,
        method: "DELETE",
      })
    }),
  }),
});

export const { useLoginUserMutation, useAddNewUserMutation, useDeleteUserByUserIdMutation } = authApi;

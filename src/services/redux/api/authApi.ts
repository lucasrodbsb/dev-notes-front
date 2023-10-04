import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `http://localhost:3001/`, //ipexterno ifconfig
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
  }),
});

export const { useLoginUserMutation, useAddNewUserMutation } = authApi;

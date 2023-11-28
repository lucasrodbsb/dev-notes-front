import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { storage } from "../../mmkv";
import { Note } from "../../../types/notesTypes";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const notesApi = createApi({
  reducerPath: "notesApi",
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
  tagTypes: ["Notes"],

  endpoints: (builder) => ({
    getAllNotesByUserID: builder.query<Note[], number>({
      query: (user_id) => ({
        url: `notes/get-all/${user_id}`,
        method: "GET",
      }),
      providesTags: ["Notes"],
    }),

    getNoteByNoteId: builder.query<Note[], number>({
      query: (note_id) => ({
        url: `notes/get/${note_id}`,
        method: "GET",
      }),
      providesTags: ["Notes"],
    }),

    deleteNoteById: builder.mutation<void, { note_id: number }>({
      query: ({ note_id }) => ({
        url: `notes/delete/${note_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),
    deleteAllNotesByUserId: builder.mutation<void, { user_id: number }>({
      query: ({ user_id }) => ({
        url: `notes/delete-all/${user_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Notes"],
    }),

    addNote: builder.mutation<
      { message: string },
      { user_id: number; title: string; noteBody: string; datetime: number }
    >({
      query: (body) => ({
        url: `notes/add`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notes"],
    }),
    editNoteById: builder.mutation<
      { message: string },
      {
        note_id: number;
        user_id: number;
        title: string;
        noteBody: string;
        datetime: number;
      }
    >({
      query: (body) => ({
        url: `notes/edit/${body.note_id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Notes"],
    }),
  }),
});

export const {
  useGetAllNotesByUserIDQuery,
  useGetNoteByNoteIdQuery,
  useDeleteNoteByIdMutation,
  useAddNoteMutation,
  useEditNoteByIdMutation,
  useDeleteAllNotesByUserIdMutation
} = notesApi;

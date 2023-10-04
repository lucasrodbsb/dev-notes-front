import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Note } from '../../../types/notesTypes'

type InitialState = {
  data: Note[];
};

const initialState: InitialState = { data: [] };

export const notesSlice = createSlice({
  initialState,
  name: "notesReducer",
  reducers: {
    addFormInputsValue: (state, action: PayloadAction<Note>) => {
      return {
        data: [...state.data, action.payload],
      };
    },
    clearState: (state, action: PayloadAction<void>) => {
      return {
        data: [],
      };
    },
  },
});

export const { addFormInputsValue, clearState } = notesSlice.actions;

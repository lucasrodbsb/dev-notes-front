import { notesApi } from "./api/notesApi";
import { authApi } from "./api/authApi";
import { authSlice } from "./slices/authSlice";
import { configureStore } from "@reduxjs/toolkit";
import { notesSlice } from "./slices/notesSlice";
import { setupListeners } from "@reduxjs/toolkit/query/react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

export const store = configureStore({
  reducer: {
    authReducer: authSlice.reducer,
    notesReducer: notesSlice.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [notesApi.reducerPath]: notesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApi.middleware, notesApi.middleware]),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

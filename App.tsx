import "react-native-gesture-handler";
import { Provider } from "react-redux";
import { store } from "./src/services/redux/store";
import { NavigationContainer } from "@react-navigation/native";
import { registerRootComponent } from "expo";
import React from "react";
import CustomProvider from "./src/components/CustomProvider";
import LoaderStack from "./src/stacks/LoaderStack";
import Toast from 'react-native-toast-message';
import {toastConfig} from "./src/services/toast-message/config"
import { createTheme, ThemeProvider } from "@rneui/themed";
import { useColorScheme } from 'react-native';


export default function App() {

  const theme = createTheme({
    lightColors:{
      primary: "#ffffff",
      secondary: '#F2F1F6',
      text: '#000',
      noteBodyColor: '#f2f1f6',
      tintColor: '#ffd52e',
      divider: '#0909093e',
      noteTitleColor: '#000',
      textSecondary: '#1E1E1E'
    },
    darkColors:{
      primary: "#1E1E1E",
      secondary: '#000000',
      text: '#fff',
      noteBodyColor: '#1e1e1e',
      tintColor: '#ffd52e',
      divider: '#ffffff3f',
      noteTitleColor: '#000000',
      textSecondary: '#F2F1F6'
    },
    mode: useColorScheme() ?? 'dark',
  });

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
      <NavigationContainer>
        <CustomProvider>
          <LoaderStack/>
        </CustomProvider>
      </NavigationContainer>
      <Toast position="bottom" config={toastConfig}/>
      </ThemeProvider>
    </Provider>
  );
}

registerRootComponent(App);


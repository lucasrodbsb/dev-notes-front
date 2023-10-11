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


export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <CustomProvider>
          <LoaderStack/>
        </CustomProvider>
      </NavigationContainer>
      <Toast position="bottom" config={toastConfig}/>
    </Provider>
  );
}

registerRootComponent(App);

{
  /* <NavigationContainer>
            <DrawerNavigation />
          </NavigationContainer> */
}

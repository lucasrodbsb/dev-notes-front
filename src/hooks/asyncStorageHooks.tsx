import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
  keyname: string,
  value: string
}

export const storeData = async ({keyname, value}: Props) => {
    try {
      await AsyncStorage.setItem(keyname, value).then(()=>{console.log(`deu bom no async storage menó`)});
    } catch (e) {
      console.log(e)
    }
  };

export const getData = async (keyname: string) => {
  try {
    const value = await AsyncStorage.getItem(keyname);
    if (value !== null) {
      // value previously stored
    }
  } catch (e) {
    // error reading value
  }
};


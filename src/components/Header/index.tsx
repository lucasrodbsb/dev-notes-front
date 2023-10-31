import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, AppBar } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { Avatar } from 'react-native-elements';
import { useAppSelector } from '../../hooks/reduxHooks';

const Header = ({openDrawer, title}: {openDrawer: ()=>void, title: string}) => {

  const userData = useAppSelector((store) => store.authReducer.user);

  const getInitialsFromFullName = (): string  => {
    if(userData){
      return userData.full_name.split(" ")[0][0] + (userData.full_name.split(" ")?.at(1)?.at(0) ?? "")
    } else {
      return ""
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
      <Avatar
              size={54}
              rounded
              title={getInitialsFromFullName()}
              containerStyle={{ backgroundColor: "#3d4db7" }}
            />
        <Text style={styles.title}>{title}</Text>
      <Pressable>
        <Icon name="menu" size={32} color="#fff" onPress={openDrawer}/>
      </Pressable>
      </View>
      
    </SafeAreaView>
  )
}

export default Header

const styles = StyleSheet.create({

    title:{
        color: 'white',
        fontSize: 25,
    },
    container: {
        flexDirection:'row',
        backgroundColor: '#282828',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        position: 'relative',
        paddingTop: 10,
        paddingBottom: -20

    },
    content: {
      flexDirection:'row',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: "100%",
  }
});
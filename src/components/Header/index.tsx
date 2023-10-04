import { View, Text, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button, AppBar } from "@react-native-material/core";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

const Header = ({openDrawer, title}: {openDrawer: ()=>void, title: string}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
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
        // fontWeight: 'bold'
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
      // display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: "100%",
      // backgroundColor: "red"
  }
});
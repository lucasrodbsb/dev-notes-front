import { View, Text } from 'react-native'
import React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StackNavigation } from '../../stacks/MainStack'
import { StatusBar } from 'expo-status-bar'

const SettingsScreen = () => {
  return (
    <View>
        <StatusBar style="light" />
      <Text>SettingsScreen</Text>
    </View>
  )
}

export default SettingsScreen
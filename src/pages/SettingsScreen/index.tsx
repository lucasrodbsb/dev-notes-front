import { View, Text } from 'react-native'
import React from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { StackNavigation } from '../../stacks/MainStack'
import { StatusBar } from 'expo-status-bar'
import { useThemeMode } from '@rneui/themed'

const SettingsScreen = () => {

  const {mode, setMode} = useThemeMode()

  return (
    <View>
        <StatusBar style={mode == 'dark' ? 'light' : 'dark' } />
      <Text>SettingsScreen</Text>
    </View>
  )
}

export default SettingsScreen
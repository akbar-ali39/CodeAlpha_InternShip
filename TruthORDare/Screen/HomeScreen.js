import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const navigation=useNavigation();
  return (
    <View className='flex-1 justify-center items-center bg-white'>
      <Text className='text-3xl font-bold mb-8'>Truth or Dare</Text>

      <TouchableOpacity 
       className="bg-blue-600 px-6 py-4 rounded-xl"
      onPress={()=>{
        navigation.navigate('Game');
      }}>
        <Text className='text-white text-lg'>Start Game </Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomeScreen
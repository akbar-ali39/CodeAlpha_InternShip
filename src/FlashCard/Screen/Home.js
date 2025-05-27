import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import FlashCard from '../Compents/FlashCard';

const Home = () => {
      const navigation = useNavigation();
  return (
    <View className='flex-1 '>
      <FlashCard />
        <View className="absolute bottom-4 right-4">
        <TouchableOpacity
          className="bg-green-500 w-16 h-16 rounded-full items-center justify-center"
          onPress={() => navigation.navigate('FlashCardFrom', { card: null, screenToReturnTo: 'Home', })}
        >
          <Text className="text-white text-3xl">+</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Home
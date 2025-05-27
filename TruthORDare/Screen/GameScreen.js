import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import fetchPrompt from '../Api/MyApi';

const GameScreen = () => {
    const [prompt,setPropt]=useState('');
    const [loading,setLoading]=useState(false);
    const [type,setType]=useState('');

    const hanldeFetch=async(choice)=>{
        setLoading(true);
        setType(choice);
        const result= await fetchPrompt(choice);
        setPropt(result);
        setLoading(false);

    }
  return (
    <View className='flex-1 items-center justify-center bg-white p-6'>
      <Text className='font-bold text-2xl mb-6'>Choose one:</Text>

      <View className='flex-row space-x-4 mb-6'>
        <TouchableOpacity className='px-6 bg-green-500 rounded-xl py-3' onPress={()=>hanldeFetch('truth')}>
            <Text className='text-lg text-white'>Truth</Text>
        </TouchableOpacity>
        <TouchableOpacity className='px-6 bg-green-500 rounded-xl py-3' onPress={()=>hanldeFetch('dare')}>
            <Text className='text-lg text-white'>Dare</Text>
        </TouchableOpacity>
      </View>

      {
        loading?(
            <ActivityIndicator size='large' color='#000' />
        ):prompt?(
            <View className='p-4  mt-4 border rounded-lg border-gray-300 bg-gray-100'>
                <Text className='text-lg text-center '>{type.toUpperCase()}:{prompt}</Text>
            </View>
        ):null
      }
    </View>
  )
}

export default GameScreen
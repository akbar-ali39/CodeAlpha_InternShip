import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TransactionItem = ({ transaction, onDelete }) => {
  return (
    <View className='flex-row justify-between items-center p-3 mb-2 bg-white rounded-lg shadow'>
      <View className='flex-1'>
        {/* Show NOTE instead of CATEGORY as the primary text */}
        <Text className='font-bold'>
          {transaction.note || transaction.category} {/* Show note if exists, otherwise show category */}
        </Text>
        <Text className='text-gray-500 text-sm'>
          {new Date(transaction.date).toLocaleDateString()}
        </Text>        
      </View>

      <View className='flex-row items-center'>
        <Text className={`font-bold ${transaction.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
        </Text>
        <TouchableOpacity 
          onPress={() => onDelete(transaction.id)} 
          className='ml-3'
        >
          <Icon name='delete' size={20} color='#ef4444' />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransactionItem;
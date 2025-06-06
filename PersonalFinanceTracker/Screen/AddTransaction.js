import { View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions, Alert } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddTransaction = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('expense');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');

  // Responsive design
  const isSmallScreen = width < 375;
  const paddingSize = isSmallScreen ? 'p-3' : 'p-4';
  const inputHeight = isSmallScreen ? 'h-12' : 'h-14';
  const textSize = isSmallScreen ? 'text-base' : 'text-lg';

  // Theme colors
  const themeBg = colorScheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const secondaryText = colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const borderColor = colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const inputBg = colorScheme === 'dark' ? 'bg-gray-700' : 'bg-white';
  const placeholderColor = colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500';

  

  const handleSubmit = async () => {
    if (!amount) {
      Alert.alert('Error', 'Please enter an amount');
      return;
    }

    setIsSubmitting(true);

    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      category,
      type,
      note,
      date: new Date().toISOString(),
      title: `${type === 'income' ? 'Income' : 'Expense'} - ${category}`,
    };

    try {
      const existing = await AsyncStorage.getItem('transaction');
      const transactions = existing ? JSON.parse(existing) : [];
      const updated = [...transactions, newTransaction];
      await AsyncStorage.setItem('transaction', JSON.stringify(updated));

      setAmount('');
      setNote('');
      setCategory('Food');
      setType('expense');

      Alert.alert('Success', 'Transaction added successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Home', { refresh: true })
        }
      ]);
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Error', 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <ScrollView className={`flex-1 ${paddingSize} ${themeBg}`}>

      <Text
  className={`text-2xl font-bold mb-6 text-center ${
    colorScheme === 'dark' ? 'text-white' : 'text-gray-800'
  }`}
>
  Add Transaction 💸
</Text>
      {/* Amount */}
      <View className='mb-6'>
        <Text className={`${textColor} ${textSize} font-bold mb-3`}>Amount</Text>
        <View className={`flex-row items-center ${inputBg} ${borderColor} border rounded-lg ${inputHeight} px-4`}>
          <Icon name="attach-money" size={24} color={type === 'income' ? '#10B981' : '#EF4444'} className="mr-2" />
          <TextInput
            placeholder='0.00'
            placeholderTextColor={placeholderColor}
            value={amount}
            onChangeText={setAmount}
            keyboardType='numeric'
            className={`flex-1 ${textColor} ${textSize}`}
          />
        </View>
      </View>

      {/* Type */}
      <View className='mb-6'>
        <Text className={`${textColor} ${textSize} font-bold mb-3`}>Type</Text>
        <View className='flex-row'>
          <TouchableOpacity
            onPress={() => setType('expense')}
            className={`flex-1 ${paddingSize} mr-3 rounded-lg border flex-row items-center justify-center ${
              type === 'expense'
                ? 'bg-red-100 border-red-500 dark:bg-red-900/30 dark:border-red-700'
                : `${cardBg} ${borderColor}`
            }`}
          >
            <Icon name="trending-down" size={20} color={type === 'expense' ? '#EF4444' : secondaryText} className="mr-2" />
            <Text className={`${textSize} ${type === 'expense' ? 'text-red-500 dark:text-red-400 font-bold' : secondaryText}`}>
              Expense
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setType('income')}
            className={`flex-1 ${paddingSize} rounded-lg border flex-row items-center justify-center ${
              type === 'income'
                ? 'bg-green-100 border-green-500 dark:bg-green-900/30 dark:border-green-700'
                : `${cardBg} ${borderColor}`
            }`}
          >
            <Icon name="trending-up" size={20} color={type === 'income' ? '#10B981' : secondaryText} className="mr-2" />
            <Text className={`${textSize} ${type === 'income' ? 'text-green-500 dark:text-green-400 font-bold' : secondaryText}`}>
              Income
            </Text>
          </TouchableOpacity>
        </View>
      </View>



      {/* Note */}
      <View className='mb-8'>
        <Text className={`${textColor} ${textSize} font-bold mb-3`}>Note (Optional)</Text>
        <View className={`flex-row items-start ${inputBg} ${borderColor} border rounded-lg ${isSmallScreen ? 'h-20' : 'h-24'} px-4 py-3`}>
          <Icon name="notes" size={20} color={placeholderColor} className="mr-2 mt-1" />
          <TextInput
            placeholder='Add a note...'
            placeholderTextColor={placeholderColor}
            value={note}
            onChangeText={setNote}
            multiline
            className={`flex-1 ${textColor} ${textSize}`}
          />
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isSubmitting}
        className={`${paddingSize} rounded-lg items-center justify-center flex-row ${
          isSubmitting ? 'bg-blue-400' : 'bg-blue-500'
        } ${isSmallScreen ? 'h-12' : 'h-14'}`}
      >
        {isSubmitting ? (
          <>
            <Icon name="hourglass-empty" size={20} color="#ffffff" className="mr-2" />
            <Text className='text-white font-bold text-lg'>Processing...</Text>
          </>
        ) : (
          <>
            <Icon name="check-circle" size={20} color="#ffffff" className="mr-2" />
            <Text className='text-white font-bold text-lg'>Add Transaction</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AddTransaction;

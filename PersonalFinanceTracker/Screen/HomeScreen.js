import { View, Text, FlatList, useColorScheme, Dimensions, RefreshControl, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import TransactionItem from '../Components/TransactionItem';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = () => {
  const [transaction, setTransaction] = useState([]);
  const [balance, setBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const route = useRoute();
  const colorScheme = useColorScheme();
  const { width } = Dimensions.get('window');


  // Determine screen size
  const isSmallScreen = width < 375;
  const isLargeScreen = width > 600;

  useEffect(() => {
    loadTransaction();
  }, [route.params?.refresh]);

  const loadTransaction = async () => {
    try {
      setRefreshing(true);
      const savedTransaction = await AsyncStorage.getItem('transaction');
      if (savedTransaction) {
        const parsed = JSON.parse(savedTransaction);
        setTransaction(parsed);
        calculatedBalance(parsed);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadTransaction();
  };

  const calculatedBalance = (transaction) => {
    const total = transaction.reduce((sum, item) => {
      return item.type === 'income' ? sum + item.amount : sum - item.amount;
    }, 0);
    setBalance(total);
  };

  const handleDelete = async (id) => {
    const update = transaction.filter(t => t.id !== id);
    setTransaction(update);
    await AsyncStorage.setItem('transaction', JSON.stringify(update));
    calculatedBalance(update);
  };

  // Theme colors
  const themeBg = colorScheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const secondaryText = colorScheme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  const refreshColor = colorScheme === 'dark' ? '#ffffff' : '#000000';

  return (
    <View className={`flex-1 p-4 ${themeBg}`}>
      {/* Replace your current header section with this */}
<View className={`${cardBg} p-6 rounded-xl shadow-lg mb-6`}>
  <View className="flex-row items-center justify-between mb-4">
    <View className="flex-row items-center">
      <View className={`p-3 rounded-full mr-3 ${
        balance >= 0 
          ? 'bg-green-100 dark:bg-green-900/30' 
          : 'bg-red-100 dark:bg-red-900/30'
      }`}>
        <Icon 
          name={balance >= 0 ? "monetization-on" : "money-off"} 
          size={28} 
          color={balance >= 0 ? '#10B981' : '#EF4444'} 
        />
      </View>
      <View>
        <Text className={`${secondaryText} text-lg font-medium`}>Your Balance</Text>
        <Text className={`text-3xl font-bold ${balance >= 0 ? 'text-green-500' : "text-red-500"}`}>
          ${Math.abs(balance).toFixed(2)}
          {balance < 0 && (
            <Text className="text-xs text-red-500 ml-1">(deficit)</Text>
          )}
        </Text>
      </View>
    </View>
    <TouchableOpacity onPress={onRefresh}>
      <Icon 
        name="refresh" 
        size={24} 
        color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} 
      />
    </TouchableOpacity>
  </View>
  
  {/* Summary stats */}
  <View className="flex-row justify-between mt-4">
    <View className="flex-row items-center bg-green-100 dark:bg-green-900/20 px-3 py-2 rounded-lg">
      <Icon name="trending-up" size={18} color="#10B981" />
      <Text className={`ml-2 ${colorScheme === 'dark' ? 'text-green-300' : 'text-green-800'} font-medium`}>
        ${transaction
          .filter(t => t.type === 'income')
          .reduce((sum, item) => sum + item.amount, 0)
          .toFixed(2)}
      </Text>
    </View>
    <View className="flex-row items-center bg-red-100 dark:bg-red-900/20 px-3 py-2 rounded-lg">
      <Icon name="trending-down" size={18} color="#EF4444" />
      <Text className={`ml-2 ${colorScheme === 'dark' ? 'text-red-300' : 'text-red-800'} font-medium`}>
        ${transaction
          .filter(t => t.type === 'expense')
          .reduce((sum, item) => sum + item.amount, 0)
          .toFixed(2)}
      </Text>
    </View>
  </View>
</View>

      {/* Transactions header */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className={`${textColor} text-xl font-bold`}>
          Recent Transactions
        </Text>
        <Text className={`${secondaryText}`}>
          {transaction.length} {transaction.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      {/* Transactions list with refresh control */}
      {transaction.length > 0 ? (
        <FlatList 
          data={transaction}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({item}) => (
            <TransactionItem 
              transaction={item} 
              onDelete={handleDelete} 
              colorScheme={colorScheme}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={refreshColor}
              colors={[refreshColor]}
            />
          }
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Icon 
            name="receipt" 
            size={isLargeScreen ? 80 : 60} 
            color={colorScheme === 'dark' ? '#4B5563' : '#D1D5DB'} 
          />
          <Text className={`${secondaryText} mt-4 text-center text-lg`}>
            No transactions yet.{"\n"}
            Add your first transaction to get started!
          </Text>
          <TouchableOpacity
            onPress={onRefresh}
            className={`mt-4 p-2 rounded-full ${colorScheme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
          >
            <Icon 
              name="refresh" 
              size={24} 
              color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} 
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default HomeScreen;
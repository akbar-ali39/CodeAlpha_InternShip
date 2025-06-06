import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { useColorScheme } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';

const CategorySelector = () => {
    const route = useRoute(); // Get route using hook
  const { type, onSelect } = route.params; // Now this will work
  const colorScheme = useColorScheme();
  const navigation = useNavigation(); // Fixed typo
  const { width } = Dimensions.get('window');
  
  // Responsive design
  const isSmallScreen = width < 375;
  const itemSize = isSmallScreen ? 'w-1/3' : 'w-1/4';
  
  // Theme colors
  const themeBg = colorScheme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = colorScheme === 'dark' ? 'text-gray-100' : 'text-gray-800';
  const cardBg = colorScheme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = colorScheme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const incomeCategories = [
    { id: '1', name: 'Salary', icon: 'work' },
    { id: '2', name: 'Bonus', icon: 'stars' },
    { id: '3', name: 'Investment', icon: 'trending-up' },
    { id: '4', name: 'Gift', icon: 'card-giftcard' },
    { id: '5', name: 'Freelance', icon: 'computer' },
    { id: '6', name: 'Rental', icon: 'home' },
    { id: '7', name: 'Dividends', icon: 'attach-money' },
    { id: '8', name: 'Other', icon: 'more-horiz' },
  ];

  const expenseCategories = [
    { id: '1', name: 'Food', icon: 'restaurant' },
    { id: '2', name: 'Transport', icon: 'directions-car' },
    { id: '3', name: 'Shopping', icon: 'shopping-cart' },
    { id: '4', name: 'Entertainment', icon: 'movie' },
    { id: '5', name: 'Bills', icon: 'receipt' },
    { id: '6', name: 'Healthcare', icon: 'local-hospital' },
    { id: '7', name: 'Education', icon: 'school' },
    { id: '8', name: 'Other', icon: 'more-horiz' },
  ];

  const categories = type === 'income' ? incomeCategories : expenseCategories;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className={`${itemSize} p-3 mb-4 items-center`}
      onPress={() => {
        onSelect(item.name);
        navigation.goBack();
      }}
    >
      <View className={`p-4 rounded-full mb-2 ${
        type === 'income' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
      }`}>
        <Icon 
          name={item.icon} 
          size={24} 
          color={type === 'income' ? '#10B981' : '#EF4444'} 
        />
      </View>
      <Text className={`${textColor} text-center`}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 ${themeBg} p-4`}>
      <View className={`flex-row items-center mb-6`}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="mr-4"
        >
          <Icon 
            name="arrow-back" 
            size={24} 
            color={colorScheme === 'dark' ? '#9CA3AF' : '#6B7280'} 
          />
        </TouchableOpacity>
        <Text className={`${textColor} text-xl font-bold`}>
          Select {type === 'income' ? 'Income' : 'Expense'} Category
        </Text>
      </View>

      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default CategorySelector;
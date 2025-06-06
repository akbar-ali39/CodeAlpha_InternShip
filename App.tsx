import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from './PersonalFinanceTracker/Screen/HomeScreen';
import AddTransaction from './PersonalFinanceTracker/Screen/AddTransaction';

const Tab = createBottomTabNavigator();

const App = () => {
  const colorScheme = useColorScheme();
  
  // Tab bar styling
  const tabBarOptions = {
    activeTintColor: colorScheme === 'dark' ? '#10B981' : '#059669',
    inactiveTintColor: colorScheme === 'dark' ? '#9CA3AF' : '#6B7280',
    style: {
      backgroundColor: colorScheme === 'dark' ? '#1F2937' : '#FFFFFF',
      borderTopWidth: 0,
      elevation: 0,
      height: 60,
      paddingBottom: 5,
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: '500',
      marginBottom: 5,
    },
    tabStyle: {
      paddingTop: 8,
    }
  };

  return (
    <NavigationContainer>
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-filled';
            } else if (route.name === 'AddTransaction') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            }

            return (
              <View className={`items-center justify-center ${focused ? 'mt-1' : ''}`}>
                <Icon 
                  name={iconName} 
                  size={28} 
                  color={color} 
                />
                {focused && (
                  <View className={`h-1 w-1 rounded-full mt-1 ${
                    colorScheme === 'dark' ? 'bg-green-400' : 'bg-green-600'
                  }`} />
                )}
              </View>
            );
          },
          ...tabBarOptions
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{
            tabBarLabel: 'Home',
          }}
        />
        <Tab.Screen 
          name="AddTransaction" 
          component={AddTransaction} 
          options={{
            tabBarLabel: 'Add Transaction',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
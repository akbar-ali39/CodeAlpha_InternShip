import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import  MaterialIcons  from 'react-native-vector-icons/MaterialIcons';
import QuoteScreen from '../Screen/QuoteScreen';
import Favroit from '../Screen/Favroit';
import Save from '../Screen/Save';


const Tab = createBottomTabNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#6366f1',
          tabBarInactiveTintColor: '#64748b',
          tabBarLabelStyle: styles.tabLabel,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen 
          name="QuoteScreen" 
          component={QuoteScreen}
          options={{
            tabBarLabel: 'New Quote',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Favorites" 
          component={Favroit}
          options={{
            tabBarLabel: 'Favorites',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="favorite-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen 
          name="Saved" 
          component={Save}
          options={{
            tabBarLabel: 'Saved',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bookmark-outline" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    borderRadius: 15,
    height: 70,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingBottom: 5,
    borderTopWidth: 0,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    paddingBottom: 5,
  },
});

export default AppNavigation;
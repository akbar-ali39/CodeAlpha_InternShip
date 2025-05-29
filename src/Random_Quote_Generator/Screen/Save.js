import React, { useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  useWindowDimensions,
  useColorScheme,
  ImageBackground,
  Platform,
  BackHandler,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { removeFromSaved } from '../ReduxToolKit/QuoteSlice';

const Save = () => {
  const dispatch = useDispatch();
  const { saved } = useSelector(state => state.quotes);
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const isSmallScreen = width < 375;

  // Platform specific shadow
  const platformShadow = Platform.select({
    ios: 'shadow-lg',
    android: 'shadow-md'
  });

  const handleRemove = (quote) => {
    dispatch(removeFromSaved(quote));
  };

    useEffect(() => {
      const backAction = () => {
        Alert.alert(
          "Exit App",
          "Are you sure you want to leave this app?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            { 
              text: "YES", 
              onPress: () => BackHandler.exitApp() 
            }
          ]
        );
        return true;
      };
  
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
  
      return () => backHandler.remove();
    }, []);

  return (
    <ImageBackground 
      source={isDarkMode 
        ? require('../assets/Images/bg_image_2.jpg') 
        : require('../assets/Images/bg_image_2.jpg')}
      className="flex-1"
      blurRadius={isDarkMode ? 3 : 2}
      resizeMode="cover"
    >
      {/* Overlay */}
      <View className={`absolute inset-0 ${isDarkMode ? 'bg-black/40' : 'bg-black/20'}`} />
      
      <View className={`flex-1 p-${isSmallScreen ? '3' : '4'}`}>
        <Text className={`text-${isSmallScreen ? 'xl' : '2xl'} font-bold mb-4 ${isDarkMode ? 'text-gray-100' : 'text-white'}`}>
          Saved Quotes
        </Text>
        
        <FlatList
          data={saved}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View className={`${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} p-${isSmallScreen ? '3' : '4'} rounded-lg mb-3 ${platformShadow} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <View className="flex-row justify-between items-start">
                <View className="flex-1">
                  <Text className={`text-${isSmallScreen ? 'base' : 'lg'} italic ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                    "{item.text}"
                  </Text>
                  <Text className={`text-right mt-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                    — {item.author}
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handleRemove(item)}
                  className={`p-2 ml-2 rounded-full ${isDarkMode ? 'bg-gray-700/50' : 'bg-gray-100'}`}
                  activeOpacity={0.7}
                >
                  <Icon 
                    name="trash-can-outline" 
                    size={isSmallScreen ? 20 : 24} 
                    color={isDarkMode ? "#fca5a5" : "#ef4444"} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-20">
              <Icon 
                name="bookmark-outline" 
                size={40} 
                color={isDarkMode ? "#9ca3af" : "#6b7280"} 
                className="mb-4"
              />
              <Text className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-lg`}>
                No saved quotes yet
              </Text>
            </View>
          }
          contentContainerStyle={{ paddingBottom: 70 }}
        />
      </View>
    </ImageBackground>
  );
};

export default Save;
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, ActivityIndicator, Share, Alert, BackHandler } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Tts from 'react-native-tts';
import { 
  addToFavorites, 
  addToSaved, 
  removeFromFavorites, 
  removeFromSaved 
} from '../ReduxToolKit/QuoteSlice';
import axios from 'axios';

const QuoteScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { favorites, saved } = useSelector(state => state.quotes);
  const [currentQuote, setCurrentQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    Tts.setDefaultLanguage('en-US');
    Tts.setDefaultRate(0.5); 
    Tts.setDefaultPitch(1.0); 

    return () => {
      Tts.stop(); 
    };
  }, []);

  // Fallback quotes if the api fail
  const fallbackQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" }
  ];

  const handleSpeak = () => {
    if (!currentQuote) return;
    
    if (isSpeaking) {
      Tts.stop();
      setIsSpeaking(false);
    } else {
      const textToSpeak = `${currentQuote.text}. By ${currentQuote.author}`;
      Tts.speak(textToSpeak);
      setIsSpeaking(true);
      
      Tts.addEventListener('tts-finish', () => setIsSpeaking(false));
    }
  };

  const fetchRandomQuote = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://lucifer-quotes.vercel.app/api/quotes');
      setCurrentQuote({
        text: response.data[0].quote,
        author: response.data[0].author
      });
      if (isSpeaking) {
        Tts.stop();
        setIsSpeaking(false);
      }
    } catch (error) {
      setError(error.message);
      const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
      setCurrentQuote(fallbackQuotes[randomIndex]);
    } finally {
      setIsLoading(false);
    }
  };

  // Back handler effect
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

  useEffect(() => { 
    fetchRandomQuote(); 
  }, []);

  const isFavorite = currentQuote ? favorites.some(q => q.text === currentQuote.text) : false;
  const isSaved = currentQuote ? saved.some(q => q.text === currentQuote.text) : false;

  const handleFavoritePress = () => {
    dispatch(isFavorite ? removeFromFavorites(currentQuote) : addToFavorites(currentQuote));
  };

  const handleSavePress = () => {
    dispatch(isSaved ? removeFromSaved(currentQuote) : addToSaved(currentQuote));
  };

  const handleShare = async () => {
    try {
      if (!currentQuote) return;
      
      const shareOptions = {
        message: `"${currentQuote.text}" - ${currentQuote.author}\n\nShared via Daily Inspiration App`,
        title: 'Share Quote',
      };

      await Share.share(shareOptions);
    } catch (error) {
      console.error('Error sharing:', error.message);
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/Images/bg_image_2.jpg')}
      className="flex-1 justify-center items-center p-6"
      blurRadius={2}
      resizeMode="cover"
    >
      <View className="absolute inset-0 bg-black/30" />
      
      <View className="w-full max-w-md z-10">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-center text-white">Daily Inspiration</Text>
          <Text className="text-center text-white/80 mt-2">Words to live by</Text>
        </View>

        {/* Quote Card */}
        <View className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
          {isLoading ? (
            <View className="min-h-[150px] justify-center">
              <ActivityIndicator size="large" color="#6366f1" />
            </View>
          ) : error ? (
            <View className="bg-yellow-50/80 p-4 rounded-lg mb-4 border border-yellow-200">
              <Text className="text-yellow-800 text-center">Using local quotes</Text>
            </View>
          ) : null}
          
          {currentQuote && !isLoading && (
            <>
              <View className="mb-6">
                <Text className="text-2xl italic text-gray-800 leading-relaxed text-center">
                  "{currentQuote.text}"
                </Text>
              </View>
              <View className="border-t border-gray-200/50 pt-4">
                <Text className="text-right text-indigo-600 font-medium text-lg">
                  — {currentQuote.author}
                </Text>
              </View>
            </>
          )}

          {/* Action Buttons */}
          <View className="flex-row justify-between mt-6">
            <TouchableOpacity 
              onPress={handleFavoritePress}
              className="p-3 rounded-full bg-white/60"
              activeOpacity={0.7}
            >
              <Icon 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={30} 
                color={isFavorite ? "#ef4444" : "#9ca3af"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleSpeak}
              className="p-3 rounded-full bg-white/60"
              activeOpacity={0.7}
            >
              <Icon 
                name={isSpeaking ? "volume-high" : "volume-off"} 
                size={30} 
                color={isSpeaking ? "#10b981" : "#9ca3af"} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleShare}
              className="p-3 rounded-full bg-white/60"
              activeOpacity={0.7}
            >
              <Icon 
                name="share-variant" 
                size={30} 
                color="#9ca3af" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleSavePress}
              className="p-3 rounded-full bg-white/60"
              activeOpacity={0.7}
            >
              <Icon 
                name={isSaved ? "bookmark" : "bookmark-outline"} 
                size={30} 
                color={isSaved ? "#3b82f6" : "#9ca3af"} 
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* New Quote Button */}
        <TouchableOpacity 
          onPress={fetchRandomQuote}
          className="mt-8 bg-indigo-600/90 px-8 py-4 rounded-full shadow-xl flex-row justify-center items-center border-2 border-white/30"
          disabled={isLoading}
          activeOpacity={0.7}
        >
          {isLoading ? (
            <ActivityIndicator color="white" className="mr-2" />
          ) : (
            <>
              <Icon name="reload" size={24} color="white" className="mr-2" />
              <Text className="text-white font-bold text-lg">New Quote</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Navigation Buttons */}
        <View className="flex-row justify-center space-x-4 mt-4">
          <TouchableOpacity 
            onPress={() => navigation.navigate('Favorites')}
            className="px-4 py-2 bg-red-100 rounded-full flex-row items-center"
            activeOpacity={0.7}
          >
            <Icon name="heart" size={18} color="#ef4444" className="mr-1" />
            <Text className="text-red-600">Favorites ({favorites.length})</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => navigation.navigate('Saved')}
            className="px-4 py-2 bg-blue-100 rounded-full flex-row items-center"
            activeOpacity={0.7}
          >
            <Icon name="bookmark" size={18} color="#3b82f6" className="mr-1" />
            <Text className="text-blue-600">Saved ({saved.length})</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text className="absolute bottom-8 text-white/80 text-sm">
        Tap for more wisdom
      </Text>
    </ImageBackground>
  );
};

export default QuoteScreen;
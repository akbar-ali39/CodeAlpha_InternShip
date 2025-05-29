import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ImageBackground, 
  ActivityIndicator, 
  Share, 
  Alert, 
  BackHandler,
  Platform,
  useWindowDimensions,
  useColorScheme,
  StyleSheet,
  ScrollView,
  SafeAreaView
} from 'react-native';
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
  
  // Get device info
  const { width, height } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const isSmallScreen = width < 375;
  const isLargeScreen = width > 500;

  // Dynamic styles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      padding: isSmallScreen ? 16 : 24,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)'
    },
    contentContainer: {
      width: '100%',
      maxWidth: isLargeScreen ? 512 : 448,
      zIndex: 10,
      alignSelf: 'center',
      marginVertical: 16
    },
    headerContainer: {
      marginBottom: isSmallScreen ? 24 : 32
    },
    headerText: {
      fontSize: isSmallScreen ? 24 : 32,
      fontWeight: 'bold',
      textAlign: 'center',
      color: isDarkMode ? '#f3f4f6' : '#ffffff'
    },
    subtitleText: {
      textAlign: 'center',
      color: isDarkMode ? '#d1d5db' : '#e5e7eb',
      marginTop: 8
    },
    quoteCard: {
      backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderRadius: 16,
      padding: isSmallScreen ? 16 : 24,
      width: '100%',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDarkMode ? 0.25 : 0.1,
      shadowRadius: 3.84,
      elevation: 5,
      borderWidth: 1,
      borderColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(255, 255, 255, 0.2)'
    },
    loadingContainer: {
      minHeight: 150,
      justifyContent: 'center'
    },
    errorContainer: {
      backgroundColor: isDarkMode ? 'rgba(113, 63, 18, 0.5)' : 'rgba(254, 243, 199, 0.8)',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: isDarkMode ? 'rgba(146, 64, 14, 0.8)' : 'rgba(253, 230, 138, 0.8)'
    },
    errorText: {
      textAlign: 'center',
      color: isDarkMode ? '#fcd34d' : '#92400e'
    },
    quoteText: {
      fontSize: isSmallScreen ? 20 : 24,
      fontStyle: 'italic',
      color: isDarkMode ? '#f3f4f6' : '#1f2937',
      textAlign: 'center',
      lineHeight: 28,
      marginBottom: isSmallScreen ? 16 : 24
    },
    authorContainer: {
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)',
      paddingTop: isSmallScreen ? 12 : 16
    },
    authorText: {
      textAlign: 'right',
      color: isDarkMode ? '#a5b4fc' : '#4f46e5',
      fontWeight: '600',
      fontSize: isSmallScreen ? 16 : 18
    },
    actionButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: isSmallScreen ? 16 : 24
    },
    actionButton: {
      padding: 8,
      borderRadius: 999,
      backgroundColor: isDarkMode ? 'rgba(55, 65, 81, 0.6)' : 'rgba(255, 255, 255, 0.6)'
    },
    newQuoteButton: {
      marginTop: isSmallScreen ? 24 : 32,
      backgroundColor: isDarkMode ? 'rgba(67, 56, 202, 0.9)' : 'rgba(79, 70, 229, 0.9)',
      paddingVertical: Platform.select({ ios: 12, android: 10 }),
      paddingHorizontal: Platform.select({ ios: 24, android: 20 }),
      borderRadius: 999,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.3)' : 'rgba(255, 255, 255, 0.3)',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5
    },
    newQuoteButtonText: {
      color: isDarkMode ? '#e0e7ff' : 'white',
      fontWeight: 'bold',
      fontSize: isSmallScreen ? 16 : 18
    },
    navButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: isSmallScreen ? 12 : 16,
      marginTop: 16,
      marginBottom: height * 0.1
    },
    navButton: {
      paddingVertical: Platform.select({ ios: 12, android: 10 }),
      paddingHorizontal: Platform.select({ ios: 16, android: 14 }),
      borderRadius: 999,
      flexDirection: 'row',
      alignItems: 'center'
    },
    navButtonText: {
      fontSize: isSmallScreen ? 14 : 16
    },
    footerText: {
      position: 'absolute',
      bottom: 32,
      alignSelf: 'center',
      color: isDarkMode ? 'rgba(209, 213, 219, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      fontSize: 14
    }
  });

  // Fallback quotes
  const fallbackQuotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "In the middle of every difficulty lies opportunity.", author: "Albert Einstein" }
  ];

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

  // Initialize TTS with proper cleanup
  useEffect(() => {
    let isMounted = true;

    const initializeTTS = async () => {
      try {
        await Tts.getInitStatus();
        Tts.setDefaultLanguage('en-US');
        Tts.setDefaultRate(0.5);
        Tts.setDefaultPitch(1.0);
        
        if (Tts.setDefaultVolume) {
          Tts.setDefaultVolume(0.8);
        }
        
        if (Platform.OS === 'android') {
          Tts.setIgnoreSilentSwitch(true);
          Tts.setDucking(true);
        }
      } catch (err) {
        console.warn('TTS initialization error:', err);
      }
    };

    initializeTTS();

    // Event handlers
    const onStart = () => isMounted && setIsSpeaking(true);
    const onFinish = () => isMounted && setIsSpeaking(false);

    // Add event listeners
    Tts.addEventListener('tts-start', onStart);
    Tts.addEventListener('tts-finish', onFinish);

    return () => {
      isMounted = false;
      // Proper cleanup
      Tts.removeEventListener('tts-start', onStart);
      Tts.removeEventListener('tts-finish', onFinish);
      Tts.stop();
    };
  }, []);

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

  const handleSpeak = () => {
    if (!currentQuote) return;
    
    if (isSpeaking) {
      Tts.stop();
    } else {
      const textToSpeak = `${currentQuote.text}. By ${currentQuote.author}`;
      Tts.speak(textToSpeak);
    }
  };

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
      style={styles.container}
      blurRadius={isDarkMode ? 3 : 2}
      resizeMode="cover"
    >
      {/* Overlay with dark/light opacity */}
      <View style={styles.overlay} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.contentContainer}>
            {/* Header */}
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>
                Daily Inspiration
              </Text>
              <Text style={styles.subtitleText}>
                Words to live by
              </Text>
            </View>

            {/* Quote Card */}
            <View style={styles.quoteCard}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={isDarkMode ? "#818cf8" : "#6366f1"} />
                </View>
              ) : error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>
                    Using local quotes
                  </Text>
                </View>
              ) : null}
              
              {currentQuote && !isLoading && (
                <>
                  <View>
                    <Text style={styles.quoteText}>
                      "{currentQuote.text}"
                    </Text>
                  </View>
                  <View style={styles.authorContainer}>
                    <Text style={styles.authorText}>
                      — {currentQuote.author}
                    </Text>
                  </View>
                </>
              )}

              {/* Action Buttons */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity 
                  onPress={handleFavoritePress}
                  style={styles.actionButton}
                  activeOpacity={0.7}
                >
                  <Icon 
                    name={isFavorite ? "heart" : "heart-outline"} 
                    size={isSmallScreen ? 26 : 30} 
                    color={isFavorite ? "#ef4444" : (isDarkMode ? "#9ca3af" : "#6b7280")} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleSpeak}
                  style={styles.actionButton}
                  activeOpacity={0.7}
                >
                  <Icon 
                    name={isSpeaking ? "volume-high" : "volume-off"} 
                    size={isSmallScreen ? 26 : 30} 
                    color={isSpeaking ? "#10b981" : (isDarkMode ? "#9ca3af" : "#6b7280")} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleShare}
                  style={styles.actionButton}
                  activeOpacity={0.7}
                >
                  <Icon 
                    name="share-variant" 
                    size={isSmallScreen ? 26 : 30} 
                    color={isDarkMode ? "#9ca3af" : "#6b7280"} 
                  />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={handleSavePress}
                  style={styles.actionButton}
                  activeOpacity={0.7}
                >
                  <Icon 
                    name={isSaved ? "bookmark" : "bookmark-outline"} 
                    size={isSmallScreen ? 26 : 30} 
                    color={isSaved ? "#3b82f6" : (isDarkMode ? "#9ca3af" : "#6b7280")} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* New Quote Button */}
            <TouchableOpacity 
              onPress={fetchRandomQuote}
              style={styles.newQuoteButton}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              {isLoading ? (
                <ActivityIndicator 
                  color={isDarkMode ? "#e0e7ff" : "white"} 
                  style={{ marginRight: 8 }} 
                />
              ) : (
                <>
                  <Icon 
                    name="reload" 
                    size={isSmallScreen ? 20 : 24} 
                    color={isDarkMode ? "#e0e7ff" : "white"} 
                    style={{ marginRight: 8 }} 
                  />
                  <Text style={styles.newQuoteButtonText}>
                    New Quote
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Navigation Buttons */}
            <View style={styles.navButtonsContainer}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Favorites')}
                style={[styles.navButton, {
                  backgroundColor: isDarkMode ? 'rgba(127, 29, 29, 0.4)' : '#fee2e2'
                }]}
                activeOpacity={0.7}
              >
                <Icon 
                  name="heart" 
                  size={isSmallScreen ? 16 : 18} 
                  color={isDarkMode ? "#fca5a5" : "#ef4444"} 
                  style={{ marginRight: 4 }} 
                />
                <Text style={[styles.navButtonText, {
                  color: isDarkMode ? '#fca5a5' : '#dc2626'
                }]}>
                  Favorites ({favorites.length})
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={() => navigation.navigate('Saved')}
                style={[styles.navButton, {
                  backgroundColor: isDarkMode ? 'rgba(30, 58, 138, 0.4)' : '#dbeafe'
                }]}
                activeOpacity={0.7}
              >
                <Icon 
                  name="bookmark" 
                  size={isSmallScreen ? 16 : 18} 
                  color={isDarkMode ? "#93c5fd" : "#3b82f6"} 
                  style={{ marginRight: 4 }} 
                />
                <Text style={[styles.navButtonText, {
                  color: isDarkMode ? '#93c5fd' : '#2563eb'
                }]}>
                  Saved ({saved.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <Text style={styles.footerText}>
          Tap for more wisdom
        </Text>
        
      </SafeAreaView>
    </ImageBackground>
  );
};

export default QuoteScreen;
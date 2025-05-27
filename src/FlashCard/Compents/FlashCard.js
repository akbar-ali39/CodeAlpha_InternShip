import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteFlashCard,
    editFlashCard,
    nextFlashcard,
    prevFlashcard,
} from '../ReduxToolkit/FlashCardSlice';
import { useNavigation } from '@react-navigation/native';
import  Ionicons  from 'react-native-vector-icons/Ionicons'

const FlashCard = () => {
    const [showAnswer, setShowAnswer] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const { flashcards, currentIndex } = useSelector(state => ({
        flashcards: state.flashCards.flashcards,
        currentIndex: state.flashCards.currentIndex,
    }));

    const currentCard = flashcards ? flashcards[currentIndex] : null;

    if (!currentCard) {
        return (
            <ImageBackground
            source={require('../assets/Image/bg-image-2.jpg')}
            className="flex-1 justify-center items-center ">
                <Text className="text-xl text-white">No Flashcards available</Text>
                <TouchableOpacity 
                    className="mt-4 bg-blue-500 px-6 py-3 rounded-full"
                    onPress={() => navigation.navigate('FlashCardFrom')}
                >
                    <Text className="text-white font-bold">Create Your First Card</Text>
                </TouchableOpacity>
            </ImageBackground>
        );
    }

    const handleEdit = () => {
        navigation.navigate('FlashCardFrom', { card: currentCard });
    };

    return (
        <ImageBackground
            source={require('../assets/Image/bg-image-1.jpg')}
            resizeMode="cover"
            className="flex-1">
            <View className="flex-1 justify-center bg-black/60 px-4 pt-6">
                {/* Card Counter */}
                <View className="mb-4 self-center bg-white/20 py-1 px-4 rounded-full">
                    <Text className="text-white font-medium">
                        Card {currentIndex + 1} of {flashcards.length}
                    </Text>
                </View>

                  {/* Title Section */}
                <View className="mb-6 items-center">
                    <Text className="text-3xl font-bold text-white mb-1">FlashCards</Text>
                    <Text className="text-lg text-white/80">Study and memorize your cards</Text>
                </View>


                {/* Flashcard Content */}
                <TouchableOpacity
                    className="w-full h-64 bg-white rounded-xl shadow-lg p-6 justify-center items-center border-2 border-indigo-100"
                    onPress={() => setShowAnswer(!showAnswer)}
                    activeOpacity={0.8}
                >
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-2xl text-center font-bold text-gray-800 mb-2">
                            {showAnswer ? currentCard.answer : currentCard.question}
                        </Text>
                        <View className="flex-row items-center mt-4">
                            <Ionicons 
                                name={showAnswer ? "eye-off-outline" : "eye-outline"} 
                                size={20} 
                                color="#3B82F6" 
                            />
                            <Text className="ml-2 text-blue-500 font-medium">
                                {showAnswer ? 'Show Question' : 'Show Answer'}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>

                {/* Navigation Buttons */}
                <View className="flex-row justify-between w-full mt-8 mb-4">
                    <TouchableOpacity
                        className="bg-blue-500 px-6 py-3 rounded-xl flex-row items-center"
                        onPress={() => {
                            setShowAnswer(false);
                            dispatch(prevFlashcard());
                        }}
                        disabled={currentIndex === 0}
                        style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
                    >
                        <Ionicons name="chevron-back" size={20} color="white" />
                        <Text className="text-white font-bold ml-1">Prev</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-green-500 py-3 rounded-xl px-6 flex-row items-center"
                        onPress={handleEdit}
                    >
                        <Ionicons name="create-outline" size={20} color="white" />
                        <Text className="text-white font-bold ml-1">Edit</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Buttons */}
                <View className="flex-row justify-between w-full">
                    <TouchableOpacity
                        className="bg-red-500 py-3 rounded-xl px-6 flex-row items-center"
                        onPress={() => {
                            dispatch(deleteFlashCard(currentCard.id));
                        }}
                    >
                        <Ionicons name="trash-outline" size={20} color="white" />
                        <Text className="text-white font-bold ml-1">Delete</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-blue-500 px-6 py-3 rounded-xl flex-row items-center"
                        onPress={() => {
                            setShowAnswer(false);
                            dispatch(nextFlashcard());
                        }}
                        disabled={currentIndex === flashcards.length - 1}
                        style={{ opacity: currentIndex === flashcards.length - 1 ? 0.5 : 1 }}
                    >
                        <Text className="text-white font-bold mr-1">Next</Text>
                        <Ionicons name="chevron-forward" size={20} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

export default FlashCard;
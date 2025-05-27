import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addFlashCard, editFlashCard } from '../ReduxToolkit/FlashCardSlice';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FlashCardForm = ({ route }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const existingCard = route.params?.card;

    const [question, setQuestion] = useState(existingCard?.question || '');
    const [answer, setAnswer] = useState(existingCard?.answer || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = () => {
        if (!question.trim() || !answer.trim()) {
            Alert.alert('Error', 'Please fill in both question and answer');
            return;
        }

        setIsSubmitting(true);
        
        const cardData = {
            id: existingCard?.id || Date.now().toString(),
            question: question.trim(),
            answer: answer.trim()
        };

        if (existingCard) {
            dispatch(editFlashCard(cardData));
            setTimeout(() => {
                setIsSubmitting(false);
                Alert.alert('Success', 'Flashcard updated successfully!');
                navigation.goBack();
            }, 500);
        } else {
            dispatch(addFlashCard(cardData));
            setTimeout(() => {
                setIsSubmitting(false);
                Alert.alert('Success', 'Flashcard added successfully!');
                navigation.goBack();
            }, 500);
        }
    };

    return (
        <ImageBackground
            source={require('../assets/Image/bg-image-1.jpg')}
            resizeMode="cover"
            className="flex-1"
        >
            <View className="flex-1 bg-black/60 p-6 justify-center">
                {/* Header */}
                <View className="mb-8">
                    <Text className="text-3xl font-bold text-white text-center">
                        {existingCard ? 'Edit Flashcard' : 'Create Flashcard'}
                    </Text>
                    <Text className="text-lg text-white/80 text-center mt-1">
                        {existingCard ? 'Update your existing card' : 'Add a new card to your collection'}
                    </Text>
                </View>

                {/* Form Container */}
                <View className="bg-white/90 rounded-xl p-6 shadow-lg">
                    {/* Question Field */}
                    <View className="mb-6">
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="help-circle-outline" size={20} color="#3B82F6" />
                            <Text className="text-lg font-medium text-gray-800 ml-2">Question</Text>
                        </View>
                        <TextInput
                            className="border-2 border-gray-200 rounded-xl p-4 text-lg bg-white"
                            multiline
                            value={question}
                            onChangeText={setQuestion}
                            placeholder="Enter your question..."
                            placeholderTextColor="#9CA3AF"
                            style={{ minHeight: 80 }}
                        />
                    </View>

                    {/* Answer Field */}
                    <View className="mb-8">
                        <View className="flex-row items-center mb-2">
                            <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                            <Text className="text-lg font-medium text-gray-800 ml-2">Answer</Text>
                        </View>
                        <TextInput
                            className="border-2 border-gray-200 rounded-xl p-4 text-lg bg-white"
                            multiline
                            value={answer}
                            onChangeText={setAnswer}
                            placeholder="Enter the answer..."
                            placeholderTextColor="#9CA3AF"
                            style={{ minHeight: 80 }}
                        />
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        className={`py-4 rounded-xl items-center justify-center flex-row 
                            ${existingCard ? 'bg-green-500' : 'bg-blue-500'} 
                            ${isSubmitting ? 'opacity-80' : ''}`}
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="white" size="small" />
                        ) : (
                            <>
                                <Ionicons 
                                    name={existingCard ? "save-outline" : "add-circle-outline"} 
                                    size={22} 
                                    color="white" 
                                />
                                <Text className="text-white text-lg font-bold ml-2">
                                    {existingCard ? 'Update Card' : 'Create Card'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Cancel Button */}
                    <TouchableOpacity
                        className="mt-4 py-3 rounded-xl items-center border-2 border-gray-300"
                        onPress={() => navigation.goBack()}
                        disabled={isSubmitting}
                    >
                        <Text className="text-gray-700 text-lg font-medium">Cancel</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

export default FlashCardForm;
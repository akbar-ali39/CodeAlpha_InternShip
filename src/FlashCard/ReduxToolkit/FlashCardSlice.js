import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  flashcards: [
    { id: '1', question: 'What is React Native?', answer: 'A framework for building mobile apps using React' },
    { id: '2', question: 'What is Redux?', answer: 'A state management library for JavaScript apps' },
  ],
  currentIndex: 0,
};

export const flashcardSlice = createSlice({
    name: "flashCards",
    initialState,
    reducers: {
        addFlashCard: (state, action) => {
            state.flashcards.push(action.payload);
        },
        editFlashCard: (state, action) => {
            const index = state.flashcards.findIndex(card => card.id === action.payload.id);
            if (index !== -1) {
                state.flashcards[index] = action.payload;
            }
        },
        deleteFlashCard: (state, action) => {
            state.flashcards = state.flashcards.filter(card => card.id !== action.payload);
            if (state.currentIndex >= state.flashcards.length) {
                state.currentIndex = Math.max(0, state.flashcards.length - 1);
            }
        },
        nextFlashcard: (state) => {
            state.currentIndex = (state.currentIndex + 1) % state.flashcards.length;
        },
        prevFlashcard: (state) => {
            state.currentIndex = (state.currentIndex - 1 + state.flashcards.length) % state.flashcards.length;
        },
    },
});

export const { addFlashCard, editFlashCard, deleteFlashCard, nextFlashcard, prevFlashcard } = flashcardSlice.actions;
export default flashcardSlice.reducer;
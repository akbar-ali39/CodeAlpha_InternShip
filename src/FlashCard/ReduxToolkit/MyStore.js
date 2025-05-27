import { configureStore } from "@reduxjs/toolkit";
import flashcardReducer from "./FlashCardSlice";

export const MyStore= configureStore({
    reducer:{
        flashCards:flashcardReducer
    }
})
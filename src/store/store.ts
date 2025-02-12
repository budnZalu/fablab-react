import { configureStore } from '@reduxjs/toolkit';
import jobReducer from './jobSlice';
import userReducer from './userSlice';
import printingDraftSlice from "./printingDraftSlice.ts";
import printingsSlice from "./printingsSlice.ts";

export const store = configureStore({
    reducer: {
        jobs: jobReducer,
        users: userReducer,
        printingDraft: printingDraftSlice,
        printings: printingsSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>; // Тип для состояния Redux
export type AppDispatch = typeof store.dispatch; // Тип для dispatch


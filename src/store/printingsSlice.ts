// src/store/printingsSlice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../api';

// Интерфейс для заявки на печать
export interface Printing {
    id: number;
    name: string | null;
    author: string;
    moderator: string | null;
    status: string; // 'draft', 'deleted', 'complete', 'formed', 'rejected'
    created_at: string;
    formed_at: string | null;
    complete_at: string | null;
    total_price: number | null;
}

// Интерфейс стейта слайса
interface PrintingsState {
    printings: Printing[];
    loading: boolean;
    error: string | null;
}

// Начальное состояние
const initialState: PrintingsState = {
    printings: [],
    loading: false,
    error: null,
};

// AsyncThunk для получения списка заявок
export const getPrintings = createAsyncThunk(
    'printings/getPrintings',
    async () => {
        const response = await api.printings.printingsList();
        return response.data;
    }
);

const printingsSlice = createSlice({
    name: 'printings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPrintings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPrintings.fulfilled, (state, action) => {
                state.loading = false;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                state.printings = action.payload;
            })
            .addCase(getPrintings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Ошибка при получении заявок';
            });
    },
});

export default printingsSlice.reducer;

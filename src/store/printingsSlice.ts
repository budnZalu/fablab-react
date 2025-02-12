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
    qr: string | null;
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

// AsyncThunk для получения списка заявок с фильтрами
export const getPrintings = createAsyncThunk(
    'printings/getPrintings',
    async (filters: { status?: string; start_date?: string; end_date?: string }) => {
        const response = await api.printings.printingsList({
            query: filters, // Передаем фильтры в запрос
        });
        return response.data;
    }
);

// AsyncThunk для удаления заявки
export const deletePrinting = createAsyncThunk(
    'printings/deletePrinting',
    async (id: string) => {
        await api.printings.printingsDelete(id);
        return id; // Возвращаем id удаленной заявки
    }
);

// AsyncThunk для завершения заявки или отклонения
export const completePrinting = createAsyncThunk(
    'printings/completePrinting',
    async ({ id, status }: { id: string; status: 'complete' | 'reject' }) => {
        await api.printings.printingsCompleteCreate(id, { status });
        return { id, status }; // Возвращаем id и статус для обновления
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
            })
            .addCase(deletePrinting.fulfilled, (state, action) => {
                // Удаляем заявку из списка по id
                state.printings = state.printings.filter(
                    (printing) => printing.id !== parseInt(action.payload)
                );
            })
            .addCase(completePrinting.fulfilled, (state, action) => {
                // Обновляем статус заявки на 'complete' или 'reject'
                const updatedPrintings = state.printings.map((printing) =>
                    printing.id === parseInt(action.payload.id)
                        ? { ...printing, status: action.payload.status === 'reject' ? 'rejected' : 'complete' }
                        : printing
                );
                state.printings = updatedPrintings;
            });
    },
});

export default printingsSlice.reducer;

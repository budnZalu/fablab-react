/* eslint-disable */
/* tslint:disable */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from "../api";

export interface Job {
    id: number;
    name: string;
    info: string;
    price: number;
    image: string | null;
    status: 'visible' | 'deleted';
}

export interface PrintingJob {
    job: Job;
    duration: number;
}

export interface PrintingJobUpdate {
    duration: number;
}

export interface PrintingData {
    name?: string | null;
    author: string;
    status: 'draft' | 'deleted' | 'complete' | 'formed' | 'rejected';
    created_at?: string | null;
    formed_at?: string | null;
    complete_at?: string | null;
    total_price?: number | null;
}

interface DraftPrintingState {
    id: number | undefined;
    job_count: number | undefined;
    isDraft: boolean;

    printingjob_set: PrintingJob[];
    printingData: PrintingData;
    error: string | null;
    status: string;
    loading: boolean;  // Для отслеживания загрузки
}

// Начальное состояние
const initialState: DraftPrintingState = {
    id: NaN,
    job_count: NaN,
    isDraft: false,

    printingjob_set: [],
    printingData: {
        name: '',
        author: '',
        status: 'draft',
        created_at: null,
        formed_at: null,
        complete_at: null,
        total_price: null,
    },
    status: '',
    error: null,
    loading: false,  // Начинаем с того, что ничего не загружается
};

// Асинхронные действия (Thunks)

export const getPrintings = createAsyncThunk(
    'printings/getPrintings',
    async () => {
        const response = await api.printings.printingsList(); // Используем параметры запроса
        return response.data;
    }
);

export const getPrinting = createAsyncThunk(
    'printing/getPrinting',
    async (id: string) => {
        const response = await api.printings.printingsRead(id);
        return response.data;
    }
);

export const addJobToPrinting = createAsyncThunk(
    'jobs/addJobToPrinting',
    async (jobId: number) => {
        const response = await api.jobs.jobsPrintingCreate(jobId.toString());
        return response.data;
    }
);

export const deletePrinting = createAsyncThunk(
    'printings/deletePrinting',
    async (id: string) => {
        const response = await api.printings.printingsDelete(id);
        return response.data;
    }
);

export const updatePrinting = createAsyncThunk(
    'printing/updatePrinting',
    async ({ id, data }: { id: string; data: PrintingData }) => {
        const printingDataToSend = {
            name: data.name ?? '',
            author: data.author,
            status: data.status,
            total_price: data.total_price ?? null,
        };
        const response = await api.printings.printingsUpdate(id, printingDataToSend);
        return response.data;
    }
);

export const updateJobInPrinting = createAsyncThunk(
    'printing/updateJob',
    async ({ id, data }: { id: string; data: PrintingJobUpdate }) => {
        const jobDataToSend = {
            duration: data.duration ?? 1,
        };
        const response = await api.jobs.jobsPrintingUpdate(id, jobDataToSend);
        return response.data;
    }
);

export const deleteJobInPrinting = createAsyncThunk(
    'printings/deleteJobInPrinting',
    async ({ id }: { id: string }) => {
        await api.jobs.jobsPrintingDelete(id);
    }
);

export const submitPrinting = createAsyncThunk(
    'printings/submitPrinting',
    async (id: string) => {
        await api.printings.printingsFormCreate(id);
    }
);

// Создание слайса
const printingDraftSlice = createSlice({
    name: 'printingDraftSlice',
    initialState,
    reducers: {
        setId: (state, action) => {
            state.id = action.payload;
        },
        setJobCount: (state, action) => {
            state.job_count = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        setPrintingData: (state, action) => {
            state.printingData = {
                ...state.printingData,
                ...action.payload,
            };
        },
        setJobInPrintingData: (state, action) => {
            const { jobId, duration } = action.payload; // Извлекаем jobId и duration
            state.printingjob_set = state.printingjob_set.map((jobItem) => {
                // Сравниваем ID услуги (преобразуем jobId к числу для безопасности)
                if (jobItem.job.id === parseInt(jobId, 10)) {
                    return {
                        ...jobItem, // Копируем текущий элемент
                        duration, // Обновляем только поле duration
                    };
                }
                return jobItem; // Возвращаем остальные элементы без изменений
            });
        },
        setJobs: (state, action) => {
            state.printingjob_set = action.payload;
        },
    },
    extraReducers: (builder) => {
        // Обработка загрузки данных для getPrinting
        builder
            .addCase(getPrinting.pending, (state) => {
                state.loading = true;
                state.error = null; // Сбрасываем ошибку
            })
            .addCase(getPrinting.fulfilled, (state, action) => {
                state.loading = false;
                const printing = action.payload;
                // @ts-ignore
                state.printingjob_set = printing.jobs;
                // @ts-ignore
                state.printingData.name = printing.name;
                // @ts-ignore
                state.printingData.author = printing.author;
                // @ts-ignore
                state.printingData.status = printing.status;
                // @ts-ignore
                state.printingData.total_price = printing.total_price;
                // @ts-ignore
                state.isDraft = printing.status === 'draft';

            })
            .addCase(getPrinting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка при получении данных.";
            });

        // Обработка добавления услуги в заявку
        builder
            .addCase(addJobToPrinting.pending, (state) => {
                state.loading = true;
                state.error = null; // Сбрасываем ошибку
            })
            .addCase(addJobToPrinting.fulfilled, (state, action) => {
                state.loading = false;
                // @ts-expect-error
                state.printingjob_set.push(action.payload); // Добавляем новую услугу
            })
            .addCase(addJobToPrinting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка при добавлении услуги.";
            });

        // Обработка удаления заявки
        builder
            .addCase(deletePrinting.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(deletePrinting.fulfilled, (state) => {
                state.loading = false;
                state.id = NaN;
                state.job_count = NaN;
                state.printingjob_set = [];
                state.printingData.name = null;
                state.printingData.author = '';
                state.printingData.status = 'draft';
                state.printingData.total_price = null;
            })
            .addCase(deletePrinting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка при удалении заявки.";
            });

        // Обработка отправки заявки
        builder
            .addCase(submitPrinting.pending, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(submitPrinting.fulfilled, (state) => {
                state.loading = false;
                state.id = NaN;
                state.job_count = NaN;
                state.printingjob_set = [];
                state.printingData.name = null;
                state.printingData.author = '';
                state.printingData.status = 'draft';
                state.printingData.total_price = null;
            })
            .addCase(submitPrinting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка при формировании заявки.";
            });

        // Обработка обновления заявки
        builder
            .addCase(updatePrinting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePrinting.fulfilled, (state, action) => {
                state.loading = false;
                // @ts-ignore
                state.printingData = action.payload;
            })
            .addCase(updatePrinting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка при обновлении заявки.";
            });

        // Обработка обновления услуги в заявке
        builder
            .addCase(updateJobInPrinting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateJobInPrinting.fulfilled, (state, action) => {
                state.loading = false;
                // @ts-ignore
                const { id, job, duration } = action.payload;
                const curJob = state.printingjob_set.find((j) => j.job.id === job.id);
                if (curJob) {
                    curJob.duration = duration;
                }
            })
            .addCase(updateJobInPrinting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Ошибка при обновлении услуги.";
            });
    },
});

// Экспортируем действия и редюсер
export const { setId, setJobCount, setError, setPrintingData, setJobInPrintingData, setJobs } = printingDraftSlice.actions;
export default printingDraftSlice.reducer;
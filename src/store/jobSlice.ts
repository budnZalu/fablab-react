/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api } from '../api/';
import { Job } from '../api/api.ts';
import {setId, setJobCount} from "./printingDraftSlice.ts";
import {mockJobs} from "../data/mock.tsx";

interface JobsState {
    searchValue: string;
    jobs: Job[];
    loading: boolean;
    error: string | null;
}

const initialState: JobsState = {
    searchValue: '',
    jobs: [],
    loading: false,
    error: null,
};


export const getJobsList = createAsyncThunk(
    'jobs/getJobsList',
    async (_, { getState, dispatch, rejectWithValue }) => {
        const { jobs }: any = getState();
        try {
            const response = await api.jobs.jobsList({job_name: jobs.searchValue});
            // @ts-ignore
            if (response.data.draft_id) {
                // @ts-ignore
                dispatch(setId(response.data.draft_id))
                // @ts-ignore
                dispatch(setJobCount(response.data.draft_count))
            }
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при загрузке данных' + error);
        }
    }
);

export const getJobById = createAsyncThunk(
    'jobs/getJobById',
    async (jobId: number, { rejectWithValue }) => {
        try {
            const response = await api.jobs.jobsRead(jobId);
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при загрузке данных о работе');
        }
    }
);

export const addJobAsync = createAsyncThunk(
    'jobs/addJob',
    async (newJob: Job, { rejectWithValue }) => {
        try {
            const response = await api.jobs.jobsCreate(newJob);
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при добавлении услуги');
        }
    }
);

export const updateJobAsync = createAsyncThunk(
    'jobs/updateJob',
    async (updatedJob: Job, { rejectWithValue }) => {
        try {
            const response = await api.jobs.jobsUpdate(updatedJob.id!, updatedJob);
            return response.data;
        } catch (error) {
            return rejectWithValue('Ошибка при обновлении услуги');
        }
    }
);

export const deleteJobAsync = createAsyncThunk(
    'jobs/deleteJob',
    async (jobId: number, { rejectWithValue }) => {
        try {
            await api.jobs.jobsDelete(jobId);
            return jobId;
        } catch (error) {
            return rejectWithValue('Ошибка при удалении услуги');
        }
    }
);

export const uploadJobImageAsync = createAsyncThunk(
    'jobs/uploadJobImage',
    async ({ id, file }: { id: number; file: File }, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('image', file);

            await api.jobs.jobsImageCreate(id, { body: formData });

            return { id, imageUrl: `http://localhost:9000/fablab/job_${id}_${file.name}` };
        } catch (error) {
            return rejectWithValue('Ошибка при загрузке изображения');
        }
    }
);

const jobSlice = createSlice({
    name: 'jobs',
    initialState,
    reducers: {
        setJobName: (state, action: PayloadAction<string>) => {
            state.searchValue = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getJobsList.fulfilled, (state, action) => {
                // @ts-ignore
                state.jobs = action.payload.jobs;
                state.loading = false
            })
            .addCase(getJobsList.rejected, (state) => {
                // @ts-ignore
                state.jobs = mockJobs
                state.loading = false
            })
            .addCase(getJobsList.pending, (state) => {
                // @ts-ignore
                state.loading = true
            })
            .addCase(addJobAsync.fulfilled, (state, action) => {
                state.jobs.push(action.payload);
            })
            .addCase(updateJobAsync.fulfilled, (state, action) => {
                const index = state.jobs.findIndex((job) => job.id === action.payload.id);
                if (index !== -1) state.jobs[index] = action.payload;
            })
            .addCase(deleteJobAsync.fulfilled, (state, action) => {
                state.jobs = state.jobs.filter((job) => job.id !== action.payload);
            })
            .addCase(getJobById.fulfilled, (state, action) => {
                // Обновляем состояние, чтобы сохранить данные о запрошенной работе

                const index = state.jobs.findIndex((job) => job.id === action.payload.id);
                if (index !== -1) {
                    state.jobs[index] = action.payload; // Обновляем существующую работу
                } else {
                    state.jobs.push(action.payload); // Добавляем новую работу, если её не было в списке
                }
            });
    },
});

export const { setJobName } = jobSlice.actions;
export default jobSlice.reducer;

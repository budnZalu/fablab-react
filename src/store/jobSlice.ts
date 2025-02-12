/* eslint-disable */
/* tslint:disable */
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {api} from '../api/'
import {Job} from '../api/api.ts'
import {mockJobs} from "../data/mock.tsx";
import {setId, setJobCount} from "./printingDraftSlice.ts";

interface JobsState {
    searchValue: string
    jobs: Job[]
    loading: boolean
    error: string | null
}

const initialState: JobsState = {
    searchValue: '',
    jobs: [],
    loading: false,
    error: null
}

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
            return rejectWithValue('Ошибка при загрузке данных');
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
            .addCase(getJobsList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getJobsList.fulfilled, (state, action) => {
                state.loading = false;
                // @ts-ignore
                state.jobs = action.payload.jobs;
            })
            .addCase(getJobsList.rejected, (state) => {
                state.loading = false;
                state.jobs = mockJobs.filter((item) =>
                    item.name.toLocaleLowerCase().startsWith(state.searchValue.toLocaleLowerCase())
                )
            });
    },
});

export const { setJobName } = jobSlice.actions;
export default jobSlice.reducer;

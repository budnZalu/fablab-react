import { createSlice } from '@reduxjs/toolkit';

const jobSlice = createSlice({
    name: 'jobs',
    initialState: {
        job_name: '',
    },
    reducers: {
        setJobName: (state, action) => {
            state.job_name = action.payload;
        },
    },
});

export const { setJobName } = jobSlice.actions;
export default jobSlice.reducer;

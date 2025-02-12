import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {AxiosError} from 'axios';
import {api} from '../api';

interface ApiError {
    error: string;
    response?: {
        status: number;
        data: {
            error?: string;
        };
    };
}

interface UserState {
    email: string;
    firstName?: string;
    lastName?: string;
    isAuthenticated: boolean;
    error?: string | null;
}

const initialState: UserState = {
    email: '',
    firstName: '',
    lastName: '',
    isAuthenticated: false,
    error: null,
};

// Асинхронное действие для авторизации
export const loginUserAsync = createAsyncThunk(
    'user/loginUserAsync',
    async (credentials: { email: string; password: string }, {rejectWithValue}) => {
        try {
            const response = await api.login.loginCreate(credentials);
            console.log(response.data);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>; // Типизируем ошибку как AxiosError
            if (axiosError.response && axiosError.response.status === 400) {
                // Если статус 400 и есть тело ответа с ошибкой
                const errorMessage = axiosError.response.data?.error || 'Неверный логин или пароль.';
                return rejectWithValue(errorMessage);
            } else {
                // Для всех других ошибок
                return rejectWithValue('Ошибка авторизации');
            }
        }
    }
);

// Асинхронное действие для деавторизации
export const logoutUserAsync = createAsyncThunk(
    'user/logoutUserAsync',
    async (_, {rejectWithValue}) => {
        try {
            const response = await api.logout.logoutCreate();
            return response.data;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            return rejectWithValue('Ошибка при выходе из системы');
        }
    }
);

// Асинхронное действие для получения текущего пользователя
export const fetchCurrentUserAsync = createAsyncThunk(
    'user/fetchCurrentUserAsync',
    async (_, {rejectWithValue}) => {
        try {
            const response = await api.users.currentUser();
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            if (axiosError.response && axiosError.response.status === 401) {
                return rejectWithValue('Пользователь не аутентифицирован');
            } else {
                return rejectWithValue('Ошибка при получении данных пользователя');
            }
        }
    }
);

export const registerUserAsync = createAsyncThunk(
    'user/registerUserAsync',
    async (userData: { email: string; first_name: string; last_name: string; password: string }, { rejectWithValue }) => {
        try {
            const response = await api.users.usersCreate(userData);
            return response.data;
        } catch (error) {
            const axiosError = error as AxiosError<ApiError>;
            if (axiosError.response && axiosError.response.status === 400) {
                return rejectWithValue(axiosError.response.data?.error || 'Ошибка при регистрации');
            }
            return rejectWithValue('Ошибка при регистрации');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loginUserAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(loginUserAsync.fulfilled, (state, action) => {
                const {email, firstName, lastName} = action.payload;
                state.email = email;
                state.firstName = firstName;
                state.lastName = lastName;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUserAsync.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isAuthenticated = false;
            })

            .addCase(logoutUserAsync.fulfilled, (state) => {
                state.email = '';
                state.firstName = '';
                state.lastName = '';
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(logoutUserAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            })

            // Обработка состояний для fetchCurrentUserAsync
            .addCase(fetchCurrentUserAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(fetchCurrentUserAsync.fulfilled, (state, action) => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const {status} = action.payload;
                if (status === 'Not authenticated') {
                    state.isAuthenticated = false;
                } else {
                    const {email, firstName, lastName} = action.payload;
                    state.email = email;
                    state.firstName = firstName;
                    state.lastName = lastName;
                    state.isAuthenticated = true;
                    state.error = null;
                }


            })
            .addCase(fetchCurrentUserAsync.rejected, (state, action) => {
                state.error = action.payload as string;
                state.isAuthenticated = false;
            })
            .addCase(registerUserAsync.pending, (state) => {
                state.error = null;
            })
            .addCase(registerUserAsync.fulfilled, (state) => {
                state.error = null;
            })
            .addCase(registerUserAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

// eslint-disable-next-line no-empty-pattern
export const {} = userSlice.actions;
export default userSlice.reducer;
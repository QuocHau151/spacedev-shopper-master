import { authService } from "@/services/auth"
import { userService } from "@/services/user"
import { clearToken, clearUser, getToken, getUser, setToken, setUser } from "@/utils/token"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"



export const loginThunkAction = createAsyncThunk('auth/login', async (data, thunkApi) => {
    try {
        const res = await authService.login(data)
        setToken(res.data)
        const user = await userService.getProfile()
        setUser(user.data)
        // thunkApi.dispatch(authActions.setUser(user.data))
        thunkApi.fulfillWithValue(user.data)
        // dispatch({ type: SET_USER_ACTION, payload: user.data })
        return user.data
    } catch (err) {
        console.error(err)
        thunkApi.rejectWithValue(err.response.data)
        throw err?.response.data
    }
})

export const logoutThunkAction = createAsyncThunk('auth/logout', async (_, thunkApi) => {
    thunkApi.dispatch(authActions.logout())
    clearToken()
    clearUser()
})

export const getUserThunkAction = createAsyncThunk('auth/getUser', async (_, thunkApi) => {
    try {
        if(getToken()) {
            const user = await userService.getProfile()
            thunkApi.dispatch(setUserAction(user.data))
        }
    } catch (err) {
        console.error(err)
    }
})

export const setUserAction = createAsyncThunk('auth/setUser', (user, thunkApi) => {
    setUser(user)
    thunkApi.dispatch(authActions.setUser(user))
})

export const { reducer: authReducer, actions: authActions } = createSlice({
    initialState: () => ({
        user: getUser(),
        status: 'idle',
        loginLoading: false
    }),
    name: 'auth',
    reducers: {
        logout: (state) => {
            state.user = null
        },
        setUser: (state, action) => {
            state.user = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginThunkAction.pending, (state) => {
            state.status = 'pending'
            state.loginLoading = true
        })
        builder.addCase(loginThunkAction.fulfilled, (state, action) => {
            state.user = action.payload
            state.status = 'success'
            state.loginLoading = false
        })
        builder.addCase(loginThunkAction.rejected, (state) => {
            state.status = 'error'
            state.loginLoading = false
        })
    }
})

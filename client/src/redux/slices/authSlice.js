import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    token: localStorage.getItem('token') || '',
    user: null,
}

export const counterSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        SET_AUTH: (state, action) => {
            state.user = action.payload;
            state.token = localStorage.getItem('token')
        },
        LOGOUT: (state, action) => {
            state.user = null
            state.token = null
            localStorage.clear()
        },

        // decrement: (state) => {
        //     state.value -= 1
        // },
        // incrementByAmount: (state, action) => {
        //     state.value += action.payload
        // },

    },
})

// Action creators are generated for each case reducer function
export const { SET_AUTH, LOGOUT } = counterSlice.actions

export default counterSlice.reducer
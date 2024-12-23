import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice.js'
import feedReducer from './slices/feedSlice.js'

export const store = configureStore({
    reducer: {
        auth: authReducer,
        feedPosts: feedReducer,
    },
})
import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import authSlice from '../features/auth/authSlice'
import { appointmentApi } from './services/appointments'
export const store = configureStore({
  reducer: {
    auth: authSlice,
    [appointmentApi.reducerPath]: appointmentApi.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger, appointmentApi.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
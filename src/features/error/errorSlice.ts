import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'


interface ErrorState {
  msg: object;
  status: number | null;
  id: string | null;
}

// Define the initial state using that type
const initialState: ErrorState = {
  msg: {},
  status: null,
  id: null
}

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    getErrors: (state, action : PayloadAction<ErrorState>) => {
        state.msg = action.payload.msg;
        state.status = action.payload.status;
        state.id = action.payload.id;
    },
    clearErrors: state => {
        state.msg = initialState.msg;
        state.status = initialState.status;
        state.id = initialState.id;
    }
  },
})

export const { getErrors, clearErrors } = errorSlice.actions


export const selectErrorState = (state: RootState) => state.errors

export default errorSlice.reducer
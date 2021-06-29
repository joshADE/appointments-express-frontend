import { createSlice, PayloadAction, ThunkAction, AnyAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { getErrors } from '../error/errorSlice'
import { getConfig, getTokenFromUserState } from '../user/userSlice'
import { storeAPI } from './storeAPI'
import { StoreWithDetails } from './storeTypes'


interface StoreState {
  isLoading: boolean;
  stores: StoreWithDetails[];
}

// Define the initial state using that type
const initialState: StoreState = {
  isLoading: false,
  stores: []
}

export const storeSlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    replaceAllStores: (state, action: PayloadAction<StoreWithDetails[]>) => {
      state.stores = action.payload;
      state.isLoading = false;
    },
    storeLoading: state => {
      state.isLoading = true;
    },
    loadingFailed: state => {
      state.isLoading = false;
    },
  },
})

export const { replaceAllStores, storeLoading, loadingFailed  } = storeSlice.actions

export const fetchAllUserStore = () : ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, getState)  => {
  try {
    dispatch(storeLoading());
    const storeRes = await storeAPI.stores().fetchAllUserStores(getConfig(getTokenFromUserState(getState)));
    dispatch(replaceAllStores(storeRes.data));
  }catch(err){
    console.log(err);
    if (err.response){
      dispatch(getErrors({
        msg: err.response.data,
        status: err.response.status,
        id: null
      }));
    }
    dispatch(loadingFailed());
  }
}

export const selectStoreState = (state: RootState) => state.stores

export default storeSlice.reducer
import { createSlice, PayloadAction, CaseReducer, ThunkAction, AnyAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { User, UserLoginData, UserRegisterData } from './userTypes'
import { userAPI } from './userAPI'
import { getErrors } from '../error/errorSlice'

export const getConfig = (token: string) => ({
  headers: { 
      Authorization: `Bearer ${token}`,    
  }
})

export const getTokenFromUserState = (getState: () => RootState) => getState().users.token as string


const loggedIn : CaseReducer<UserState, PayloadAction<{token: string; user: User }>> = (state, { payload }) => {
    localStorage.setItem('auth-token', payload.token);
    state.token = payload.token;
    state.isAuthenticated = true;
    state.isLoading = false;
    state.user = payload.user;
}

const loggedOut : CaseReducer<UserState> = (state) => {
    localStorage.removeItem('auth-token');
    state.token = null;
    state.user = null;
    state.isAuthenticated = false;
    state.isLoading = false;
  }

interface UserState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  allUsers: User[];
}

// Define the initial state using that type
const initialState: UserState = {
  isAuthenticated: false,
  isLoading: false,
  token: localStorage.getItem('auth-token'),
  user: null,
  allUsers: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    replaceAllUsers: (state, action: PayloadAction<User[]>) => {
      state.allUsers = action.payload;
      state.isLoading = false;
    },
    userLoading: state => {
      state.isLoading = true;
    },
    loadingFailed: state => {
      state.isLoading = false;
    },
    userLoaded: (state, action: PayloadAction<User> ) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.user = action.payload;
    },
    loginSuccess: loggedIn,
    registerSuccess: loggedIn,
    authError: loggedOut,
    loginFail: loggedOut,
    logoutSuccess: loggedOut,
    registerFail: loggedOut
  },
})

export const { replaceAllUsers, userLoading, loadingFailed, userLoaded, loginSuccess, registerSuccess, authError, loginFail, logoutSuccess, registerFail } = userSlice.actions


export const loadUser = (onFailure: Function) : ThunkAction<void, RootState, unknown, AnyAction> => async (dispatch, getState)  => {
  try {
    dispatch(userLoading());
    const userRes = await userAPI.users().loadUser(getConfig(getTokenFromUserState(getState)));
    dispatch(userLoaded(userRes.data));
  }catch(err){
    console.log(err);
    if (err.response){
      dispatch(getErrors({
        msg: err.response.data,
        status: err.response.status,
        id: null
      }));
    }
    dispatch(authError());
    onFailure();
  }
}

export const fetchAllUser = () : ThunkAction<void, RootState, unknown, AnyAction> => async dispatch  => {
  try {
    dispatch(userLoading());
    const userRes = await userAPI.users().fetchAll();
    dispatch(replaceAllUsers(userRes.data));
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

export const register = (newUser: UserRegisterData, onSuccess: Function, onFailure: Function) : ThunkAction<void, RootState, unknown, AnyAction> => async dispatch  => {
  try {
    dispatch(userLoading());
    await userAPI.users().register(newUser);
    
    const loginRes = await userAPI.users().login({ username: newUser.username, password: newUser.password });

    dispatch(registerSuccess(loginRes.data))
    onSuccess();
  }catch(err){
    console.log(err);
    if (err.response){
      dispatch(getErrors({
        msg: err.response.data,
        status: err.response.status,
        id: 'REGISTER_FAIL'
      }));
    }
    dispatch(registerFail());
    onFailure();
  }
}

export const login = (returningUser: UserLoginData, onSuccess: Function, onFailure: Function) : ThunkAction<void, RootState, unknown, AnyAction> => async dispatch  => {
  try {
    dispatch(userLoading());
    
    
    const loginRes = await userAPI.users().login(returningUser);

    dispatch(loginSuccess(loginRes.data))
    onSuccess();
  }catch(err){
    console.log(err);
    if (err.response){
      dispatch(getErrors({
        msg: err.response.data,
        status: err.response.status,
        id: 'LOGIN_FAIL'
      }));
    }
    dispatch(loginFail());
    onFailure();
  }
}

export const selectUserState = (state: RootState) => state.users

export default userSlice.reducer
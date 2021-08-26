import { createSlice, CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { appointmentApi } from '../../app/services/appointments';
import { RootState } from '../../app/store';
import { User } from '../user/userTypes';




interface AuthState {
    token: string | null;
    isAuthenticated: boolean;
    user: User | null;
}

const loggedIn : CaseReducer<AuthState, PayloadAction<{token: string; user: User }>> = (state, action) => {
    console.log('logged in', action);
    localStorage.setItem('auth-token', action.payload.token);
    state.token = action.payload.token;
    state.isAuthenticated = true;
    state.user = action.payload.user;
}

const loggedOut : CaseReducer<AuthState> = (state) => {
    console.log('logged out');
    localStorage.removeItem('auth-token');
    state.token = null;
    state.user = null;
    state.isAuthenticated = false;
}



const initialState : AuthState = {
    user: null,
    token: localStorage.getItem('auth-token'),
    isAuthenticated: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: loggedOut
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(appointmentApi.endpoints.login.matchPending, (state, action) => {
                console.log('pending', action);
            })
            .addMatcher(appointmentApi.endpoints.login.matchFulfilled, loggedIn)
            .addMatcher(appointmentApi.endpoints.login.matchRejected, loggedOut)
            .addMatcher(appointmentApi.endpoints.register.matchPending, (state, action) => {
                console.log('pending', action);
            })
            .addMatcher(appointmentApi.endpoints.register.matchFulfilled, (state, action) => {
                console.log('fulfilled', action);
            })
            .addMatcher(appointmentApi.endpoints.register.matchRejected, loggedOut)
            .addMatcher(appointmentApi.endpoints.loadUser.matchPending, (state, action) => {
                console.log('pending', action);
            })
            .addMatcher(appointmentApi.endpoints.loadUser.matchFulfilled, (state, action) => {
                console.log('fulfilled', action);
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addMatcher(appointmentApi.endpoints.loadUser.matchRejected, loggedOut)
            .addMatcher(appointmentApi.endpoints.editAvatar.matchFulfilled, (state, action) => {
                console.log('fulfilled', action);
                state.user = action.payload;
            })
            .addMatcher(appointmentApi.endpoints.editAccount.matchFulfilled, (state, action) => {
                console.log('fulfilled', action);
                state.user = action.payload;
            })
            .addMatcher(appointmentApi.endpoints.deleteAccount.matchFulfilled, loggedOut)
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

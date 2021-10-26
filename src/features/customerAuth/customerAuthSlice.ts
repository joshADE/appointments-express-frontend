import { createSlice, CaseReducer, PayloadAction } from '@reduxjs/toolkit';
import { appointmentApi } from '../../app/services/appointments';
import { RootState } from '../../app/store';
import { Customer, CustomerAuthRequest, CustomerAuthResponse } from './customerAuthTypes';




interface CustomerAuthState {
    authRequest: CustomerAuthRequest | null;
    isCustomerAuthenticated: boolean;
    customer: Customer | null;
}

const loggedIn : CaseReducer<CustomerAuthState, PayloadAction<CustomerAuthResponse>> = (state, action) => {
    console.log('logged in as customer', action);
    state.authRequest = action.payload.request;
    state.isCustomerAuthenticated = true;
    state.customer = action.payload.customer;
}

const loggedOut : CaseReducer<CustomerAuthState> = (state) => {
    console.log('logged out as customer');
    state.authRequest = null;
    state.customer = null;
    state.isCustomerAuthenticated = false;
}



const initialState : CustomerAuthState = {
    customer: null,
    authRequest: null,
    isCustomerAuthenticated: false
}

export const customerAuthSlice = createSlice({
    name: 'customerAuth',
    initialState,
    reducers: {
        logoutCustomer: loggedOut
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(appointmentApi.endpoints.loginCustomer.matchFulfilled, loggedIn)
            .addMatcher(appointmentApi.endpoints.loginCustomer.matchRejected, loggedOut)
    }
});

export const { logoutCustomer } = customerAuthSlice.actions;
export default customerAuthSlice.reducer;

export const selectIsCustomerAuthenticated = (state: RootState) => state.customerAuth.isCustomerAuthenticated;

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { User, UserLoginData, UserEditAccountData } from '../../features/user/userTypes';
import { StoreWithDetails, CreateStoreRequest, Store, StoreHours, UpdateClosedRequest, UserAndRoleForStore, StoreAndTimes } from '../../features/store/storeTypes';
import { converObjectToReplaceJsonPatch } from '../../features/commonTypes';
import { baseUrl } from '../../axios';
import { Appointment, AppointmentAndStore, CreateAppointmentRequest, UpdateAppointmentStatusRequest } from '../../features/appointment/appointmentTypes';
import { CustomerAuthResponse, CustomerAuthRequest } from '../../features/customerAuth/customerAuthTypes';

function providesList<R extends { id: string | number }[], T extends string>(
    resultsWithIds: R | undefined,
    tagType: T
) {
    return resultsWithIds 
    ?   [
            { type: tagType, id: 'LIST' },
            ...resultsWithIds.map(({ id }) => ({ type: tagType, id })),
        ]
    : [{ type: tagType, id: 'LIST' }]
}

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if(token){
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
});

export const appointmentApi = createApi({
    baseQuery,
    tagTypes: ['Store', 'User', 'Appointment'],
    endpoints: (build) => ({
        login: build.mutation<{token: string; user: User}, UserLoginData>({
            query: (credentials: UserLoginData) => ({ url: 'users/login', method: 'POST', body: credentials }),
            invalidatesTags: ['Store', 'User', 'Appointment']       // for the case where a user logs out of one account and immediately into another, clear cache
        }),
        register: build.mutation<User, FormData>({
            query: (credentials: FormData) => ({ url: 'users/register', method: 'POST', body: credentials }),
            invalidatesTags: ['Store', 'User', 'Appointment']
        }),
        loadUser: build.query<User, void>({
            query: () => ({ url: 'users/loadUser'}),
        }),
        getUsers: build.query<User[], void>({
            query: () => ({ url: 'users'}),
            providesTags: (result) => providesList(result?.map(({ id }) => ({id})), 'User'),
        }),
        getStores: build.query<Store[], void>({
            query: () => ({ url: 'stores'}),
            providesTags: (result) => providesList(result?.map(({ id }) => ({id})), 'Store'),
        }),
        getAllUserStores: build.query<StoreWithDetails[], void>({
            query: () => ({ url: 'stores/userstores' }),
            providesTags: (result) => providesList(result?.map(({ store: { id } }) => ({id})), 'Store'),
        }),
        getStoreAndTimes: build.query<StoreAndTimes, number>({
            query: (id) => ({ url: `stores/storeandtimes/${id}` }),
            providesTags: (result, error, args) => [{ type: 'Store', id: args }]
        }),
        createStore: build.mutation<StoreWithDetails, CreateStoreRequest>({
            query: (newStore: CreateStoreRequest) => ({ url: 'stores/createstore', method: 'POST', body: newStore }),
            invalidatesTags: [{ type: 'Store', id: 'LIST' }],
        }),
        editStoreInfo: build.mutation<StoreWithDetails, { id: number ;store: Partial<Store> }>({
            query: (data) => ({ url: `stores/${data.id}`, method: 'PATCH', body: converObjectToReplaceJsonPatch(data.store) }),
            invalidatesTags: (result, error, args) => [{ type: 'Store', id: args.id }]
        }),
        editStoreHours: build.mutation<StoreWithDetails, { id: number ;hours: Partial<StoreHours>[] }>({
            query: (data) => ({ url: `stores/hours/${data.id}`, method: 'PUT', body: data.hours }),
            invalidatesTags: (result, error, args) => [{ type: 'Store', id: args.id }]
        }),
        editStoreClosedDaysAndTimes: build.mutation<StoreWithDetails, { id: number ;closed: UpdateClosedRequest }>({
            query: (data) => ({ url: `stores/closed/${data.id}`, method: 'PUT', body: data.closed }),
            invalidatesTags: (result, error, args) => [{ type: 'Store', id: args.id }]
        }),
        deleteStore: build.mutation<Store, number>({
            query: (id) => ({ url: `stores/${id}`, method: 'DELETE'}),
            invalidatesTags: (result, error, args) => [{ type: 'Store', id: args }]
        }),
        getUsersAndRolesByStoreId: build.query<UserAndRoleForStore[], number>({
            query: (id) => ({ url: `users/usersandrolesforstore/${id}`}),
            providesTags: ['User', 'Store']
        }),
        appointRole: build.mutation<void, {role: string; storeId: number; username: string}>({
            query: (args) => ({ url: `users/appoint/${args.role}/${args.storeId}/${args.username}`, method: 'POST'}),
            invalidatesTags: ['User', 'Store']
        }),
        unappointRole: build.mutation<void, {role: string; storeId: number; username: string}>({
            query: (args) => ({ url: `users/unappoint/${args.role}/${args.storeId}/${args.username}`, method: 'POST'}),
            invalidatesTags: ['User', 'Store']
        }),
        editAvatar: build.mutation<User, FormData>({
            query: (formData) => ({ url: 'users/editavatar', method: 'PATCH', body: formData}),
            invalidatesTags: ['User']
        }),
        editAccount: build.mutation<User, UserEditAccountData>({
            query: (data) => ({ url: 'users/editaccount', method: 'PATCH', body: converObjectToReplaceJsonPatch(data)}),
            invalidatesTags: ['User']
        }),
        deleteAccount: build.mutation<User, void>({
            query: () => ({ url: 'users/deleteaccount', method: 'DELETE'}),
            invalidatesTags: ['User', 'Store', 'Appointment']
        }),
        getAllStoreAppointments: build.query<Appointment[], number>({
            query: (id) => ({ url: `appointments/storeappointments/${id}`}),
            providesTags: (result) => providesList(result?.map(({ id }) => ({id})), 'Appointment'),
        }),
        createAppointment: build.mutation<Appointment, CreateAppointmentRequest>({
            query: (data: CreateAppointmentRequest) => ({ url: 'appointments/createappointment', method: 'POST', body: data}),
            invalidatesTags: [{ type: 'Appointment', id: 'LIST' }],
        }), 
        updateAppointmentsStatus: build.mutation<Appointment[], { id: number ; data: UpdateAppointmentStatusRequest[]}>({
            query: ({ id ,data}) => ({ url: `appointments/updateappointmentsstatus/${id}`, method: 'PUT', body: data}),
            invalidatesTags: [{ type: 'Appointment', id: 'LIST' }], 
        }),
        loginCustomer: build.mutation<CustomerAuthResponse, CustomerAuthRequest>({
            query: (credentials) => ({ url: 'appointments/logincustomer', method: 'POST', body: credentials }),
            invalidatesTags: ['Store', 'User', 'Appointment'],
        }),
        getCustomerAppointments: build.query<Appointment[], number>({
            query: (customerId) => ({ url: `appointments/customerappointments/${customerId}`, method: 'GET' }),
            providesTags: (result) => providesList(result?.map(({ id }) => ({id})), 'Appointment'),
        }),
        getAppointmentAndStoreDetails: build.query<AppointmentAndStore, number>({
            query: (appointmentId) => ({ url: `appointments/customerappointmentdetails/${appointmentId}`, method: 'GET'}),
            providesTags: (result, error, args) => [{ type: 'Appointment', id: args}, {type: 'Store', id: result? result.store.id: 'LIST' }],
        }),
    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLoadUserQuery,
    useGetUsersQuery,
    useGetStoresQuery,
    useGetAllUserStoresQuery,
    useGetStoreAndTimesQuery,
    useCreateStoreMutation,
    useEditStoreInfoMutation,
    useEditStoreHoursMutation,
    useEditStoreClosedDaysAndTimesMutation,
    useDeleteStoreMutation,
    useGetUsersAndRolesByStoreIdQuery,
    useAppointRoleMutation,
    useUnappointRoleMutation,
    useEditAvatarMutation,
    useEditAccountMutation,
    useDeleteAccountMutation,
    useGetAllStoreAppointmentsQuery,
    useCreateAppointmentMutation,
    useUpdateAppointmentsStatusMutation,
    useLoginCustomerMutation,
    useGetCustomerAppointmentsQuery,
    useGetAppointmentAndStoreDetailsQuery,
} = appointmentApi;


export const {
    endpoints: { login, register, editAvatar, editAccount, deleteAccount, loginCustomer }
} = appointmentApi;
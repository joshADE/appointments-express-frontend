import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { User, UserLoginData, UserRegisterData } from '../../features/user/userTypes';
import { StoreWithDetails, CreateStoreRequest, Store, StoreHours, UpdateClosedRequest } from '../../features/store/storeTypes';
import { converObjectToReplaceJsonPatch } from '../../features/commonTypes';

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
    baseUrl: 'https://localhost:44371/api',
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
        }),
        register: build.mutation<User, UserRegisterData>({
            query: (credentials: UserRegisterData) => ({ url: 'users/register', method: 'POST', body: credentials }),
        }),
        loadUser: build.query<User, void>({
            query: () => ({ url: 'users/loadUser'}),
        }),
        getUsers: build.query<User[], void>({
            query: () => ({ url: 'users'}),
            providesTags: (result) => providesList(result?.map(({ id }) => ({id})), 'User'),
        }),
        getAllUserStores: build.query<StoreWithDetails[], void>({
            query: () => ({ url: 'stores/userstores' }),
            providesTags: (result) => providesList(result?.map(({ store: { id } }) => ({id})), 'Store'),
        }),
        createStore: build.mutation<StoreWithDetails, CreateStoreRequest>({
            query: (newStore: CreateStoreRequest) => ({ url: 'stores/createstore', method: 'POST', body: newStore }),
            invalidatesTags: [{ type: 'Store', id: 'LIST' }],
        }),
        editStoreInfo: build.mutation<StoreWithDetails, { id: number ;store: Partial<Store> }>({
            query: (data) => ({ url: `stores/${data.id}`, method: 'PATCH', body: converObjectToReplaceJsonPatch(data.store) }),
            invalidatesTags: (result, error, args) => [{ type: 'Store', id: args.id }, { type: 'Store', id: 'LIST' }]
        }),
        editStoreHours: build.mutation<StoreWithDetails, { id: number ;hours: Partial<StoreHours>[] }>({
            query: (data) => ({ url: `stores/hours/${data.id}`, method: 'PUT', body: data.hours }),
            invalidatesTags: (result, error, args) => [{ type: 'Store', id: args.id }, { type: 'Store', id: 'LIST' }]
        }),
        editStoreClosedDaysAndTimes: build.mutation<StoreWithDetails, { id: number ;closed: UpdateClosedRequest }>({
            query: (data) => ({ url: `stores/closed/${data.id}`, method: 'PUT', body: data.closed }),
            invalidatesTags: (result, error, args) => [{ type: 'Store', id: args.id }, { type: 'Store', id: 'LIST' }]
        }),
    })
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLoadUserQuery,
    useGetUsersQuery,
    useGetAllUserStoresQuery,
    useCreateStoreMutation,
    useEditStoreInfoMutation,
    useEditStoreHoursMutation,
    useEditStoreClosedDaysAndTimesMutation,
} = appointmentApi;


export const {
    endpoints: { login, register }
} = appointmentApi;
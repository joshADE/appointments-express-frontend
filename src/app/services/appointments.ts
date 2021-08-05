import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { User, UserLoginData, UserRegisterData } from '../../features/user/userTypes';
import { StoreWithDetails, CreateStoreRequest, Store, StoreHours, UpdateClosedRequest, UserAndRoleForStore } from '../../features/store/storeTypes';
import { converObjectToReplaceJsonPatch } from '../../features/commonTypes';
import { baseUrl } from '../../axios';

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
    useDeleteStoreMutation,
    useGetUsersAndRolesByStoreIdQuery,
    useAppointRoleMutation,
} = appointmentApi;


export const {
    endpoints: { login, register }
} = appointmentApi;
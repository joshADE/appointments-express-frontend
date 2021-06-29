import axios from '../../axios'
import { AxiosRequestConfig } from 'axios'
// axios.ts has the base url
import {User, UserLoginData, UserRegisterData } from './userTypes'

const path = "/api/users/"

export const userAPI = {
    users(url = path) {
        return {
            fetchAll: () => axios.get<User[]>(url),
            fetchById: (id: number | string) => axios.get<User>(url + id),
            loadUser: (config: AxiosRequestConfig) => axios.get<User>(url + 'loadUser', config),
            register: (newUser: UserRegisterData) => axios.post<User>(url + 'register', newUser),
            login: (returningUser: UserLoginData) => axios.post<{token:string; user: User}>(url + 'login', returningUser)
        }
    }
}
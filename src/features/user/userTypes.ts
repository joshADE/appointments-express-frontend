export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    createdAt: string;
}

export interface UserRegisterData {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
}

export interface UserLoginData {
    username: string;
    password: string;
}
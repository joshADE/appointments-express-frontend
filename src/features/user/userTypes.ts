export interface User {
    id: number;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    createdAt: string;
    avatarPublicId: string | null;
    avatarUrl: string | null;
}

export interface UserRegisterData {
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    email: string;
    avatar: File | null;
}

export interface UserLoginData {
    username: string;
    password: string;
}

export type UserEditAvatarData = Pick<UserRegisterData, 'avatar'>;

export type UserEditAccountData = Partial<Omit<UserRegisterData, 'avatar'>>;
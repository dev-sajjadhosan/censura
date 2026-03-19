export interface IRegisterUser {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface ILoginUser {
    email: string;
    password: string;
}

export interface IResetPassword {
    email: string;
    password: string;
    confirmPassword: string;
    token: string;
}

export interface IForgotPassword {
    email: string;
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}
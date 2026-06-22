export interface IBalance {
    success: boolean;
    msg: string;
    account?: {
        balance ?: number;
        amount ?: number;
        userId: string;
    }
    error?: string;
}


export interface IData {
    success: boolean;
    msg: string;
    page?: number;
    totalPage?: number;
    limit?: number;
    error?: string;
    allUsers: IUser[]
}

export interface IUser {
    _id: string;
    firstName: string;
    email: string;
    lastName?: string | null;
}
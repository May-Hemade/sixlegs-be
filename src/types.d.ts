export interface Error {
    status: number,
    message: string,
    errorsList: string
}
export interface User {
    _id: string;
    firstName: string,
    lastName: string,
    gender?: string;
    email: string;
    avatar?: string;
    password: string;

}

export interface UserPayload {
    _id: string
}






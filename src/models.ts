export interface Error {
  status: number
  message: string
  errorsList: string
}
export interface User {
  id: string
  firstName: string
  lastName: string
  gender?: string
  email: string
  avatar?: string
  password: string
  description?: string
  role: string
}

export interface UserPayload {
  id: string
  role: string
}

export interface Pet {
  id: string
  petName: string
  lastName: string
  gender?: string
  species?: string
  avatar?: string
  dob: Date
  description?: string
  ownerId: string
}

export enum UserRole {
  User = "User",
  Admin = "Admin",
}

declare global {
  namespace Express {
    // override User in express
    interface User {
      id: string
      token?: string
      role: string
    }
  }
}

export interface Error {
  status: number
  message: string
  errorsList: string
}
export interface User {
  id: number
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
  id: number
  role: string
}

export interface Pet {
  id: number
  petName: string
  lastName: string
  gender?: string
  species?: string
  avatar?: string
  dob: Date
  description?: string

  ownerId: number
}

export interface Product {
  id: number
  productName: string
  shop?: string
  website?: string
  description?: string
}

export enum UserRole {
  User = "User",
  Admin = "Admin",
}

declare global {
  namespace Express {
    // override User in express
    interface User {
      id: number
      token?: string
      role: string
    }
  }
}

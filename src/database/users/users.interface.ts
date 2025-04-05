import { Article } from '../articles/articles.entity';

export interface IUser {
  id: number;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  articles: Article[];
}

export interface ICreateUser {
  email: string;
  name: string;
  password: string;
}

export interface ICreateUserResponse {
  id: number;
}

export interface IFindUserByIdResponse {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}

export interface IFindAllUsersResponse {
  id: number;
  email: string;
  name: string;
  createdAt: Date;
}

export interface IUpdateUser {
  email?: string;
  name?: string;
  password?: string;
}

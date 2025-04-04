import { User } from '../users/users.entity';
import {
  IFindAllUsersResponse,
  IFindUserByIdResponse,
} from '../users/users.interface';

export interface IArticle {
  id: number;
  title: string;
  description: string;
  publishedAt: Date;
  author: User;
}

export interface ICreateArticle {
  title: string;
  description: string;
  author: User;
}

export interface ICreateArticleService {
  title: string;
  description: string;
}

export interface ICreateArticleResponse {
  id: number;
}

export interface IFindAllArticlesResponse {
  id: number;
  title: string;
  description: string;
  publishedAt: Date;
  author: IFindAllUsersResponse;
}

export interface IFindArticleByIdResponse {
  id: number;
  title: string;
  description: string;
  publishedAt: Date;
  author: IFindUserByIdResponse;
}

export interface IFindArticlesQuery {
  page?: number;
  limit?: number;
  publishedAfter?: string; // Дата после которой статьи
  publishedBefore?: string; // Дата до которой статьи
  authorId?: number; // ID автора для фильтрации
}

export interface IPaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasNextPage: boolean;
}

export interface IUpdateArticle {
  title?: string;
  description?: string;
}

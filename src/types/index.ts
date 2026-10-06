export interface ApiResult<T = unknown> {
  status?: string;
  success?: boolean;
  message?: string;
  data?: T;
}

export interface PostAuthor {
  id: string;
  name: string;
  photo?: string | null;
}

export interface PostComment {
  id: string;
  comment: string;
  created_at?: string;
  user_id?: string;
  name?: string;
  user?: PostAuthor;
}

export interface Post {
  id: string;
  description: string;
  cover?: string | null;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  user?: PostAuthor;
  author?: PostAuthor;
  likes?: unknown[] | number;
  comments?: PostComment[] | number;
  total_likes?: number;
  total_comments?: number;
}

export interface User {
  id: string;
  name: string;
  email?: string;
  photo?: string | null;
}

export interface User {
  id: number | undefined;
  name: string;
  surname: string;
  desc: string;
  avatar: string | null;
}

export interface Action<T> {
  type: T;
}

export interface ActionPayload<T, P> {
  type: T;
  payload: P;
}
export interface IFullResult<T> {
  status?: boolean;
  data?: T[];
}

export interface IPageResult<T> {
  status?: boolean;
  data?: T[];
  total?: number;
}
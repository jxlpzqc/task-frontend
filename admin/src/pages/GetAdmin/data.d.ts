// export enum PostTaskStatus {
//   WAITING_FOR_CHECK,
//   REJECT,
//   SUCCEED,
//   RECEIVED,
//   FINISHED
// }

export interface IPostTask {
  id: string;
  status: PostTaskStatus;
  title: string;
  content: string;
  price: number;
  remain: number;

}

// export interface TableListPagination {
//   total: number;
//   pageSize: number;
//   current: number;
// }

// export interface TableListData {
//   list: IPostTask[];
//   pagination: Partial<TableListPagination>;
// }

// export interface TableListParams {
//   sorter?: string;
//   status?: string;
//   name?: string;
//   desc?: string;
//   key?: number;
//   pageSize?: number;
//   currentPage?: number;
// }

export interface IQueryRequest {
  selectUser?: boolean;
  username?: string;
  page?: number;
  size?: number;
}
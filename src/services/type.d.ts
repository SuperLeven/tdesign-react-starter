interface ListParams {
  pageSize: number;
  current: number;
}

type ListResult<T> = {
  list: T[];
  total: number;
};

type CommonResult<T> = {
  data: T;
  code: number;
  success: boolean;
  message: string;
};

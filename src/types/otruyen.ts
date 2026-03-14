export type OTruyenQuery = {
  page?: string;
  keyword?: string;
  [key: string]: any;
};

export type OTruyenResponse<T = any> = {
  status: string;
  message: string;
  data: T;
};

export type OTruyenQuery = {
  page?: string;
  keyword?: string;
  [key: string]: any;
};

export interface OTruyenChapterData {
  filename: string;
  chapter_name: string;
  chapter_title: string;
  chapter_api_data: string;
}

export interface OTruyenServerData {
  server_name: string;
  server_data: OTruyenChapterData[];
}

export interface OTruyenItem {
  _id: string;
  name: string;
  slug: string;
  origin_name: string[];
  content: string;
  status: string;
  thumb_url: string;
  poster_url: string;
  author: string[];
  category: Array<{ id: string; name: string; slug: string }>;
  updatedAt: string;
  chapters?: OTruyenServerData[];
}

export type OTruyenResponse<T = any> = {
  status: string;
  message: string;
  data: T;
};

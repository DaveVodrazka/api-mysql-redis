export type PostData = {
  title: string;
  firstParagraph: string;
  article: string;
  firstName: string;
  lastName: string;
  created: string;
  updated: string | null;
}
export type PostDataInsert = {
  title: string;
  firstParagraph: string;
  article: string;
  authorId: number;
}
export type Author = {
  firstName: string;
  lastName: string;
}
export type NullablePostData = PostData | null;
export type PostDataList = [PostData];
export type NullablePostDataList = PostDataList | null;
export type ResultInfo = "success" | "failure";
export type CacheConfig = {
  singlePostExpiry?: number;
  multiPostExpiry?: number;
};

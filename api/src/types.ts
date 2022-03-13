export type PostData = {
  title: string;
  firstParagraph: string;
  article: string;
  firstName: string;
  lastName: string;
}
export type PostDataInsert = {
  title: string;
  firstParagraph: string;
  article: string;
  authorId: number;
}
export type NullablePostData = PostData | null;
export type PostDataList = [PostData];
export type NullablePostDataList = PostDataList | null;
export type CacheConfig = {
  singlePostExpiry?: number;
  multiPostExpiry?: number;
};

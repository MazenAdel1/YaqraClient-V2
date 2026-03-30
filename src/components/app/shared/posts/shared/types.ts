export type DeletePostProps = {
  postId: number;
  title?: string;
  queryKey: string;
};

export type PostBaseProps = {
  id: number;
  userId: string;
  username: string;
  createdDate: string;
  likeCount: number;
  isLiked: boolean;
};

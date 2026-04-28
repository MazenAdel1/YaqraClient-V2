export type PostActionsProps = {
  postId: number;
  likeCount: number;
  isLiked: boolean;
  children: React.ReactNode;
  queryKey: (string | number)[];
};

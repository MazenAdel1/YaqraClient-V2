export type CommentsDialogProps = {
  children: React.ReactNode;
  postId: number;
};

export type CommentProps = {
  id: number;
  content: string;
  parentCommentId: number | null;
  replies: CommentProps[];
  likeCount: number;
  isLiked: boolean;
  postId: number;
  user: {
    userId: string;
    username: string;
    picture: string | null;
  };
};

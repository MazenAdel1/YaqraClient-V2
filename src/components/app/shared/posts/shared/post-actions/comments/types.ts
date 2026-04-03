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
  createdDate: string;
  user: {
    userId: string;
    username: string;
    profilePicture: string | null;
  };
};

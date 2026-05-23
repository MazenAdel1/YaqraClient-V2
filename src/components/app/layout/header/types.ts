export type NotificationProps = {
  id: number;
  receiverId: string;
  postId: number;
  message: string;
  isAck: boolean;
  createdDate: Date;
  postType: string;
};

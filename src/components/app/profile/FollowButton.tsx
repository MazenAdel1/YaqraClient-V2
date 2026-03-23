import { Button } from "@/components/ui/button";
import { axios } from "@/lib/axios";
import { UserState } from "@/stores/user-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function FollowButton({ user }: { user: UserState }) {
  const queryClient = useQueryClient();

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      await axios.post("/user/follow", {
        UserId: user.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profile", user.id],
      });
    },
  });

  const handleFollow = async () => {
    await mutateAsync();
  };

  return (
    <Button
      className="w-25"
      onClick={handleFollow}
      variant={user.isFollowed ? "outline" : "default"}
    >
      {user.isFollowed ? "إلغاء المتابعة" : "متابعة"}
    </Button>
  );
}

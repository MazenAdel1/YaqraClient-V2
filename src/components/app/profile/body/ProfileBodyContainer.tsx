import { Tabs } from "./tabs";
import { TabValue } from "./types";
import ProfileBody from "./ProfileBody";

export default function ProfileBodyContainer({
  userId,
  activeTab,
}: {
  userId: string;
  activeTab: TabValue;
}) {
  return (
    <section className="flex w-full max-w-150 flex-col gap-15 self-center">
      <Tabs userId={userId} activeTab={activeTab} />
      <ProfileBody activeTab={activeTab} userId={userId} />
    </section>
  );
}

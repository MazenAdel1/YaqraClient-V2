import { Tabs } from "./tabs";
import Data from "./Data";
import { TabValue } from "./types";

export default function DataContainer({
  userId,
  activeTab,
}: {
  userId: string;
  activeTab: TabValue;
}) {
  return (
    <section className="flex w-full max-w-150 flex-col gap-6 self-center">
      <Tabs userId={userId} activeTab={activeTab} />
      <Data activeTab={activeTab} userId={userId} />
    </section>
  );
}

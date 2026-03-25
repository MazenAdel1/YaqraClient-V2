import DataContainer from "@/components/app/profile/data/DataContainer";
import { TABS } from "@/components/app/profile/data/consts";
import { TabValue } from "@/components/app/profile/data/types";
import ProfileHeaderClient from "@/components/app/profile/user-info/ProfileHeaderClient";

const DEFAULT_TAB: TabValue = "reviews";

const TAB_VALUES = new Set<TabValue>(TABS.map((tab) => tab.value));

function getActiveTab(tab: string | undefined): TabValue {
  if (tab && TAB_VALUES.has(tab as TabValue)) {
    return tab as TabValue;
  }

  return DEFAULT_TAB;
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab } = await searchParams;
  const activeTab = getActiveTab(tab);

  return (
    <div className="flex flex-col gap-8">
      <ProfileHeaderClient userId={id} />
      <DataContainer userId={id} activeTab={activeTab} />
    </div>
  );
}

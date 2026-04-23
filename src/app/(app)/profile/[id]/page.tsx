import {
  ProfileBodyContainer,
  TabValue,
  TABS,
} from "@/components/app/profile/body";
import { ProfileHeaderClient } from "@/components/app/profile/user-info";

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
    <div className="container flex flex-col gap-8">
      <ProfileHeaderClient userId={id} />
      <ProfileBodyContainer userId={id} activeTab={activeTab} />
    </div>
  );
}

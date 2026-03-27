import { TABS } from "./consts";

export type TabValue = (typeof TABS)[number]["value"];

export type TabsProps = {
  userId: string;
  activeTab: TabValue;
};

export type DataProps = {
  activeTab: TabValue;
  userId: string;
};

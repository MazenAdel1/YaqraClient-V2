import { Button } from "@/components/ui/button";
import { TABS } from "../consts";
import { TabsProps } from "../types";
import Link from "next/link";

export default function Tabs({ userId, activeTab }: TabsProps) {
  const currentTab = TABS.find((tab) => tab.value === activeTab);

  return (
    <section>
      <div className="grid grid-cols-4 gap-1">
        {TABS.map((tab) => {
          const isActive = tab.value === currentTab?.value;

          return (
            <Button
              variant={isActive ? "default" : "outline"}
              className={"font-yoc text-base"}
              key={tab.value}
              nativeButton={false}
              render={
                <Link
                  href={{
                    pathname: `/profile/${userId}`,
                    query: { tab: tab.value },
                  }}
                  scroll={false}
                >
                  {tab.title}
                  <tab.icon className="size-3.5" />
                </Link>
              }
            />
          );
        })}
      </div>
    </section>
  );
}

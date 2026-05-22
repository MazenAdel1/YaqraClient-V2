import { Aside } from "@/components/app/feed-community/shared";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Aside />
      {children}
    </>
  );
}

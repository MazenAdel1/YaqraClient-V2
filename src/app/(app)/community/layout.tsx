import { Aside } from "@/components/app/feed";

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

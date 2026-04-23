import { Header, Aside } from "@/components/app/layout";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <Aside />
      <main className="container pt-28 pb-5">{children}</main>
    </div>
  );
}

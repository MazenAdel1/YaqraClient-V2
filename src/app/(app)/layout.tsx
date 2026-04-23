import { Header } from "@/components/app/layout";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="pt-28 pb-5">{children}</main>
    </div>
  );
}

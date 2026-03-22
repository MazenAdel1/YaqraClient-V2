import { Header } from "@/components/app/layout";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <main className="container pt-28">{children}</main>
    </div>
  );
}

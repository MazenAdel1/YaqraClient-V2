import AdminWrapper from "./AdminWrapper";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminWrapper>{children}</AdminWrapper>;
}

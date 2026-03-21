import Image from "next/image";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center px-4">
      <div className="flex w-full flex-col items-center justify-center gap-10">
        <Image
          src="/logo.svg"
          loading="eager"
          alt="Yaqra Logo"
          className="w-40"
          width={200}
          height={197}
        />
        {children}
      </div>
    </main>
  );
}

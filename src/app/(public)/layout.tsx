import Image from "next/image";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-10">
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

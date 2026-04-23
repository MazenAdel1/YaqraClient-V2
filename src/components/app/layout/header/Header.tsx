import Image from "next/image";
import Link from "next/link";
import Notification from "./Notification";
import User from "./User";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    <header className="bg-dark-gray border-light-gray fixed top-0 left-1/2 w-full -translate-x-1/2 border-b shadow-sm shadow-black">
      <div className="container flex w-full items-center justify-between py-5">
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={100} height={40} />
        </Link>
        <div className="flex items-center gap-3">
          <Notification />
          <User />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

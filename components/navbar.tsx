import Link from "next/link";
import { DarkMode } from "./dark-mode";
import { TaraxaIcon } from "./ui/icons";
import { WalletAddress } from "./wallet-address";

export const Navbar = () => {
  return (
    <nav className="navbar bg-base-100 fixed w-full z-50">
      <div className="mx-auto container py-6 sm:px-6 lg:px-8">
        <div className="relative flex h-[60px] items-center justify-between w-full">
          <div className="flex items-center justify-start">
            <Link
              href="/"
              className="rounded-xl p-3 flex justify-center content-center no-underline"
            >
              <div className="flex flex-shrink-0 items-center gap-3">
                <TaraxaIcon size={43} />
                <h1 className="font-semibold text-2xl">Ficus Root Bridge</h1>
              </div>
            </Link>
          </div>
          <div className="flex gap-4">
            <WalletAddress />
            <DarkMode />
          </div>
        </div>
      </div>
    </nav>
  );
};

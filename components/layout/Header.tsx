"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useAccount } from "wagmi";

export function Header() {
  const { chain } = useAccount();
  const isWrongNetwork = chain?.id !== 11155111;

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              AI Safety Notary
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Home
              </Link>
              <Link
                href="/submit"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Submit
              </Link>
              <Link
                href="/incidents"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Incidents
              </Link>
              <Link
                href="/verify"
                className="text-gray-700 hover:text-gray-900 transition"
              >
                Verify
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {isWrongNetwork && (
              <div className="hidden sm:block px-3 py-1 bg-red-100 text-red-800 text-sm rounded-md">
                Wrong Network - Switch to Sepolia
              </div>
            )}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Web3Provider = dynamic(
  () => import("./Web3Provider").then((mod) => mod.Web3Provider),
  { ssr: false }
);

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return <Web3Provider>{children}</Web3Provider>;
}

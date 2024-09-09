"use client";

import { useConnection } from "@/hooks/useConnection";
import { networks } from "@/types/networks";
import Link from "next/link";

type ExplorerLinkProps = {
  type: 'tx' | 'address' | 'block' | 'pbft';
  value: string;
};

export const ExplorerLink = ({ value, type }: ExplorerLinkProps) => {
  const { chainId } = useConnection();
  const network = networks[chainId]?.blockExplorerUrl;
  const url = `${network}${type}/${value}`;

  if (!value) return null;

  return (
    <Link
      href={url}
      target="_blank"
      aria-label="Explorer"
      className="text-xs text-primary hover:underline"
    >
      View on Taraxa Explorer
    </Link>
  );
};

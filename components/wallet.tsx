"use client";

import { MetamaskIcon } from "./ui/icons";
import { useConnection } from "@/hooks/useConnection";
import WrongNetwork from "./wrong-network";
import clsx from "clsx";

export type WalletActionBtn = {
  action: () => void;
  btnName: string;
  disabled?: boolean;
  btnColor?: "primary" | "secondary" | "warning" | "error" | "neutral" | "base";
  isLoading?: boolean;
  size?: "xs" | "sm" | "lg";
  fullWidth?: boolean;
};

export type WalletProps = {
  actionBtn?: WalletActionBtn;
};

export const Wallet = ({ actionBtn }: WalletProps) => {
  const { status, connect, isOnWrongChain } = useConnection();

  if (status === "notConnected") {
    return (
      <button className="btn btn-lg btn-primary" onClick={() => connect()}>
        <MetamaskIcon className="text-default-500" />
        Connect Wallet
      </button>
    );
  }

  if (status === "unavailable") {
    return (
      <button className="btn btn-lg" disabled>
        Metamask not available
      </button>
    );
  }
  if (status === "connecting") {
    return (
      <button className="btn btn-lg" disabled>
        Connecting <span className="loading loading-dots loading-lg"></span>
      </button>
    );
  }

  if (status === "connected" && isOnWrongChain) {
    return <WrongNetwork />;
  }

  if (actionBtn) {
    return (
      <button
        onClick={actionBtn.action}
        disabled={!!actionBtn.disabled}
        className={clsx(
          "btn",
          actionBtn.btnColor ? `btn-${actionBtn.btnColor}` : "btn-secondary",
          actionBtn.fullWidth && "flex-grow",
          actionBtn.size && `btn-${actionBtn.size}`
        )}
      >
        {actionBtn.btnName}
        {!!actionBtn.isLoading && (
          <span className={`loading loading-dots loading-lg`}></span>
        )}
      </button>
    );
  }
};

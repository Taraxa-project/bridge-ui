"use client";

import * as React from "react";
import { MetaMaskProvider } from "metamask-react";
import { BridgeNetworkProvider } from "@/context/bridge-network";
import { ModalsProvider } from "../context/modal";
import { ModalsCenter } from "../components/modals";
import { WalletPopupProvider } from "../context/wallet-popup";
import { DynamicThemeWrapper } from "@/context/dynamic-theme-wrapper";
import { BridgeHistoryProvider } from "@/context/bridge-history";
// import Warning from "@/components/bridge/testnet-warning";

export function Providers({ children }: React.PropsWithChildren) {
  return (
    <>
      {/* <Warning /> */}
      <MetaMaskProvider>
        <BridgeNetworkProvider>
          <BridgeHistoryProvider>
            <DynamicThemeWrapper>
              <ModalsProvider>
                <WalletPopupProvider>{children}</WalletPopupProvider>
                <ModalsCenter />
              </ModalsProvider>
            </DynamicThemeWrapper>
          </BridgeHistoryProvider>
        </BridgeNetworkProvider>
      </MetaMaskProvider>
    </>
  );
}

"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { BridgeNetwork, bridgeNetworks } from "@/types/bridge-networks";
import { Coin } from "@/config/coinConfigs";
import useCMetamask from "@/hooks/useCMetamask";
import { TARA_CHAIN_ID } from "@/types/addresses";

export enum BridgeToggleType {
  BRIDGE = "Bridge",
  HISTORY = "History",
}

type BridgeNetworkContextType = {
  bridgeNetworks: BridgeNetwork[];
  fromNetwork: BridgeNetwork;
  toNetwork: BridgeNetwork;
  coin: Coin | null;
  amount: string | null;
  setFromNetwork: (network: BridgeNetwork) => void;
  setToNetwork: (network: BridgeNetwork) => void;
  setCoin: (coin: Coin) => void;
  setAmount: (amount: string | null) => void;
  toggleValue: BridgeToggleType;
  setToggleValue: (value: BridgeToggleType) => void;
};

const BridgeNetworkContext = createContext<BridgeNetworkContextType>({
  bridgeNetworks: bridgeNetworks,
  fromNetwork: bridgeNetworks[1],
  toNetwork: bridgeNetworks[0],
  coin: null,
  amount: "0",
  setFromNetwork: (network: BridgeNetwork) => {},
  setToNetwork: (network: BridgeNetwork) => {},
  setCoin: (coin: Coin) => {},
  setAmount: () => {},
  toggleValue: BridgeToggleType.BRIDGE,
  setToggleValue: (value: BridgeToggleType) => {},
});

export const BridgeNetworkProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { status, chainId } = useCMetamask();

  const [fromNetwork, setFromNetwork] = useState<BridgeNetwork>(
    bridgeNetworks[0]
  );
  const [toNetwork, setToNetwork] = useState<BridgeNetwork>(bridgeNetworks[1]);
  const [toggleValue, setToggleValue] = useState(BridgeToggleType.BRIDGE);
  const [coin, setCoin] = useState<Coin | null>(null);
  const [amount, setAmount] = useState<string | null>(0);

  useEffect(() => {
    if (status === "connected") {
      setFromNetwork(
        chainId === TARA_CHAIN_ID ? bridgeNetworks[0] : bridgeNetworks[1]
      );
      setToNetwork(
        chainId === TARA_CHAIN_ID ? bridgeNetworks[1] : bridgeNetworks[0]
      );
    }
  }, [status, chainId]);

  useEffect(() => {
    setCoin(null);
  }, [fromNetwork]);

  return (
    <BridgeNetworkContext.Provider
      value={{
        fromNetwork,
        toNetwork,
        setFromNetwork,
        setToNetwork,
        bridgeNetworks,
        coin,
        setCoin,
        amount,
        setAmount,
        toggleValue,
        setToggleValue,
      }}
    >
      {children}
    </BridgeNetworkContext.Provider>
  );
};

export const useBridgeNetwork = () => {
  const context = useContext(BridgeNetworkContext);
  if (context === undefined) {
    throw new Error(
      "useBridgeNetwork must be used within BridgeNetworkProvider"
    );
  }
  return context;
};

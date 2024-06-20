"use client";

import { useEffect, useState } from "react";
import { Card } from "../card";
import { SelectNetworks } from "./select-networks";
import { SelectCoins } from "./select-coins";
import { Summary } from "./summary";
import { useBridgeNetwork } from "../../context/bridge-network";
import { SelectedNetwork } from "../selected-network";
import { ChevronForwardIcon } from "../ui/icons";
import Image from "next/image";

export const BridgeCard = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const showTopCard = step > 1;
  const { fromNetwork, toNetwork, coin, amount, setAmount } =
    useBridgeNetwork();

  useEffect(() => {
    if (step == 1) {
      setAmount(null);
    }
  }, [setAmount, step]);

  const topCard: JSX.Element = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <SelectedNetwork
          title="Transfer From"
          name={fromNetwork.chainName}
          image={{
            src: fromNetwork.iconUrl,
            alt: fromNetwork.chainName,
            height: 30,
            width: fromNetwork.isImageTall ? 20 : 30,
          }}
        />
        <ChevronForwardIcon />
        <SelectedNetwork
          title="Transfer To"
          name={toNetwork.chainName}
          image={{
            src: toNetwork.iconUrl,
            alt: toNetwork.chainName,
            height: 30,
            width: toNetwork.isImageTall ? 20 : 30,
          }}
        />
      </div>
      {step > 2 && (
        <div className="flex flex-col gap-4 justify-center items-center">
          {amount && coin && (
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex flex-row gap-4 items-center">
                <Image
                  src={coin.iconUrl}
                  alt={coin.name}
                  height={30}
                  width={coin.isImageTall ? 20 : 30}
                />
                <p>Amount:</p>
              </div>
              <div className="flex gap-2">
                <p>{amount}</p>
                <p>{coin.symbol}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Card className="p-10" showTopCard={showTopCard} topCardContent={topCard}>
      {step == 1 && (
        <div className="flex flex-col gap-5">
          <SelectNetworks onContinue={() => setStep(2)} />
        </div>
      )}
      {step == 2 && (
        <div className="flex flex-col gap-5">
          <SelectCoins
            onBack={() => setStep(1)}
            onContinue={() => setStep(3)}
          />
          {/* <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
            <p className="text-sm">Max transaction cost</p>
            <p className="text-sm font-medium">$88.46</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
            <p className="text-sm">Allowance</p>
            <p className="text-sm font-medium">0.0 stTara</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
            <p className="text-sm">Exchange rate</p>
            <p className="text-sm font-medium">1 Tara = 1 Lara</p>
          </div> */}
        </div>
      )}
      {step == 3 && (
        <div className="flex flex-col gap-5">
          <Summary onBack={() => setStep(2)} />
        </div>
      )}
    </Card>
  );
};

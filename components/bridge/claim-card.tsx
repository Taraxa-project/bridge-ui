"use client";

import { utils } from "ethers";
import { useState } from "react";
import { Card } from "../ui/card";
import { ClaimNetwork } from "./claim-network";
import { SelectedNetwork } from "../selected-network";
import { useBridgeNetwork } from "@/context/bridge-network";
import { ClaimTokens } from "./claim-tokens";
import { ClaimSummary } from "./claim-summary";
import { Countdown } from "./countdown-epoch";
import { useLastFinalizedBlock } from "../../hooks/useLastFinalizedBlock";
import {
  ETH_CHAIN_ID,
  TARA_CHAIN_ID,
  graphqlApiEthereum,
  graphqlApiTaraxa,
} from "@/types/addresses";
import { cacheExchange, createClient, fetchExchange, Provider } from "urql";
import { Claim } from "@/types/claim";

export const ClaimCard = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { fromNetwork, setCoin } = useBridgeNetwork();
  const [claim, setClaim] = useState<Claim | null>(null);
  const { blockInfo, isLoading } = useLastFinalizedBlock();

  const onClaimSuccess = () => {
    setStep(1);
  };

  const showTopCard = true;

  const topCard: JSX.Element = (
    <div className="flex flex-col gap-4">
      {blockInfo.timeLeft && (
        <div>
          <Countdown
            seconds={parseInt(blockInfo.timeLeft, 10)}
            isLoading={isLoading}
          />
        </div>
      )}
      {step > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <SelectedNetwork
            title="Selected network"
            name={fromNetwork.chainName}
            image={{
              src: fromNetwork.iconUrl,
              alt: fromNetwork.chainName,
              height: 30,
              width: fromNetwork.isImageTall ? 20 : 30,
            }}
          />
        </div>
      )}
      {step > 2 && (
        <div className="flex flex-col gap-4 justify-center items-center">
          {claim && (
            <div className="flex flex-col sm:flex-row gap-4">
              <p>Claim Amount:</p>
              <div className="flex gap-2">
                <p>
                  {utils
                    .formatUnits(claim.amount, claim.coin?.decimals || 18)
                    .slice(0, 8)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const onClaim = (claim: Claim) => {
    setClaim(claim);
    setCoin(claim.coin);
    setStep(3);
  };

  const ethereumClient = createClient({
    url: graphqlApiEthereum,
    exchanges: [cacheExchange, fetchExchange],
  });

  const taraxaClient = createClient({
    url: graphqlApiTaraxa,
    exchanges: [cacheExchange, fetchExchange],
  });

  return (
    <Card className="p-10" showTopCard={showTopCard} topCardContent={topCard}>
      {step == 1 && <ClaimNetwork onContinue={() => setStep(2)} />}
      {step == 2 && (
        <>
          {fromNetwork.chainId === ETH_CHAIN_ID && (
            <Provider value={ethereumClient}>
              <ClaimTokens onBack={() => setStep(1)} onContinue={onClaim} />
            </Provider>
          )}
          {fromNetwork.chainId === TARA_CHAIN_ID && (
            <Provider value={taraxaClient}>
              <ClaimTokens onBack={() => setStep(1)} onContinue={onClaim} />
            </Provider>
          )}
        </>
      )}
      {step == 3 && claim && (
        <div className="flex flex-col gap-5">
          <ClaimSummary
            claim={claim}
            onBack={() => setStep(2)}
            onClaimSuccess={onClaimSuccess}
          />
        </div>
      )}
    </Card>
  );
};

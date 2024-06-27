import { useEffect, useState } from "react";
import { useBridgeNetwork } from "../context/bridge-network";

import { BigNumber, ethers } from "ethers";
import { useBridgeContract } from "./useBridgeContract";
import { TARA_CHAIN_ID } from "../types/addresses";

export interface BlockInfo {
  currentBlockNumber: number;
  lastFinalizedBlockNumber: number;
  finalizationInterval: number;
  timeLeft: string;
  status: string;
  error: string;
}

export const useLastFinalizedBlock = () => {
  const [blockInfo, setBlockInfo] = useState<BlockInfo>({
    currentBlockNumber: 0,
    lastFinalizedBlockNumber: 0,
    finalizationInterval: 0,
    timeLeft: "",
    status: "",
    error: "",
  });
  const { fromNetwork } = useBridgeNetwork();
  const { getBridgeContract, config, provider } =
    useBridgeContract(fromNetwork);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLastFinalizedBlock = async () => {
      try {
        setIsLoading(true);
        const contract = await getBridgeContract();
        if (!contract || !provider) {
          setBlockInfo((prev) => ({
            ...prev,
            status: "Fail",
            error: "Contract not available",
          }));
          return;
        }
        const currentBlockNumber = await provider.getBlockNumber();

        if (fromNetwork.chainId === TARA_CHAIN_ID) {
          const taraxaConfig = await provider.send("taraxa_getConfig", []);
          const pillar = taraxaConfig.hardforks.ficus_hf;
          const block_num = BigNumber.from(pillar.block_num).toNumber();
          const pillar_blocks_interval = BigNumber.from(
            pillar.pillar_blocks_interval
          ).toNumber();

          const noOfBlocksSoFar =
            (currentBlockNumber - block_num) / pillar_blocks_interval;

          const nextBlock =
            Math.ceil(noOfBlocksSoFar) * pillar_blocks_interval + block_num;

          const difference = nextBlock - currentBlockNumber;
          const time = Math.round(difference * config.seconds);
          setBlockInfo({
            currentBlockNumber: currentBlockNumber,
            lastFinalizedBlockNumber: block_num,
            finalizationInterval: pillar_blocks_interval,
            timeLeft: time.toString(),
            status: "Fetching finalized block successful",
            error: "",
          });
        } else {
          const lastFinalizedBlock = await contract.lastFinalizedBlock();
          const finalizationInterval = await contract.finalizationInterval();
          const currentBlockBN = ethers.BigNumber.from(currentBlockNumber);

          const blocksSinceFinalization =
            currentBlockBN.sub(lastFinalizedBlock);
          const totalBlocks = blocksSinceFinalization.add(finalizationInterval);
          const secondsPerBlock = ethers.BigNumber.from(config.seconds);
          const timeLeft = totalBlocks.mul(secondsPerBlock);

          setBlockInfo({
            currentBlockNumber: currentBlockNumber,
            lastFinalizedBlockNumber: lastFinalizedBlock.toNumber(),
            finalizationInterval: finalizationInterval.toNumber(),
            timeLeft: timeLeft.toString(), // Store as string to avoid JavaScript number issues
            status: "Fetching finalized block successful",
            error: "",
          });
        }

        setIsLoading(false);
      } catch (e) {
        setBlockInfo((prev) => ({
          ...prev,
          status: "Fail",
          error: "Something went wrong",
        }));
        console.error(e);
      }
      setIsLoading(false);
    };
    void fetchLastFinalizedBlock();
  }, [config.seconds, getBridgeContract, provider]);

  return { blockInfo, isLoading };
};

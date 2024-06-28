import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useConnection } from "./useConnection";
import { useWalletPopup } from "../context/wallet-popup";
import { useBridgeNetwork } from "../context/bridge-network";
import { ABIs } from "../types/abis";
import useChain from "./useChain";

export const useClaimErc20 = () => {
  const { coin } = useBridgeNetwork();
  const { provider, signer } = useChain();
  const [fee, setFee] = useState<string | null>(null);
  const { account } = useConnection();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { asyncCallback } = useWalletPopup();

  useEffect(() => {
    const getFeeToClaim = async () => {
      const claimContract = await getClaimContract();
      const feeToClain = await claimContract!.feeToClaim(account);
      const valueInEther = ethers.utils.formatEther(feeToClain.toString());
      setFee(valueInEther);
    };
    void getFeeToClaim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const onClaim = useCallback(
    async (account: string, contract: ethers.Contract) => {
      const feeToClain = await contract!.feeToClaim(account);
      const valueInEther = ethers.utils.formatEther(feeToClain.toString());
      setFee(valueInEther);
      return await contract!.claim({
        value: ethers.utils.parseEther(valueInEther),
      });
    },
    []
  );

  const claim = async (onSuccess: () => void) => {
    if (!account) {
      setStatus("Fail");
      setError("Contract not available");
      return;
    }

    const claimContract = await getClaimContract();

    if (!claimContract) {
      setStatus("Fail");
      setError("Contract not available");
      return;
    }

    setIsLoading(true);
    asyncCallback(
      async () => {
        return await onClaim(account, claimContract);
      },
      () => {
        setIsLoading(false);
        setStatus("Lock successful");
        setError("");
        onSuccess();
      },
      () => {
        setIsLoading(false);
        setStatus("Fail");
        setError("Transaction failed");
      }
    );
  };

  const getClaimContract = async () => {
    let instance: ethers.Contract | undefined;

    if (!provider || !signer) {
      return instance;
    }
    const contractAddress = coin?.connectorAddress;
    const abi = ABIs.ClaimingConnector.abi;
    if (!contractAddress) {
      setStatus("Fail");
      setError("Contract address missing from coin");
      return;
    }
    const contract = new ethers.Contract(contractAddress, abi, provider);
    return contract.connect(signer);
  };

  const resetState = () => {
    setStatus("");
    setError("");
  };

  useEffect(() => {
    resetState();
  }, [account]);

  return { claim, isLoading, status, error, resetState, fee };
};

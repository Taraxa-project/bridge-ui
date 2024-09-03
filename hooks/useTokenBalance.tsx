import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import { useConnection } from "./useConnection";
import useChain from "./useChain";
import { useBridgeNetwork } from "../context/bridge-network";

const erc20Abi = [
  // Minimal ERC20 ABI
  "function balanceOf(address owner) view returns (uint256)",
];

export const useTokenBalance = () => {
  const { coin } = useBridgeNetwork();
  const { account } = useConnection();
  const { provider } = useChain();
  const [balance, setBalance] = useState<string>("0");
  const [refetch, setRefetch] = useState<number>(0);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBalance = async () => {
      if (!account || !provider || !coin) {
        setError("Account, token address, or provider not available");
        setBalance("0");
        return;
      }
      try {
        if (coin?.isNative) {
          const balance = await provider.getBalance(account);
          const valueInEther = ethers.utils.formatEther(balance.toString());
          setBalance(valueInEther);
        } else {
          const tokenAddress = coin?.deployAddress!;
          const tokenContract = new ethers.Contract(
            tokenAddress,
            erc20Abi,
            provider
          );
          const balance = await tokenContract.balanceOf(account);
          const valueInEther = ethers.utils.formatUnits(balance, coin.decimals);
          setBalance(valueInEther);
        }
      } catch (error) {
        console.error(error);
        setError("Failed to fetch token balance");
        setBalance("0");
      }
    };
    if (account && provider && coin) {
      fetchBalance();
    }
  }, [account, coin, provider, refetch]);

  return { balance, refetch: () => setRefetch(refetch + 1), error };
};

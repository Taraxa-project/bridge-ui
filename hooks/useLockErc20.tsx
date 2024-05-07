import { utils } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { useContract } from "./useContract";
import { useConnection } from "./useConnection";
import { useTokenApprove } from "./useTokenApprove";
import { AddressType } from "../types";

export const useLockErc20 = () => {
  const { account } = useConnection();
  const { taraConnectorContract } = useContract();
  const [isLoading, setIsLoading] = useState(false);
  const [state, setState] = useState({ status: "", error: "" });
  const approve = useTokenApprove();

  const lock = useCallback(
    async (amount: number, tokenAddress: string, onSuccess: () => void) => {
      if (!taraConnectorContract || !account) {
        setState({ status: "Fail", error: "Contract not available" });
        return;
      }

      try {
        setIsLoading(true);
        await approve(account, tokenAddress as AddressType);
        const tx = await taraConnectorContract.lock(
          utils.parseEther(`${amount}`),
          {
            value: utils.parseEther(`${amount}`),
          }
        );
        await tx.wait();
        setIsLoading(false);
        setState({ status: "Lock successful", error: "" });
        onSuccess();
      } catch (error: any) {
        console.error(error);
        setIsLoading(false);
        const errorMessage = error.reason
          ? error.reason.split(":").pop()?.trim()
          : error.message;

        setState({
          status: "Fail",
          error: errorMessage,
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [taraConnectorContract, account]
  );

  const resetState = () => {
    setState({ status: "", error: "" });
  };

  useEffect(() => {
    setState({ status: "", error: "" });
  }, [account]);

  return { lock, isLoading, state, resetState };
};
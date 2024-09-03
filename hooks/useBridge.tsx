import { useBridgeNetwork } from "../context/bridge-network";
import { useBurnErc20 } from "./useBurnErc20";
import { useLockNative } from "./useLockNative";
import { useLock } from "./useLock";

export const useBridge = () => {
  const { coin } = useBridgeNetwork();

  const { lock: lockNative, isLoading: isLoadingNative } = useLockNative();
  const { lock: lockERC20, isLoading: isLoadingERC20 } = useLock();
  const { burn, isLoading: isLoadingBurnErc20 } = useBurnErc20();

  const lock = coin?.isNative
    ? lockNative
    : coin?.connectorType === "Locking"
    ? lockERC20
    : burn;
  const isLoading = coin?.isNative
    ? isLoadingNative
    : coin?.connectorType === "Locking"
    ? isLoadingERC20
    : isLoadingBurnErc20;

  const onBridge = async (amount: number, onSuccess: () => void) => {
    await lock(amount, onSuccess);
  };

  return {
    onBridge,
    isLoading,
  };
};

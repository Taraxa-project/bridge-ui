import { useBridgeNetwork } from "@/context/bridge-network";
import { useClaimErc20 } from "./useClaimErc20";
import { useClaimNative } from "./useClaimNative";

export const useClaim = (onSuccess: () => void) => {
  const { coin } = useBridgeNetwork();

  const {
    claim: claimNative,
    isLoading: isLoadingNative,
    fee: feeNative,
  } = useClaimNative();
  const {
    claim: claimErc20,
    isLoading: isLoadingErc20,
    fee: feeErc20,
  } = useClaimErc20();
  const claim = coin?.isNative ? claimNative : claimErc20;
  const isLoading = coin?.isNative ? isLoadingNative : isLoadingErc20;
  const fee = coin?.isNative ? feeNative : feeErc20;

  const onClaim = async () => {
    await claim(onSuccess);
  };

  return {
    onClaim,
    isLoading,
    fee,
  };
};

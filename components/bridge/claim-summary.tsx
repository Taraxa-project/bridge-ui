import { Claim } from "@/types/claim";
import { Wallet } from "../wallet";
import { useClaim } from "@/hooks/useClaim";
import { useBridgeNetwork } from "../../context/bridge-network";

export type ClaimSummaryProps = {
  claim: Claim;
  onBack: () => void;
  onClaimSuccess: () => void;
};

export const ClaimSummary = ({
  claim,
  onBack,
  onClaimSuccess,
}: ClaimSummaryProps) => {
  const { onClaim, fee } = useClaim(onClaimSuccess);
  const { fromNetwork } = useBridgeNetwork();

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="text-sm">
          <p>Notice:</p>
          <p>
            Once you confirm, the claim will start. Transfers from Ethereum to
            Taraxa take about 30 minutes.
          </p>
        </div>
        <div className="w-full flex flex-col sm:flex-row justify-between gap-4">
          <button className="btn flex-grow" onClick={onBack}>
            Back
          </button>
          <Wallet
            actionBtn={{
              disabled: !claim,
              action: onClaim,
              btnColor: "primary",
              btnName: "Confirm",
              fullWidth: true,
            }}
          />
        </div>
      </div>
      {fee && (
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start">
          <p className="text-sm">Fee to claim</p>
          <p className="text-sm font-medium">
            {parseFloat(fee).toFixed(7)} {fromNetwork.nativeCurrency?.symbol}
          </p>
        </div>
      )}
    </>
  );
};

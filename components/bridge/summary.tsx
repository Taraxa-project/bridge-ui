import { useBridgeNetwork } from "@/context/bridge-network";
import { Wallet } from "../wallet";
import { useBridge } from "../../hooks/useBridge";
import { TARA_CHAIN_ID } from "@/types/addresses";

export type SummaryProps = {
  onBack: () => void;
};

export const Summary = ({ onBack }: SummaryProps) => {
  const { coin, amount, fromNetwork, toNetwork, setFromNetwork, setToNetwork } =
    useBridgeNetwork();
  const { onBridge, isLoading } = useBridge();

  const onBridgeSuccess = () => {
    const tempNetwork = fromNetwork;
    setFromNetwork(toNetwork);
    setToNetwork(tempNetwork);
  };

  const onConfirm = async () => {
    if (!amount) return;
    await onBridge(amount, onBridgeSuccess);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="text-sm">
        <p>Notice:</p>
        <p>
          Once you confirm, the transfer will start. Transfers from{" "}
          {fromNetwork.chainName} to {toNetwork.chainName} take about{" "}
          {fromNetwork.chainId == TARA_CHAIN_ID ? "4 hours" : "18 minutes"}.
        </p>
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-between gap-4">
        <button
          className="btn btn-sm md:btn-md lg:btn-lg flex-grow"
          onClick={onBack}
        >
          Back
        </button>
        <Wallet
          actionBtn={{
            disabled: !coin || !amount || isLoading,
            action: onConfirm,
            btnColor: "primary",
            btnName: "Confirm",
            fullWidth: true,
            isLoading: isLoading,
          }}
        />
      </div>
    </div>
  );
};

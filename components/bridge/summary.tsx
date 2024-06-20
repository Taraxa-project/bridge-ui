import { BridgeToggleType, useBridgeNetwork } from "@/context/bridge-network";
import { Wallet } from "../wallet";
import { useBridge } from "../../hooks/useBridge";

export type SummaryProps = {
  onBack: () => void;
};

export const Summary = ({ onBack }: SummaryProps) => {
  const {
    coin,
    amount,
    setToggleValue,
    fromNetwork,
    toNetwork,
    setFromNetwork,
    setToNetwork,
  } = useBridgeNetwork();
  const { onBridge, isLoading } = useBridge();

  const onBridgeSuccess = () => {
    setToggleValue(BridgeToggleType.CLAIM);
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
          Once you confirm, the transfer will start. Transfers from Ethereum to
          Taraxa take about 30 minutes.
        </p>
      </div>
      <div className="w-full flex flex-col sm:flex-row justify-between gap-4">
        <button className="btn flex-grow" onClick={onBack}>
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

import { Coin, getTokenByConnectorAddress } from "../config/coinConfigs";

export type Transfer = {
  type: "Received" | "Sent";
  coin: Coin;
  network: string;
  amount: string;
  fee: string;
  timestamp: number | null;
};

export interface ApiTransfer {
  id: string;
  type: string;
  transactionHash: string;
  connector: string;
  tokenSource: string;
  tokenDestination: string;
  address: string;
  amount: string;
  fee: string;
  block: string;
  timestamp: string;
}
export const toTransfer = (data: ApiTransfer, network: string): Transfer | {} => {
  const coin = getTokenByConnectorAddress(data.connector);
  if(!coin) {
    return {};
  }
  return {
    type: data.type === "mint" ? "Received" : "Sent",
    coin: getTokenByConnectorAddress(data.connector),
    network: network,
    amount: data.amount,
    fee: data.fee,
    timestamp:
      "timestamp" in data && data.timestamp ? Number(data.timestamp) : null,
  };
};

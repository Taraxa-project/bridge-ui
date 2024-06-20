import { useState } from "react";
import Image from "next/image";
import Table, { TableColumn } from "../ui/table";
import { sort } from "../../utils/sort";
import { DateTime } from "luxon";
import { useConnection } from "@/hooks/useConnection";
import { useQuery } from "urql";
import { ApiBalance, ApiClaim, Claim, toClaim } from "@/types/claim";
import { utils } from "ethers";
import { RefreshIcon } from "../ui/icons";

export type ClaimTokensProps = {
  onBack: () => void;
  onContinue: (claim: Claim) => void;
};

const CLAIMS_AND_BALANCES_QUERY = `
  query($account: Bytes!) {
    balances(where: { address: $account }) {
      id
      connector
      address
      amount
    }
    claims(where: { address: $account } orderBy: timestamp orderDirection: desc) {
      id
      connector
      tokenSource
      tokenDestination
      address
      amount
      timestamp
    }
  }
`;

export const ClaimTokens = ({ onContinue, onBack }: ClaimTokensProps) => {
  const { account } = useConnection();

  const [{ data, fetching }, reexecuteQuery] = useQuery({
    query: CLAIMS_AND_BALANCES_QUERY,
    variables: { account },
    pause: !account,
  });

  const [sortDescriptor, setSortDescriptor] = useState<{
    column: keyof Claim;
    direction: "ascending" | "descending";
  }>({ column: "timestamp", direction: "ascending" });

  const columns: TableColumn[] = [
    { key: "token", title: "Token", allowsSorting: true },
    { key: "amount", title: "Amount", allowsSorting: true },
    { key: "claim", title: "Claim" },
  ];

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-40">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }
  let claims = [
    ...data?.claims.map((claim: ApiClaim) => toClaim(claim)),
    ...data?.balances.map((balance: ApiBalance) => toClaim(balance)),
  ];
  const sortedData = sort(claims, sortDescriptor);

  const tableData = sortedData.map((item) => ({
    ...item,
    token: item.coin ? (
      <div className="flex items-center gap-4 h-[30px]">
        <Image
          src={item.coin.iconUrl || ""}
          alt={item.coin.name || ""}
          width={item.coin.isImageTall ? 20 : 30}
          height={30}
        />
        {item.coin.symbol || item.coin.name}
      </div>
    ) : null,
    timestamp: DateTime.fromISO(item.timestamp).toLocaleString(
      DateTime.DATE_MED
    ),
    amount: item.amount
      ? utils.formatUnits(item.amount, item.coin?.decimals || 18).slice(0, 8)
      : "0",
    claim: item.timestamp ? (
      <span className="text-primary">
        Claimed at{" "}
        {DateTime.fromSeconds(item.timestamp).toLocaleString(
          DateTime.DATETIME_MED
        )}
      </span>
    ) : (
      <button
        className="btn btn-primary btn-sm"
        onClick={() => onContinue(item)}
      >
        Claim
      </button>
    ),
  }));

  const handleSortChange = (
    column: keyof Claim,
    direction: "ascending" | "descending"
  ) => {
    setSortDescriptor({ column, direction });
  };

  const onReexecuteQuery = () => {
    reexecuteQuery({ requestPolicy: "network-only" });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-row gap-4 items-center justify-start">
        <h2 className="text-lg">Available claims</h2>
        <button className="btn btn-circle btn-xs" onClick={onReexecuteQuery}>
          <RefreshIcon size={12} />
        </button>
      </div>
      <Table
        columns={columns}
        data={tableData}
        onSortChange={(key, direction) =>
          handleSortChange(key as keyof Claim, direction)
        }
      />
      <div className="w-full flex flex-col sm:flex-row justify-between gap-4">
        <button className="btn w-full" onClick={onBack}>
          Back
        </button>
      </div>
    </div>
  );
};

import Button from "../ui/button";
import { useState } from "react";
import Table, { TableColumn } from "../ui/table";
import { sort } from "../../utils/sort";
import { DateTime } from "luxon";
import { useConnection } from "@/hooks/useConnection";
import { useQuery } from "urql";
import { ApiBalance, ApiClaim, Claim, toClaim } from "@/types/claim";

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

  const [{ data, fetching }] = useQuery({
    query: CLAIMS_AND_BALANCES_QUERY,
    variables: { account },
    pause: !account,
  });

  const [sortDescriptor, setSortDescriptor] = useState<{
    column: keyof Claim;
    direction: "ascending" | "descending";
  }>({ column: "timestamp", direction: "descending" });

  const columns: TableColumn[] = [
    { key: "token", title: "Token", allowsSorting: true },
    { key: "amount", title: "Amount", allowsSorting: true },
    { key: "claim", title: "Claim" },
  ];

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
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
    timestamp: DateTime.fromISO(item.timestamp).toLocaleString(
      DateTime.DATE_MED
    ),
    amount: item.amount.toFixed(4),
    claim: (
      <Button color="primary" size="sm" onClick={() => onContinue(item)}>
        Claim
      </Button>
    ),
  }));

  const handleSortChange = (
    column: keyof Claim,
    direction: "ascending" | "descending"
  ) => {
    setSortDescriptor({ column, direction });
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-lg">Available claims</h2>
      {fetching ? (
        <div className="flex items-center justify-center h-64">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : (
        <Table
          columns={columns}
          data={tableData}
          onSortChange={(key, direction) =>
            handleSortChange(key as keyof Claim, direction)
          }
        />
      )}
      <div className="w-full flex flex-col sm:flex-row justify-between gap-4">
        <Button fullWidth onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  );
};

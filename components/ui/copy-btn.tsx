import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

type CopyBtnProps = {
  value: string | number;
};

export const CopyBtn = ({ value }: CopyBtnProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const onClick = async () => {
    if (value) {
      await navigator.clipboard.writeText(`${value}`);
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  };

  return (
    <button
      type="button"
      className="btn btn-primary btn-sm"
      disabled={!value}
      onClick={onClick}
    >
      {isCopied ? <CheckIcon /> : <CopyIcon />}
    </button>
  );
};

"use client";

import { bridgeFaq } from "@/types/faqs";
import { Faq } from "../faq";
import { BridgeCard } from "./bridge-card";

export const BridgeContainer = () => {
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-20 w-full">
        <BridgeCard />
        <Faq items={bridgeFaq} />
      </div>
    </div>
  );
};
